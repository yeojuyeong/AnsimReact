import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from "dayjs";
import {Link, useSearchParams} from "react-router-dom";

import '../css/BoardView.css';
import getCookie from '../components/GetCookie';

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

    // 동행 신청
    const [list, setList] = useState([]);

    useEffect(()=> {

        const fetchData = async() => {

            //게시물 상세 보기
            const response = await axios.get(`http://localhost:8080/restapi/view?seqno=${seqno}&page=${page}&keyword=${keyword}&user_id=${cookie_user_id}`);
            const data = response.data;

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

            if (!cookie_user_id) {
                alert('서비스 이용을 위해 로그인해주세요.');
                window.location.href = 'http://localhost:3000/Login';  // 회원 정보 변경 페이지로
            }

            if (!data.cookie_stored_file_nm || data.cookie_stored_file_nm === 'null' || data.cookie_stored_file_nm === '') {
                alert('프로필 사진을 먼저 등록해주세요.');
                window.location.href = 'http://localhost:3000/Mypage';  // 회원 정보 변경 페이지로
            }

            // //이전 보기
            // (이거... 굳이 필요한가? 맨 처음,끝에서 다음, 이전 보기
            // 안 보이게 하려면 필요할 것 같기도 하고... 시간 없으니 일단 패스)
            // const preseqno = await axios.get(`http://localhost:8080/restapi/preseqno?seqno=${seqno}&keyword=${keyword}`);
            // setPre_seqno(data.pre_seqno);
            // //다음 보기
            // const nextseqno = await axios.get(`http://localhost:8080/restapi/nextseqno?seqno=${seqno}&keyword=${keyword}`);
            // setNext_seqno(data.next_seqno);
        }

        fetchData();


    },[page,seqno,keyword]);

    //게시물 삭제
    const boardDelete = () => {

        const seqno = param.get('seqno');

        if(window.confirm("정말로 삭제 하시겠습니까?") === true){
            fetch(`http://localhost:8080/restapi/delete?seqno=${seqno}`, {
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

        fetch(`http://localhost:8080/restapi/view?post_no=${seqno}&applicant=${cookie_user_id}&writer=${user_id}`, {
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

    return (
        <div className="board_view">
            <h1 style={{ textAlign: "center" }}>게시물 상세보기</h1>
            <div className="view_container">
                <div className="top">
                    <div className="bigLeft">
                        <div className="map">지도</div>
                    </div>
                    <div className="bigRight">
                        <br/>
                        <div className="sub-detail-title">{title}</div>
                        <br/><br/>
                        <div className="sub-detail">
                            <div className="left">{departure}</div>
                            <div className="right">{destination}</div>
                        </div>
                        <br/><br/>
                        <div className="sub-detail">
                            <div className="left">{meeting_time}</div>
                            <div className="right">인원수 : {mem_cnt}</div>
                        </div>
                        <br/><br/>
                        <div className="sub-detail">
                            <div className="left">성별 : {gender}</div>
                            <div className="right">대화 : {sound}</div>
                        </div>
                        <br/><br/>
                    </div>
                </div>
                <div className="middle">
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
                <div className="bottom">
                    <div className="info">{content}</div>
                </div>
                {(cookie_user_id !== user_id) && (
                    // <div className="bottom_menu">
                    //     <a href="#">동행 신청</a>
                    // </div>
                    <input type="button" className="bottom_menu" value="동행 신청" onClick={application}/>
                )}
                {(cookie_user_id === user_id && list.length > 0) && (
                    list.map((item, index) => (
                        <React.Fragment>
                            <div className="applicant_list">
                                <div className="listLeft">
                                    <div className="detail-col"><img src={`/profile/${item.stored_file_nm}`} style={{
                                        display: 'block',
                                        width: '80%',
                                        height: 'auto',
                                        margin: 'auto'
                                    }}/></div>
                                </div>
                                <div className="listMiddle">
                                    <div className="detailTop">
                                        <div className="detail-col">
                                            <div>이름 : {item.user_nm}</div>
                                        </div>
                                        <div className="detail-col">
                                            <div>나이 : {item.age}</div>
                                        </div>
                                        <div className="detail-col">
                                            <div>MBTI : {item.mbti}</div>
                                        </div>
                                    </div>
                                    <div className="detailBottom">
                                        <div className="detail-col">
                                            <div>성별 : {item.gender}</div>
                                        </div>
                                        <div className="detail-col-full">
                                            <div>동행 포인트 : {item.ansim_cnt}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="listRight">
                                    <input type="button" className="accept" value="수락"/>&nbsp;&nbsp;&nbsp;&nbsp;
                                    <input type="button" className="deny" value="거절"
                                           onClick={() => window.history.back()}/>
                                </div>
                            </div> <br/>
                        </React.Fragment>
                    ))
                )}
            </div>
            <br />

                <div className="bottom_menu">
                    {
                        pre_seqno !== '0' && <Link to ={`/board/view?seqno=${pre_seqno}&page=${page}&keyword=${keyword}&user_id=${cookie_user_id}`}>이전글▼</Link>
                    }
                    &nbsp;&nbsp;
                    <Link to={`/board/list?page=${page}&keyword=${keyword}`}>목록보기</Link>
                    &nbsp;&nbsp;
                    {
                        next_seqno !== '0' && <Link to={`/board/view?seqno=${next_seqno}&page=${page}&keyword=${keyword}&user_id=${cookie_user_id}`}>다음글▲</Link>
                    }
                    &nbsp;&nbsp;
                    <a href="/board/write">글 작성</a>
                    &nbsp;&nbsp;
                    {(cookie_user_id === user_id || role === 'MASTER') && (
                        <>
                            <Link to={`/board/modify?seqno=${seqno}&page=${page}&keyword=${keyword}&user_id=${user_id}`}>글 수정</Link>
                            &nbsp;&nbsp;
                            <a href='javascript:void(0)' onClick={boardDelete}>글 삭제</a>
                        </>
                    )}
                </div>
        </div>
    )
}

export default BoardView;