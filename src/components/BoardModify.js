import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useSearchParams} from "react-router-dom";
import '../css/BoardModify.css';
import getCookie from '../components/GetCookie';


const BoardModify = () => {

    //쿠키 가져 오기
    const user_id = getCookie('userid');

    const [role, setRole] = useState('');
    const [param] = useSearchParams(); // page, keyword, seqno 상태가 들어감.
    const seqno = param.get('seqno');
    const page = param.get('page');
    const keyword = param.get('keyword')===null?'':param.get('keyword');

    const [title, setTitle] = useState('');
    const [departure, setDeparture] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [meeting_time, setMeeting_time] = useState('');
    const [mem_cnt, setMem_cnt] = useState('');
    const [gender, setGender] = useState('');
    const [sound, setSound] = useState('');
    const [stored_file_nm, setStored_file_nm] = useState('');
    const [age, setAge] = useState('');
    const [mbti, setMbti] = useState('');
    const [mem_gender, setMem_gender] = useState('');
    const [ansim_cnt, setAnsim_cnt] = useState('');
    const [content, setContent] = useState('');
    // const [user_id, setUser_id] = useState('');
    const [user_nm, setUser_nm] = useState('');

    // 교수님 코드 보고 따라 하긴 했는데 왜 굳이 Ref가 필요한지 모르겠다...
    const titleRef = useRef();
    const departureRef = useRef();
    const destinationRef = useRef();
    const meeting_timeRef = useRef();
    const mem_cntRef = useRef();
    const contentRef = useRef();

    //왜 두개로 나눴는지는 모르겠지만... 첫번째 렌더링 시 게시물 정보 가져 오기
    useEffect(() => {

        const fetchData = async () => {
            //게시물 상세 가져오기
            const response = await axios.get(`http://localhost:8080/restapi/modify?seqno=${seqno}&&page=${page}&keyword=${keyword}&user_id=${user_id}`);
            const data = response.data;

            // setCookie_stored_file_nm(data.cookie_stored_file_nm);
            setRole(data.role);
            setTitle(data.view.title);
            // setMap(view.data.map);
            setDeparture(data.view.departure);
            setDestination(data.view.destination);
            setMeeting_time(data.view.meeting_time);
            setDate(data.view.meeting_time.split('|')[0].split(':')[1].trim());
            setTime(data.view.meeting_time.split('|')[1].split(' : ')[1].trim());
            setMem_cnt(data.view.mem_cnt);
            setGender(data.view.gender);
            setSound(data.view.sound);
            setStored_file_nm(data.view.stored_file_nm);
            setUser_nm(data.view.user_nm);
            setAge(data.view.age);
            setMbti(data.view.mbti);
            setMem_gender(data.view.mem_gender);
            setAnsim_cnt(data.view.ansim_cnt);
            setContent(data.view.content);


            console.log(seqno);
            console.log(title);
            console.log(departure);
            console.log(destination);
            console.log(meeting_time);
            console.log(mem_cnt);
            console.log(gender);
            console.log(sound);
            console.log(content);

            if (!user_id) {
                alert('서비스 이용을 위해 로그인해주세요.');
                window.location.href = 'http://localhost:3000/Login';  // 회원 정보 변경 페이지로
            }

            if (!data.cookie_stored_file_nm || data.cookie_stored_file_nm === 'null' || data.cookie_stored_file_nm === '') {
                alert('프로필 사진을 먼저 등록해주세요.');
                window.location.href = 'http://localhost:3000/Mypage';  // 회원 정보 변경 페이지로
            }

        }
        fetchData();
    },[keyword, page, seqno])

    //게사물 수정
    const modifyForm = async () => {
        if(titleRef.current.value === '') { alert("제목을 입력하세요."); titleRef.current.focus(); return false; }
        if(departureRef.current.value === '') { alert("출발지를 입력하세요."); departureRef.current.focus(); return false; }
        if(destinationRef.current.value === '') { alert("목적지를 입력하세요."); destinationRef.current.focus(); return false; }
        if(contentRef.current.value === '') { alert("내용을 입력하세요."); contentRef.current.focus(); return false; }

        let formData = new FormData();


        formData.append("seqno",seqno);
        formData.append("page", page);
        formData.append('title', titleRef.current.value);
        formData.append('departure', departureRef.current.value);
        formData.append('destination', destinationRef.current.value);
        formData.append('meeting_time', meeting_timeRef.current.value);
        formData.append('mem_cnt', mem_cntRef.current.value);
        formData.append('gender', gender);
        formData.append('sound', sound);
        formData.append('content', contentRef.current.value);

        for (const entry of formData.entries()) {
            console.log(entry);
        }

        let uploadURL = "http://localhost:8080/restapi/modify";
        //let uploadURL = "/restapi/write1111111";


        await fetch(uploadURL, {
            method: 'POST',
            body: formData
        }).then((response)=> response.json())
            .then((data) => {
                console.log("컨트롤러에 보낸다")
                console.log("Response from server:", data);
                if(data.message === 'GOOD'){
                    alert("게시물이 수정되었습니다.");
                    document.location.href=`/board/view?seqno=${seqno}&page=${page}&keyword=${keyword}&user_id=${user_id}`;
                }
            }).catch((error)=> {
                alert("시스템 장애로 게시물 수정이 실패했습니다.");
                console.log("error = " + error);
            });

    }

    return (
        <div className="board_modi_view">
            <form id="ModifyForm" className="ModifyForm" name="ModifyForm" method="post">
                <h1 style={{textAlign: "center"}}>게시물 수정하기</h1>
                <br/>
                <div className="modi_container">
                    {/*<input type="hidden" id="seqno" name="seqno" th:value="${view.seqno}">*/}
                    {/*    <input type="hidden" id="page" name="page" th:value="${page}">*/}
                    {/*        <input type="hidden" id="keyword" name="keyword" th:value="${keyword}">*/}
                    <div className="top">
                        {/*<div className="bigLeft">*/}
                        {/*    <div className="map">지도</div>*/}
                        {/*</div>*/}
                        <div className="modi_bigRight">
                            <br/><br/>
                            <input type="text" id="title" className="title-input" name="title"
                                   value={title} ref={titleRef}
                                   onChange={(e) => setTitle(e.target.value)}/>
                            <br/><br/>
                            <div className="sub-detail">
                                <input type="text" id="departure" className="modi_left" name="departure"
                                       value={departure} ref={departureRef}
                                       onChange={(e) => setDeparture(e.target.value)}/>
                                <input type="text" id="destination" className="modi_right" name="destination"
                                       value={destination} ref={destinationRef}
                                       onChange={(e) => setDestination(e.target.value)}/>
                            </div>
                            <br/><br/>
                            <div className="sub-detail">
                                <div className="left">
                                    <div className="date_time_selector">
                                        <label htmlFor="date">날짜:</label>
                                        <input name="date" type="date" id="date" value={date}
                                               onChange={(e) => setDate(e.target.value)}/>
                                        <label htmlFor="time">시간:</label>
                                        <input name="time" type="time" id="time" value={time}
                                               onChange={(e) => setTime(e.target.value)}/>
                                        <input type="hidden" id="meeting_time" name="meeting_time"
                                               value={`날짜 : ${date} | 시간 : ${time}`}
                                               ref={meeting_timeRef}
                                               onChange={(e) => setMeeting_time(e.target.value)}/>
                                    </div>
                                </div>
                                <div className="modi_memcnt">
                                    인원수 :
                                    <select onChange={(e) => setMem_cnt(e.target.value)} value={mem_cnt}
                                            ref={mem_cntRef}>
                                        <option value='1'>1명</option>
                                        <option value="2">2명</option>
                                        <option value="3">3명</option>
                                        <option value="4">4명</option>
                                    </select>
                                </div>
                            </div>
                            <br/><br/>
                            <div className="sub-detail">
                                <div className="modi_left">
                                    성별 :

                                    {[
                                        {value: 'OPT_GENDER_2', label: '남성'},
                                        {value: 'OPT_GENDER_1', label: '여성'},
                                        {value: 'OPT_GENDER_3', label: 'FTM'},
                                        {value: 'OPT_GENDER_4', label: 'MTF'},
                                        {value: 'OPT_GENDER_5', label: '상관없음'},
                                    ].map((option) => (
                                        <label key={option.value}>
                                            <input
                                                type="radio"
                                                name="gender"
                                                value={option.value}
                                                checked={gender === option.label || gender === option.value}
                                                onChange={(e) => setGender(option.value)}
                                            />
                                            {option.label}
                                        </label>
                                    ))}
                                    {/*<label><input type="radio" name="gender" value="OPT_GENDER_2" checked={gender === '남성'} onChange={(e)=>setGender(e.target.value)} />남성</label>*/}
                                    {/*<label><input type="radio" name="gender" value="OPT_GENDER_1" checked={gender === '여성'} onChange={(e)=>setGender(e.target.value)} />여성</label>*/}
                                    {/*<label><input type="radio" name="gender" value="OPT_GENDER_3" checked={gender === 'FTM'} onChange={(e)=>setGender(e.target.value)} />FTM</label>*/}
                                    {/*<label><input type="radio" name="gender" value="OPT_GENDER_4" checked={gender === 'MTF'} onChange={(e)=>setGender(e.target.value)} />MTF</label>*/}
                                    {/*<label><input type="radio" name="gender" value="OPT_GENDER_5" checked={gender === '상관없음'} onChange={(e)=>setGender(e.target.value)} />상관없음</label>*/}
                                </div>
                                <div className="right">
                                    대화 :
                                    <label><input type="radio" name="sound" value="OPT_SOUND_1"
                                                  checked={sound === '조용히' || sound === 'OPT_SOUND_1'}
                                                  onChange={(e) => setSound(e.target.value)}/>조용히</label>
                                    <label><input type="radio" name="sound" value="OPT_SOUND_2"
                                                  checked={sound === '상관없음' || sound === 'OPT_SOUND_2'}
                                                  onChange={(e) => setSound(e.target.value)}/>상관없음</label>
                                </div>
                            </div>
                            <br/><br/>
                        </div>
                    </div>
                    <div className="modi_middle">
                        <div className="details">
                            <div className="detailLeft">
                                <div className="detail-col">
                                    <img src={`/profile/${stored_file_nm}`} />
                                </div>
                            </div>
                            <div className="detailRight">
                                <div className="detailTop">
                                    <div className="detail-col">
                                        <div>이름 : {user_nm}</div>
                                    </div>
                                    <div className="detail-col">
                                        <div>MBTI : {mbti}</div>
                                    </div>
                                </div>
                                <div className="detailBottom">
                                    <div className="detail-col">
                                        <div className="gender">성별 : {mem_gender}</div>
                                    </div>
                                    <div className="detail-col">
                                        <div className="ansim_cnt">동행 횟수 : {ansim_cnt}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modi_bottom">
                        <textarea name="content" className="modi_info" id="content" value={content} ref={contentRef} onChange={(e) => setContent(e.target.value)}></textarea>
                        {/*<input type="hidden" name="user_id" th:value="${session.user_id}"></input>*/}

                        {/*<input type="hidden" name="departure_LATITUDE" th:value="${departure_LATITUDE}"></input>*/}
                        {/*<input type="hidden" name="departure_LONGITUDE" th:value="${departure_LONGITUDE}"></input>*/}
                        {/*<input type="hidden" name="destination_LATITUDE" th:value="${destination_LATITUDE}"></input>*/}
                        {/*<input type="hidden" name="destination_LONGITUDE" th:value="${destination_LONGITUDE}"></input>*/}
                        <br /><br />
                    </div>
                </div>
                <br />
                <div style={{ textAlign: 'center' }}>
                    <input type="button" className="btn_modi"  value="수정" onClick={modifyForm} ></input>
                    <input type="button" className="btn_modicancel"  value="취소" onClick={() => window.history.back()} ></input>
                </div>
</form>
</div>
)
}

export default BoardModify;