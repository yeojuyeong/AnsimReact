import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from "dayjs";
import {Link, useSearchParams} from "react-router-dom";

import '../css/BoardView.css';
import getCookie from '../components/GetCookie';
import locationIcon from "../images/location.png";
import pinIcon from "../images/pin_icon.png";

const BoardView = () => {

    //날짜 기준을 한국으로 지정
    dayjs.locale('ko');

    //쿠키 가져 오기
    const cookie_user_id = getCookie('userid');

    const [cookie_stored_file_nm, setCookie_stored_file_nm] = useState('');
    const [role, setRole] = useState('');
    const [param] = useSearchParams(); // page, keyword, seqno 상태가 들어감.
    const seqno = param.get('seqno');
    const page = param.get('page');
    const keyword = param.get('keyword')===null?'':param.get('keyword');
    const [list, setList] = useState([]);
    //게시판 상세 내용
    // const [map, setMap] = useState([]);
    const [title, setTitle] = useState('');
    const [departure, setDeparture] = useState('');
    const [destination, setDestination] = useState('');
    const [meeting_time, setMeeting_time] = useState('');
    const [mem_cnt, setMem_cnt] = useState('');
    const [gender, setGender] = useState([]);
    const [sound, setSound] = useState('');
    const [stored_file_nm, setStored_file_nm] = useState('');
    const [user_id, setUser_id] = useState('');
    const [user_nm, setUser_nm] = useState('');
    const [age, setAge] = useState('');
    const [mbti, setMbti] = useState('');
    const [mem_gender, setMem_gender] = useState('');
    const [ansim_cnt, setAnsim_cnt] = useState('');
    const [content, setContent] = useState('');
    const [pre_seqno, setPre_seqno] = useState(0);
    const [next_seqno, setNext_seqno] = useState(0);

    const { Tmapv2 } = window;
    //let boardViewMap;
    const [boardViewMap, setBoardViewMap] = useState(null);

    useEffect(()=> {
        fetchData();
        if(boardViewMap !== null){
            boardViewMap.destroy();
            setBoardViewMap(null);
        };
    },[page,seqno,keyword]);

    const fetchData = async() => {

        //게시물 상세 보기
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/view?seqno=${seqno}&page=${page}&keyword=${keyword}&user_id=${cookie_user_id}`);
        const data = response.data;

        //console.log("response.data",response.data);

        setUser_id(data.view.user_id);
        setCookie_stored_file_nm(data.cookie_stored_file_nm);
        setRole(data.role);
        setTitle(data.view.title);
        // setMap(view.data.map);
        setDeparture(data.view.departure);
        setDestination(data.view.destination);
        setMeeting_time(data.view.meeting_time);
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

        setPre_seqno(data.pre_seqno);
        setNext_seqno(data.next_seqno);
        setList(data.applicant_list);

        const drawData = {
            departure_latitude:data.view.departure_latitude,
            departure_longitude:data.view.departure_longitude,
            destination_latitude:data.view.destination_latitude,
            destination_longitude:data.view.destination_longitude
        };

        if (!cookie_user_id) {
            alert('서비스 이용을 위해 로그인해주세요.');
            window.location.href = 'http://localhost:3000/Login';  // 회원 정보 변경 페이지로
        }

        if (!data.cookie_stored_file_nm || data.cookie_stored_file_nm === 'null' || data.cookie_stored_file_nm === '') {
            alert('프로필 사진을 먼저 등록해주세요.');
            window.location.href = 'http://localhost:3000/Mypage';  // 회원 정보 변경 페이지로
        }

        callPedestrianAPI(drawData);
    }

    //게시물 삭제
    const boardDelete = () => {

        const seqno = param.get('seqno');

        if(window.confirm("정말로 삭제 하시겠습니까?") === true){
            fetch(`${process.env.REACT_APP_API_URL}/delete?seqno=${seqno}`, {
                method: 'GET'
            }).then((response) => response.json())
                .then((data) => {
                    if(data.message === 'GOOD')
                        document.location.href='/board/list?page=1';
                }).catch((error)=> {
                console.log("error = " + error);
            });
        }
    };

    // 동행 신청
    const application = () => {
        const seqno = param.get('seqno');

        fetch(`${process.env.REACT_APP_API_URL}/view?post_no=${seqno}&applicant=${cookie_user_id}&writer=${user_id}`, {
            method: 'POST'
        }).then((response) => response.json())
            .then((data) => {
                console.log(data.message);
                if(data.message === 'GOOD') {
                    alert('동행 신청이 완료되었습니다.')
                    document.location.href = `http://localhost:3000/board/view?seqno=${seqno}&page=${page}&keyword=${keyword}`;
                } else if(data.message === 'EXISTED') {
                    alert('이미 동행을 신청하였습니다.');
                    document.location.href = `http://localhost:3000/board/view?seqno=${seqno}&page=${page}&keyword=${keyword}`;
                }
            }).catch((error)=> {
            console.log("error = " + error);
        });
    };

    // 동행 신청 수락
    const accept = (user_id) => {
        fetch(`${process.env.REACT_APP_API_URL}/accept?post_no=${seqno}&applicant=${user_id}&writer=${cookie_user_id}`, {
            method: 'POST'
        }).then((response) => response.json())
            .then((data) => {
                if(data.message === 'GOOD') {
                    alert('동행 신청을 수락 하였습니다.');
                    boardViewMap.destroy();
                    setBoardViewMap(null);
                    fetchData();
                } else if(data.message === 'CLICKED') {
                    alert('이미 수락한 멤버입니다.');
                }
            }).catch((error)=> {
            console.log("error = " + error);
        });
    };

    // 동행 신청 거절
    const deny = (user_id) => {
        fetch(`${process.env.REACT_APP_API_URL}/deny?post_no=${seqno}&applicant=${user_id}&writer=${cookie_user_id}`, {
            method: 'POST'
        }).then((response) => response.json())
            .then((data) => {
                if(data.message === 'GOOD') {
                    alert('동행 신청을 거절 하였습니다.');
                    boardViewMap.destroy();
                    setBoardViewMap(null);
                    fetchData();
                } else if(data.message === 'CLICKED') {
                    alert('이미 거절한 멤버입니다.');
                }
            }).catch((error)=> {
            console.log("error = " + error);
        });
    };

    //------------------map start---------------------

    // 보행자 경로 API 호출
    async function callPedestrianAPI(drawData) {

        if( !drawData.departure_longitude || !drawData.departure_latitude ||
            !drawData.destination_longitude || !drawData.destination_latitude){
            return;
        }

        const boardViewMap = new Tmapv2.Map("map_div", {
            center: new Tmapv2.LatLng(37.56520450, 126.98702028),
            width: "100%",
            height: "100%",
            zoom: 15,
            zoomControl: false
        });

        var headers = {};
        headers["appKey"]="FMHrfuOs4Z6qvFnNXfZsV2fiSbTQjiC241luv6PK";

        console.log("drawData.departure_longitude",drawData.departure_longitude);

        const data = { //(중요!!) 경도, 위도 순으로 넣어야 한다.
            "startX" : drawData.departure_longitude,
            "startY" : drawData.departure_latitude,
            "endX" : drawData.destination_longitude,
            "endY" : drawData.destination_latitude,
            "reqCoordType" : "WGS84GEO",
            "resCoordType" : "EPSG3857",
            "startName" : "출발지",
            "endName" : "도착지"
        }

        await fetch('https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result',{
            method:'POST',
            headers: headers,
            body: JSON.stringify(data)
        }).then((response) => response.json())
            .then((data)=>{ //API 호출 성공 시

                var resultData = data.features;
                var drawInfoArr = [];

                //결과 출력
                var tDistance = "총 거리 : "
                    + ((resultData[0].properties.totalDistance) / 1000)
                        .toFixed(1) + "km,";
                var tTime = " 총 시간 : "
                    + ((resultData[0].properties.totalTime) / 60)
                        .toFixed(0) + "분";

                //result.innerText=tDistance + tTime;

                for ( var i in resultData) { //for문 [S]
                    var geometry = resultData[i].geometry;
                    var properties = resultData[i].properties;
                    var polyline_;

                    if (geometry.type == "LineString") {
                        for ( var j in geometry.coordinates) {
                            // 경로들의 결과값(구간)들을 포인트 객체로 변환
                            var latlng = new Tmapv2.Point(
                                geometry.coordinates[j][0],
                                geometry.coordinates[j][1]);
                            // 포인트 객체를 받아 좌표값으로 변환
                            var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
                                latlng);
                            // 포인트객체의 정보로 좌표값 변환 객체로 저장
                            var convertChange = new Tmapv2.LatLng(
                                convertPoint._lat,
                                convertPoint._lng);
                            // 배열에 담기
                            drawInfoArr.push(convertChange);
                        }
                    } else {
                        var markerImg = "";
                        var pType = "";
                        var size;

                        if (properties.pointType == "S") { //출발지 마커
                        } else if (properties.pointType == "E") { //도착지 마커
                        } else { //각 포인트 마커
                            markerImg = "http://topopen.tmap.co.kr/imgs/point.png";
                            pType = "P";
                            size = new Tmapv2.Size(8, 8);
                        }

                        new Tmapv2.Marker( //생성과 동시에 화면에 찍어짐
                            {
                                position : new Tmapv2.LatLng(drawData.departure_latitude, drawData.departure_longitude),
                                icon : pinIcon,
                                iconSize : new Tmapv2.Size(32, 32),
                                map : boardViewMap
                            });

                        new Tmapv2.Marker( //생성과 동시에 화면에 찍어짐
                            {
                                position : new Tmapv2.LatLng(drawData.destination_latitude, drawData.destination_longitude),
                                icon : pinIcon,
                                iconSize : new Tmapv2.Size(32, 32),
                                map : boardViewMap
                            });

                        // 경로들의 결과값들을 포인트 객체로 변환
                        var latlon = new Tmapv2.Point(
                            geometry.coordinates[0],
                            geometry.coordinates[1]);

                        // 포인트 객체를 받아 좌표값으로 다시 변환
                        var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
                            latlon);

                        var routeInfoObj = {
                            markerImage : markerImg,
                            lng : convertPoint._lng,
                            lat : convertPoint._lat,
                            pointType : pType
                        };

                        // Marker 추가
                        new Tmapv2.Marker(
                            {
                                position : new Tmapv2.LatLng(
                                    routeInfoObj.lat,
                                    routeInfoObj.lng),
                                icon : routeInfoObj.markerImage,
                                iconSize : size,
                                map : boardViewMap
                            });
                    }
                }//for문 [E]
                drawLine(drawInfoArr,boardViewMap);
            }).catch((error)=> {
                console.log("error = " + error);
            });

        //출발지 목적지 직선의 중심점 구하기
        const midLat = (drawData.departure_latitude + drawData.destination_latitude) / 2.0;
        const midLon = (drawData.departure_longitude + drawData.destination_longitude) / 2.0;

        boardViewMap.setCenter(new Tmapv2.LatLng(midLat, midLon));
        setBoardViewMap(boardViewMap);

    } //callPedestrianAPI() END

    function drawLine(arrPoint, boardViewMap) {
        var polyline_;
        polyline_ = new Tmapv2.Polyline({
            path : arrPoint,
            strokeColor : '#FF0000',
            strokeWeight : 6,
            map : boardViewMap
        });
    }

    //------------------map end---------------------

    return (
        <div className="board_view">
            <h1 style={{textAlign: "center"}}>게시물 상세보기</h1>
            <div className="view_container">
                <div className="top">
                    <div className="bigLeft">
                        <div id ="map_div" className="map_div"></div>
                    </div>
                    <div className="bigRight">
                        <br/>
                        <div className="sub-detail-title">{title}</div>
                        <br/><br/>
                        <div className="sub-detail">
                            <div className="left">출발지:{departure} </div>
                            <div className="right">도착지: {destination} </div>
                        </div>
                        <br/><br/>
                        <div className="sub-detail">
                            <div className="left">{meeting_time}</div>
                            <div className="right">인원수: {mem_cnt}</div>
                        </div>
                        <br/><br/>
                        <div className="sub-detail">
                            <div className="left">성별: {gender}</div>
                            <div className="right">대화: {sound}</div>
                        </div>
                        <br/><br/>
                    </div>
                </div>
                <div className="middle">
                    <div className="details">
                        <div className="detailLeft">
                            <div className="detail-col">
                                <div className="writer_profile">작성자 Profile</div>
                                <img src={`/profile/${stored_file_nm}`}/>
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
                                    <div className="ansim_cnt">동행 포인트 : {ansim_cnt}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="apply_container">
                        {(cookie_user_id !== user_id) && (
                            // <div className="bottom_menu">
                            //     <a href="#">동행 신청</a>
                            // </div>
                            <input type="button" className="apply_btn" value="동행 신청😊" onClick={application}/>
                        )}
                    </div>
                </div>
                <div className="bottom">
                    <div className="view_info">{content}</div>
                </div>
                <div className="apply_list">
                    {(cookie_user_id === user_id && list.length > 0) && (
                        list.map((item, index) => (
                            <React.Fragment>
                                <div className="apply_listnm">신청자{index + 1}</div>
                                <div className="applicant_list" style={{textAlign: "center"}}>
                                    <div className="listLeft">
                                        <div className="detail-col">
                                            <img src={`/profile/${item.stored_file_nm}`} style={{
                                                display: 'block',
                                                width: '80%',
                                                height: 'auto',
                                                margin: 'auto'
                                            }}/></div>
                                    </div>
                                    <div className="listMiddle">
                                        <div className="detailTop">
                                            <div className="detail-col">
                                                <div style={{marginLeft: "10px"}}>이름 : {item.user_nm}</div>
                                            </div>
                                            <div className="detail-col">
                                                <div>MBTI : {item.mbti}</div>
                                            </div>
                                        </div>
                                        <div className="detailBottom">
                                            <div className="detail-col">
                                                <div>성별 : {item.gender}</div>
                                            </div>
                                            <div className="detail-col">
                                                <div>동행 포인트 : {item.ansim_cnt}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="listRight">
                                        {item.accepted === 'Y' ? (
                                            <span>이미 수락된 멤버입니다.</span>
                                        ) : (
                                            <div>
                                                <input type="button" className="accept" value="수락" onClick={() => accept(item.user_id)} />
                                                 &nbsp;&nbsp;&nbsp;&nbsp;
                                                <input type="button" className="deny" value="거절" onClick={() => deny(item.user_id)}/>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <br/>
                            </React.Fragment>
                        ))
                    )}
                </div>
            </div>
            <br/>
            <div className="view_bottom_menu">
                {
                    pre_seqno !== 0 && <Link
                        to={`/board/view?seqno=${pre_seqno}&page=${page}&keyword=${keyword}&user_id=${cookie_user_id}`}>이전글▼</Link>
                }
                &nbsp;&nbsp;
                <Link to={`/board/list?page=${page}&keyword=${keyword}`}>목록보기</Link>
                &nbsp;&nbsp;
                {
                    next_seqno !== 0 && <Link
                        to={`/board/view?seqno=${next_seqno}&page=${page}&keyword=${keyword}&user_id=${cookie_user_id}`}>다음글▲</Link>
                }
                &nbsp;&nbsp;
                <a href="/board/write">글 작성</a>
                &nbsp;&nbsp;
                {(cookie_user_id === user_id || role === 'MASTER') && (
                    <>
                        <Link to={`/board/modify?seqno=${seqno}&page=${page}&keyword=${keyword}&user_id=${user_id}`}>글
                            수정</Link>
                        &nbsp;&nbsp;
                        <a href='javascript:void(0)' onClick={boardDelete}>글 삭제</a>
                    </>
                )}
            </div>
        </div>
    )
}

export default BoardView;