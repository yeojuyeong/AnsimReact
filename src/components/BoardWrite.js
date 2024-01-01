import React, {useState, useEffect, useRef} from 'react';
import axios from "axios";

import '../css/BoardWrite.css';
import getCookie from '../components/GetCookie';

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
        if(departureRef.current.value === '') { alert("출발지를 입력하세요."); departureRef.current.focus(); return false; }
        if(destinationRef.current.value === '') { alert("목적지를 입력하세요."); destinationRef.current.focus(); return false; }
        if(date === '') { alert("약속날짜를 입력하세요."); dateRef.current.focus(); return false; }
        if(time === '') { alert("약속시간을 입력하세요."); timeRef.current.focus(); return false; }
        if(mem_cntRef.current.value === 'all') { alert("희망 동행 수를 입력하세요."); mem_cntRef.current.focus(); return false; }
        if(gender === '') { alert("성별을 선택하세요."); genderRef.current.focus(); return false; }
        if(sound === '') { alert("동행방식을 입력하세요."); soundRef.current.focus(); return false; }
        if(contentRef.current.value === '') { alert("내용을 입력하세요."); contentRef.current.focus(); return false; }

        const uploadURL = "/restapi/write";
        const formData = new FormData();

        formData.append('user_id', user_id);
        formData.append('title', titleRef.current.value);
        formData.append('departure', departureRef.current.value);
        formData.append('destination', destinationRef.current.value);
        formData.append('meeting_time', meeting_timeRef.current.value);
        formData.append('mem_cnt', mem_cntRef.current.value);
        formData.append('gender', gender);
        formData.append('sound', sound);
        formData.append('content', contentRef.current.value);

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

    return (
        <div className="board_main">
            <h1>게시물 등록</h1>
            <br />
            <div id="formZone">
                <form className="WriteForm" id="WriteForm" name="WriteForm" method="post">
                    <input type="text" id="title" className="items" value={title} ref={titleRef} onChange={handleTitleChange} placeholder="제목을 입력하세요."></input><br />{errorMessage &&
                    <p>{errorMessage}</p>}<br/>
                        <div className="writeContainer">
                            <div className="left-section">
                                {/*<input type="text" id="departure" class="items" name="departure" th:value='${session.departure}' disabled>*/}
                                <input type="text" id="departure" className="items" value={departure} ref={departureRef} onChange={(e) => setDeparture(e.target.value)} placeholder="출발지를 입력하세요."></input>
                            </div>
                            <div className="right-section">
                                {/*<input type="text" id="destination" class="items" name="destination" th:value='${session.destination}' disabled>*/}
                                <input type="text" id="destination" className="items" value={destination} ref={destinationRef} onChange={(e) => setDestination(e.target.value)} placeholder="목적지를 입력하세요."></input>
                            </div>
                        </div>
                        <div className="writeContainer">
                            <div className="left-section">
                                <div className="date-time-selector">
                                    <label htmlFor="date">날짜:</label>
                                    <input name="date" type="date" id="date" value={date} ref={dateRef} onChange={(e) => setDate(e.target.value)} />
                                    <label htmlFor="time">시간:</label>
                                    <input name="time" type="time" id="time" value={time} ref={timeRef} onChange={(e) => setTime(e.target.value)} />
                                    <input type="hidden" id="meeting_time" name="meeting_time" value={`날짜 : ${date} | 시간 : ${time}`} ref={meeting_timeRef} onChange={(e) => setMeeting_time(e.target.value)}/>
                                </div>
                            </div>
                            <div className="right-section">
                                인원수 :
                                <select onChange={(e) => setMem_cnt(e.target.value)} value={mem_cnt} ref={mem_cntRef}>
                                    <option value = "all" disabled>-- 아래의 내용 중에서 선택 --</option>
                                    <option value='1'>1명</option>
                                    <option value="2">2명</option>
                                    <option value="3">3명</option>
                                    <option value="4">4명</option>
                                </select>
                            </div>
                        </div>
                        <div className="writeContainer">
                            <div className="left-section">
                                성별 :
                                <label><input type="radio" name="gender" value="OPT_GENDER_2" ref={genderRef} onChange={(e)=>setGender(e.target.value)} />남성</label>
                                <label><input type="radio" name="gender" value="OPT_GENDER_1" ref={genderRef} onChange={(e)=>setGender(e.target.value)} />여성</label>
                                <label><input type="radio" name="gender" value="OPT_GENDER_3" ref={genderRef} onChange={(e)=>setGender(e.target.value)} />FTM</label>
                                <label><input type="radio" name="gender" value="OPT_GENDER_4" ref={genderRef} onChange={(e)=>setGender(e.target.value)} />MTF</label>
                                <label><input type="radio" name="gender" value="OPT_GENDER_5" ref={genderRef} onChange={(e)=>setGender(e.target.value)} />상관없음</label>
                            </div>
                            <div className="right-section">
                                대화 :
                                <label><input type="radio" name="sound" value="OPT_SOUND_1" ref={soundRef} onChange={(e)=>setSound(e.target.value)} />조용히</label>
                                <label><input type="radio" name="sound" value="OPT_SOUND_2" ref={soundRef} onChange={(e)=>setSound(e.target.value)} />상관없음</label>
                            </div>
                        </div>
                        <textarea name="content" id="content" value={content} ref={contentRef} onChange={(e) => setContent(e.target.value)} cols="100" rows="500" placeholder="내용을 입력하세요"></textarea>

                        {/*<input type="hidden" name="departure_LATITUDE" th:value="${departure_LATITUDE}"></input>*/}
                        {/*<input type="hidden" name="departure_LONGITUDE" th:value="${departure_LONGITUDE}"></input>*/}
                        {/*<input type="hidden" name="destination_LATITUDE" th:value="${destination_LATITUDE}"></input>*/}
                        {/*<input type="hidden" name="destination_LONGITUDE" th:value="${destination_LONGITUDE}"></input>*/}

                    <input type="button" className="btn_write" value="등록" onClick={() => registerForm()} />
                    <input type="button" className="btn_cancel" value="취소" onClick={() => window.history.back()} />
                </form>
            </div>
            <br /><br />
        </div>
    );
};

export default BoardWrite;