import React, {useState, useEffect, useRef} from 'react';
import axios from "axios";

import '../css/BoardWrite.css';
import getCookie from '../components/GetCookie';
import {HiOutlineLocationMarker} from "react-icons/hi";

const BoardWrite = () => {

    //쿠키 가져 오기
    const user_id = getCookie('userid');
    console.log(user_id);

    const [title, setTitle] = useState('');
    const [departure, setDeparture] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [meeting_time, setMeeting_time] = useState('');
    const [mem_cnt, setMem_cnt] = useState('all');
    const [gender, setGender] = useState('');
    const [sound, setSound] = useState('');
    const [content, setContent] = useState('');
    // const [user_id, setUser_id] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    //POI 추가
    const [startPointLat, setStartPointLat] = useState(null);
    const [startPointLon, setStartPointLon] = useState(null);
    const [endPointLat, setEndPointLat] = useState(null);
    const [endPointLon, setEndPointLon] = useState(null);
    const [startKeyword, setStartKeyword] = useState(null);
    const [endKeyword, setEndKeyword] = useState(null);
    const isMounted = useRef(false); //첫번째 랜더링에는 useEffect가 실행되지 않도록 하는 flag 값
    const { Tmapv2 } = window;
    const [resultPoisObj, setResultPoisObj] = useState(null);

    const handleTitleChange = (e) => {
        if (e.target.value.length > 20) {
            setErrorMessage('제목은 20자 이내로 써주세요.');
        } else {
            setErrorMessage('');
            setTitle(e.target.value);
        }
    };

    // 교수님 코드 보고 따라 하긴 했는데 왜 굳이 Ref가 필요한지 모르겠다...
    const titleRef = useRef();
    const departureRef = useRef();
    const destinationRef = useRef();
    const dateRef = useRef();
    const timeRef = useRef();
    const meeting_timeRef = useRef();
    const mem_cntRef = useRef();
    const genderRef = useRef();
    const soundRef = useRef();
    const contentRef = useRef();

    console.log(mem_cnt);
    console.log(mem_cntRef);


    useEffect(() => {
        async function fetchData() {
            const response = await axios.get(`/restapi/write?user_id=${user_id}`); //API 호출
            // response.data로 데이터에 직접 접근
            const data = response.data;
            // setUser_id(data.user_id);

            if (!user_id) {
                alert('서비스 이용을 위해 로그인해주세요.');
                window.location.href = 'http://localhost:3000/Login';  // 회원 정보 변경 페이지로
            }

            if (!data.stored_file_nm || data.stored_file_nm === 'null' || data.stored_file_nm === '') {
                alert('프로필 사진을 먼저 등록해주세요.');
                window.location.href = 'http://localhost:3000/Mypage';  // 회원 정보 변경 페이지로
            }
        }
        fetchData();
    }, []);

    const registerForm = async () => {
        //유효성 검사
        if(titleRef.current.value === '') { alert("제목을 입력하세요."); titleRef.current.focus(); return false; }
        if(startKeyword === null) { alert("출발지를 입력하세요."); departureRef.current.focus(); return false; }
        if(endKeyword === null) { alert("목적지를 입력하세요."); destinationRef.current.focus(); return false; }
        if(date === '') { alert("약속날짜를 입력하세요."); dateRef.current.focus(); return false; }
        if(time === '') { alert("약속시간을 입력하세요."); timeRef.current.focus(); return false; }
        if(mem_cntRef.current.value === 'all') { alert("희망 동행 수를 입력하세요."); mem_cntRef.current.focus(); return false; }
        if(gender === '') { alert("성별을 선택하세요."); genderRef.current.focus(); return false; }
        if(sound === '') { alert("동행방식을 입력하세요."); soundRef.current.focus(); return false; }
        if(contentRef.current.value === '') { alert("내용을 입력하세요."); contentRef.current.focus(); return false; }

        if( !startPointLon || !startPointLat ||
            !endPointLon || !endPointLat){
            alert("출발지 또는 목적지의 POI 선택값이 필요합니다. 작성 후 [Enter]를 누른 후 선택하세요.");
            return;
        }

        const uploadURL = "/restapi/write";
        const formData = new FormData();

        formData.append('user_id', user_id);
        formData.append('title', titleRef.current.value);
        formData.append('departure', startKeyword);
        formData.append('destination', endKeyword);
        formData.append('meeting_time', meeting_timeRef.current.value);
        formData.append('mem_cnt', mem_cntRef.current.value);
        formData.append('gender', gender);
        formData.append('sound', sound);
        formData.append('content', contentRef.current.value);

        //POI추가
        formData.append('departure_latitude', startPointLat);
        formData.append('departure_longitude', startPointLon);
        formData.append('destination_latitude', endPointLat);
        formData.append('destination_longitude', endPointLon);

        console.log("BoardWrite In");

        try {
            const response = await fetch(uploadURL, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.message === 'GOOD') {
                alert('게시물이 등록되었습니다.');
                document.location.href = "/board/list?page=1";
            }
        } catch (error) {
            alert('시스템 장애로 게시물 등록에 실패했습니다.');
            console.error('error', error);
        }
    };

    //---------- POI START ----------------
    //POI 검색 결과 중 선택 시 출발지 OR 목적지 위도,경도 셋팅
    function selectPoi(id,arg,lat,lon){
        if(arg == 'start') {
            setStartPointLat(lat);
            setStartPointLon(lon);
        }

        if(arg == 'end') {
            setEndPointLat(lat);
            setEndPointLon(lon);
        }
        setResultPoisObj(null);
    }

    useEffect(() => {
        if (isMounted.current) {callPOIApi('start');}
    }, [startKeyword]);

    useEffect(() => {
        if (isMounted.current) callPOIApi('end');
        else { isMounted.current = true; } //첫번째 랜더링에는 실행되지 않고 이후부터는 실행되도록
    }, [endKeyword]);

    async function callPOIApi(arg) {

        //text값 가져오기
        let searchKeyword = (arg == 'start')? startKeyword : endKeyword;

        if(typeof searchKeyword == "undefined" || searchKeyword == null || searchKeyword == "") return;

        console.log('searchKeyword',searchKeyword);

        var headers = {};
        headers["appKey"]="FMHrfuOs4Z6qvFnNXfZsV2fiSbTQjiC241luv6PK";

        const url = 'https://apis.openapi.sk.com/tmap/pois?version=1&format=json&callback=result'
            + '&searchKeyword=' + searchKeyword
            + '&resCoordType=' + 'EPSG3857'
            + '&reqCoordType=' + 'WGS84GEO'
            + '&count=' + '5'
        ;

        await fetch(url,{
            method:'GET',
            headers: headers
        }).then((response) => response.json())
            .then((data)=>{ //API 호출 성공 시

                console.log("data: ",data);
                let resultpoisData = data.searchPoiInfo.pois.poi;

                let arr = [];

                // POI 조회 결과 처리
                for (let k in resultpoisData) {

                    let noorLat = Number(resultpoisData[k].noorLat);
                    let noorLon = Number(resultpoisData[k].noorLon);

                    // EPSG3857좌표계를 WGS84GEO좌표계로 변환
                    let projectionCng
                        = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(new Tmapv2.Point(noorLon, noorLat));

                    let lat = projectionCng._lat; //찐 위도, 경도
                    let lon = projectionCng._lng;

                    const resultPoisObj = {
                        'name' : resultpoisData[k].name, //시설물 명칭
                        'upperBizName' : resultpoisData[k].upperBizName, //업종 대분류명
                        'middleBizName' : resultpoisData[k].middleBizName, //업종 중분류명
                        'lowerBizName' : resultpoisData[k].lowerBizName, //업종 소분류명
                        'upperAddrName' : resultpoisData[k].upperAddrName, //표출 주소 대분류명
                        'middleAddrName' : resultpoisData[k].middleAddrName, //표출 주소 중분류명
                        'lowerAddrName' : resultpoisData[k].lowerAddrName, //표출 주소 소분류명
                        'detailAddrName' : resultpoisData[k].detailAddrName, //표출 주소 세부
                        'id' : resultpoisData[k].id,
                        'lat' : lat,
                        'lon' : lon,
                        'arg' : arg
                    };
                    arr.push(resultPoisObj);
                }
                setResultPoisObj(arr);
            }).catch((error)=> {
                console.log("error = " + error);
            });

    } // getPOIApi() END

    //---------- POI END ----------------

    return (
        <div className="boardwrite_main">
            <h1>게시물 작성</h1>
            <br />
            <div id="formZone">
                <form className="WriteForm" id="WriteForm" name="WriteForm" method="post">
                    <input type="text" id="title" className="items_title" value={title} ref={titleRef}
                           onChange={handleTitleChange} placeholder="제목을 입력하세요."></input><br/>{errorMessage &&
                    <p>{errorMessage}</p>}<br/>
                    <div className="writeContainer">
                        <div className="left-section">
                            출발지:
                            <input type="text" className="text_custom" id="searchStartKeyword" value={startKeyword}
                                   placeholder="출발지"
                                   onKeyDown={(e) => {
                                       if (e.key === "Enter") {
                                           setStartKeyword(e.target.value);
                                       }
                                   }}/>
                            <br/>
                            <br/>
                            목적지:
                            <input type="text" className="text_custom" id="searchEndKeyword" value={endKeyword}
                                   placeholder="목적지"
                                   onKeyDown={(e) => {
                                       if (e.key === "Enter") {
                                           setEndKeyword(e.target.value);
                                       }
                                   }}/>

                            <div style={{float: 'left', height: 'auto'}}>
                                <div className="rst_wrap" style={{position: "relative", zIndex: 1999}}>
                                    <div className="rst mCustomScrollbar">
                                        <ul>
                                            {resultPoisObj && resultPoisObj.map((value, index) => {

                                                return <li key={index}>
                                                    <div>
                                                        <div>
                                                            <HiOutlineLocationMarker/>
                                                            <span style={{fontWeight: 'bold'}}>{value.name}</span><br/>
                                                            <span>{value.upperBizName}</span>&nbsp;
                                                            <span>{value.middleBizName}</span>&nbsp;
                                                            <span>{value.lowerBizName}</span>
                                                        </div>
                                                        <div>
                                                            <span>{value.upperAddrName}</span>&nbsp;
                                                            <span>{value.middleAddrName}</span>&nbsp;
                                                            <span>{value.lowerAddrName}</span>&nbsp;
                                                            <span>{value.detailAddrName}</span>
                                                        </div>
                                                        <button type="button" name="sendBtn"
                                                                onClick={() => selectPoi(value.id, value.arg, value.lat, value.lon)}>
                                                            선택
                                                        </button>
                                                    </div>

                                                </li>

                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="right-section">
                        </div>
                    </div>

                    <div className="writeContainer_sec">
                        <div className="left-section_sec">
                            <div className="date-time-selector">
                                <label htmlFor="date">날짜:</label> &nbsp;
                                <input name="date" type="date" id="date" value={date} ref={dateRef}
                                       onChange={(e) => setDate(e.target.value)}/>
                                &nbsp;<label htmlFor="time">시간:</label> &nbsp;
                                <input name="time" type="time" id="time" value={time} ref={timeRef}
                                       onChange={(e) => setTime(e.target.value)}/>
                                <input type="hidden" id="meeting_time" name="meeting_time"
                                       value={`날짜 : ${date} | 시간 : ${time}`} ref={meeting_timeRef}
                                       onChange={(e) => setMeeting_time(e.target.value)}/>
                            </div>
                        </div>
                        <div className="right-section_sec">
                            인원수 : &nbsp;
                            <select onChange={(e) => setMem_cnt(e.target.value)} value={mem_cnt} ref={mem_cntRef}>
                                <option value="all" disabled>-- 아래의 내용 중에서 선택 --</option>
                                <option value='1'>1명</option>
                                <option value="2">2명</option>
                                <option value="3">3명</option>
                                <option value="4">4명</option>
                            </select>
                        </div>
                    </div>
                    <div className="writeContainer_th">
                        <div className="left-section_sec">
                            성별 :
                            <label><input type="radio" name="gender" value="OPT_GENDER_2" ref={genderRef}
                                          onChange={(e) => setGender(e.target.value)}/>남성</label>
                            <label><input type="radio" name="gender" value="OPT_GENDER_1" ref={genderRef}
                                          onChange={(e) => setGender(e.target.value)}/>여성</label>
                            <label><input type="radio" name="gender" value="OPT_GENDER_3" ref={genderRef}
                                          onChange={(e) => setGender(e.target.value)}/>FTM</label>
                            <label><input type="radio" name="gender" value="OPT_GENDER_4" ref={genderRef}
                                          onChange={(e) => setGender(e.target.value)}/>MTF</label>
                            <label><input type="radio" name="gender" value="OPT_GENDER_5" ref={genderRef}
                                          onChange={(e) => setGender(e.target.value)}/>상관없음</label>
                        </div>
                        <div className="right-section_sec">
                            대화 :
                            <label><input type="radio" name="sound" value="OPT_SOUND_1" ref={soundRef}
                                          onChange={(e) => setSound(e.target.value)}/>조용히</label>
                            <label><input type="radio" name="sound" value="OPT_SOUND_2" ref={soundRef}
                                          onChange={(e) => setSound(e.target.value)}/>상관없음</label>
                        </div>
                    </div>
                    <textarea name="content" id="content" className="board_content" value={content} ref={contentRef}
                              onChange={(e) => setContent(e.target.value)} cols="100" rows="500"
                              placeholder="내용을 입력하세요."></textarea>

                    {/*<input type="hidden" name="departure_LATITUDE" th:value="${departure_LATITUDE}"></input>*/}
                    {/*<input type="hidden" name="departure_LONGITUDE" th:value="${departure_LONGITUDE}"></input>*/}
                    {/*<input type="hidden" name="destination_LATITUDE" th:value="${destination_LATITUDE}"></input>*/}
                    {/*<input type="hidden" name="destination_LONGITUDE" th:value="${destination_LONGITUDE}"></input>*/}

                    <input type="button" className="btn_write" value="등록" onClick={() => registerForm()}/>
                    <input type="button" className="btn_cancel" value="취소" onClick={() => window.history.back()}/>
                </form>
            </div>
            <br/><br/>
        </div>
    );
};

export default BoardWrite;