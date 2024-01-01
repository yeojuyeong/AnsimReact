import React, {useEffect, useState} from "react";
import {useSearchParams, Link} from 'react-router-dom';
import dayjs from 'dayjs';
// import axios from 'axios'; // HTTP 요청을 보내는 라이브러리인 axios를 import합니다.
import '../css/BoardList.css';
import BoardCard from "./BoardCard";

import getCookie from '../components/GetCookie';

const BoardList = () => {
    // const [params, setParams] = useSearchParams(); // page, keyword 상태가 들어감.
    // const [page, setPage] = useState(params.get('page')); // params로 겟한 페이지 번호를 저장할 상태와 그 상태를 변경하는 함수를 선언.
    // const [keyword, setKeyword] = useState(params.get('keyword') === null ? '': params.get('keyword')); // 검색 키워드를 저장할 상태와 그 상태를 변경하는 함수를 선언. 초기값은 빈 문자열.
    // const [list, setList] = useState([]); // 게시물 목록을 저장할 상태와 그 상태를 변경하는 함수를 선언합니다. 초기값은 빈 배열입니다.
    // const [pageList, setPageList] = useState(''); // 화면 하단에 보여지는 페이지리스트의 페이지 갯수

    //쿠키 가져 오기
    const user_id = getCookie('userid');

    const [params, setParams] = useSearchParams(); // page, keyword 상태가 들어감.
    const [list, setList] = useState([]);
    const [page, setPage] = useState(params.get('page') || 1); // params로 겟한 페이지 번호를 저장할 상태와 그 상태를 변경하는 함수를 선언.
    const [keyword, setKeyword] = useState(params.get('keyword') === null ? '': params.get('keyword')); // 검색 키워드를 저장할 상태와 그 상태를 변경하는 함수를 선언. 초기값은 빈 문자열.
    const [pageList, setPageList] = useState('');
    // const [totalElement, setTotalElement] = useState(0);

    // const user_idCookie = getCookie('user_id');
    // // const user_idSaveCookie = getCookie('user_idSave'); 아니, 이건 아이디 저장을 체크해야지 쓸모가 있는거잖아!!!
    // // 우린 이거 안 쓴다고!!! 근데 왜 밑에서 user_id가 없으면 여기로 못 들어오게 하는 checkAuthority 함수에 이게 꼭 필요한거야!!
    // const user_nmCookie = getCookie('user_nm');
    // const roleCookie = getCookie('role');
    // const accessTokenCookie = getCookie('accessToken');
    // const refreshTokenCookie = getCookie('refreshToken');

    const styled = {
        textDecorationLine: 'none',
        cursor: 'hand'
    }

    dayjs.locale('ko');

    // const checkAuthority = () => {
    //     if(user_idCookie === undefined || user_idCookie === '')
    //         document.location.href='/';
    // }

    // const jwtCheck = async () => {
    //
    //     if(accessTokenCookie === undefined){
    //         alert("인증 토큰이 존재하지 않습니다.");
    //         document.location.href='/';
    //     }
    //     await fetch('http://localhost:8080/restapi/validate',{
    //         method : 'GET',
    //         headers : {"Authorization" : "Bearer " + accessTokenCookie}
    //     }).then((response) => response.json())
    //         .then((data) => {
    //             if(data.message === 'VALID_JWT') {
    //                 return;
    //             } else if(data.message === 'EXPIRED_JWT'){	 //accessToken 사용 기간 만료
    //                 sendRefreshToken();
    //             } else if(data.message === 'INVALID_JWT') { //토큰이 유효하지 않음
    //                 document.cookie = 'accessToken=' + accessTokenCookie + ';path=/; max-age=0';
    //                 document.cookie = 'refreshToken=' + refreshTokenCookie + ';path=/; max-age=0';
    //                 alert("토큰이 유효하지 않습니다. 재로그인 하세요.");
    //                 document.location.href='/';
    //             } else {
    //                 console.log("message = " + data.message);
    //                 alert("시스템 장애로 로그인이 실패 했습니다.");
    //             }
    //         }).catch((error)=> { console.log("error = " + error);} );
    //
    // }

    // const sendRefreshToken = async () => {
    //
    //     let formData = new FormData();
    //     formData.append("user_id",user_idCookie);
    //     // formData.append("password",passwordCookie); OAuth2로 로그인하면 이거 필요 없지 않나...?
    //     formData.append("refreshToken", refreshTokenCookie);
    //     await fetch('http://localhost:8080/restapi/refreshToken',{
    //         method : 'POST',
    //         body: formData
    //     }).then((response) => response.json())
    //         .then((data) => {
    //             document.cookie = 'accessToken=' + data.accessToken + ';path=/; expires=Sun, 31 Dec 2023 23:59:59 GMT';
    //             document.cookie = 'refreshToken=' + data.refreshToken + ';path=/; expires=Sun, 31 Dec 2023 23:59:59 GMT';
    //             alert("토큰 사용기한이 만료되어 토큰을 재설정합니다.");
    //             document.location.reload();
    //         }).catch((error)=> { console.log("error = " + error);} );
    // }

    const getList = async () => {
        // await fetch(`http://localhost:8080/restapi/list?page=${page}&keyword=${keyword}`,{method : 'GET'})
        //     .then((response) => response.json())
        //     .then((data) => setList(data.content))
        //     .catch((error)=> { console.log("error = " + error);} );

        // const response = await fetch(`http://localhost:8080/restapi/list?page=${page}&keyword=${keyword}`, {credentials: 'include'}); //API 호출

        const response = await fetch(`http://localhost:8080/restapi/list?page=${page}&keyword=${keyword}&user_id=${user_id}`); //API 호출

        if (!user_id) {
            alert('서비스 이용을 위해 로그인해주세요.');
            window.location.href = 'http://localhost:3000/Login';  // 회원 정보 변경 페이지로
        }

        const data = await response.json(); // response.json()을 통해 응답 객체를 JSON 형식의 데이터로 변환
        setList(data.list);
        setPage(data.page);
        setKeyword(data.keyword);
        setPageList(data.pageList);
        // setTotalElement(data.totalElement);


    };

    useEffect(()=> {
        // if(user_idSaveCookie !== undefined){
        //     checkAuthority();
        // }  대체 왜 user_idSaveCookie 이걸로 checkAuthority(); 함수가 기능하게 한거야...
        // 그냥 페이지 업로드 될 때 하게 하면 안되는 건가?
        // if(accessTokenCookie !== undefined){
        //     jwtCheck();
        // }

        getList();
        // getPageList();
    },[]);

    const Search = () =>{
        getList();
        // getPageList();
    };

    const logout = () => {

        // document.cookie = 'user_nm=' + user_nmCookie  + ';path=/; max-age=0';
        // document.cookie = 'role=' + roleCookie + ';path=/; max-age=0';
        // document.cookie = 'accessToken=' + accessTokenCookie + ';path=/; max-age=0';
        // document.cookie = 'refreshToken=' + refreshTokenCookie + ';path=/; max-age=0';
        document.location.href="/";

    }

    const onKeyDown = (e) => {
        if(e.key === 'Enter'){
            Search();
        }
    };

    // 컴포넌트가 렌더링할 JSX를 반환합니다.
    return (
        <div className="board_main">
            <div className="content">

                <h1 style={{ textAlign: 'center' }}>게시물 목록</h1>

                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '35px'}}>
                <input className="board_search" style={{width:'40%',height:'30px',border:'2px solid #168',fontSize: '16px'}}
                       type="text" value={keyword} onChange={(e)=> { setPage('1'); setKeyword(e.target.value); }}
                       placeholder="검색할 제목,작성자이름 및 내용을 입력해 주세요"
                       onKeyDown={(e)=> onKeyDown(e)}/>
                <input className="board_search_btn" style={{width:'5%',height:'30px',background:'#158',color:'white',fontWeight:'bold',
                    cursor:'pointer', marginLeft: '10px'}} type="button" value="검색" onClick={Search} />
                </div>

            <div className="main-content">
                {/* <!-- 카드 형식의 게시물 리스트 --> */}
                <BoardCard list={list} page={page} keyword={keyword} />
                <br />
                <div dangerouslySetInnerHTML={{ __html: pageList }} ></div>
                <br />
                <div className="bottom_menu">
                    <a href="/board/list?page=1">처음으로</a>&nbsp;&nbsp;
                    <Link to="/board/write">글쓰기</Link>&nbsp;&nbsp;
                    <Link to="/member/memberInfo">사용자관리</Link>&nbsp;&nbsp;
                    {/*{roleCookie === 'MASTER' &&*/}
                    {/*    <Link to="/master/sysmanage">시스템관리</Link>*/}
                    {/*}*/}
                    &nbsp;&nbsp;
                    <Link onClick={logout}>로그아웃</Link>
                </div>
            </div>
            </div>
        </div>
    );
};

export default BoardList;