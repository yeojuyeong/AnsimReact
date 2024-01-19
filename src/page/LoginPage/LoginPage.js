import '../../css/Login.css';
import getCookie from '../../components/GetCookie';
import React, { useState, useRef, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';

//import CryptoJS from 'crypto-js'; //AES 암호화 알고리즘으로 패스워드 쿠키를 암호화/복호화
/* eslint-disable */
const LoginPage = () =>{
    const navigate = useNavigate();

    //Ref 초기화
    const user_idRef = useRef();
    const passwordRef = useRef();

    //state 초기화
    const [user_id, setUser_id] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');


    const cookieManage = (accessToken, refreshToken, user_nm, role) => {

        // 현재 시간에 24시간 후의 값을 더한 시간을 계산합니다.
        const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

// 만료 시간을 GMT 문자열로 변환합니다.
        const expiresGMT = expirationTime.toUTCString();

        //user_id 쿠키 등록
        // document.cookie = 'user_id=' + user_id + ';path=/; expires=Sun, 31 Dec 2023 23:59:59 GMT';
        // document.cookie = 'userid=' + user_id + 'path=/; expires=${expiresGMT};';
        document.cookie = `userid=${user_id}; path=/; expires=${expiresGMT};`;



        //JWT 쿠키 등록
        // if(jwtRef.current.checked) {
        // document.cookie = 'accessToken=' + accessToken + ';path=/; expires=Sun, 31 Dec 2023 23:59:59 GMT';
        // document.cookie = 'jwt=' + accessToken + ';path=/; max-age=3600';
        document.cookie = `jwt=${accessToken}; path=/; expires=${expiresGMT};`;

        // document.cookie = 'refreshToken=' + refreshToken + ';path=/; expires=Sun, 31 Dec 2023 23:59:59 GMT';
        // document.cookie = 'refreshToken=' + refreshToken + ';path=/; max-age=18000';
        // } else {
        //     document.cookie = 'accessToken=' + accessToken + ';path=/; max-age=0';
        //     document.cookie = 'refreshToken=' + refreshToken + ';path=/; max-age=0';
        // }

        // document.cookie = 'userName=' + decodeURIComponent(userName) + ';path=/; expires=Sun, 31 Dec 2023 23:59:59 GMT';
        // document.cookie = 'username=' + decodeURIComponent(user_nm) + ';path=/; max-age=3600';
        // document.cookie = 'role=' + role + ';path=/; expires=Sun, 31 Dec 2023 23:59:59 GMT';
        // document.cookie = 'role=' + role + ';path=/; max-age=3600';
    }


    //REST API 서버와의 비동기 통신으로 아이디/패스워드 검증
    const loginCheck = async () =>{

        if(user_id === null || user_id ===''){
            alert('아이디를 입력하세요.');
            user_idRef.current.focus();
            return false;
        }
        if(password === null || password === ''){
            alert('패스워드를 입력하세요');
            passwordRef.current.focus();
            return false;
        }

        let formData = new FormData();
        formData.append("user_id", user_id);
        formData.append("password", password);

        //JWT 로그인
        // await fetch('http://localhost:8080/restapi/loginCheck?autoLogin=JWTNew',{
        await fetch(`${process.env.REACT_APP_API_URL}/member/loginCheck`,{

            method : 'POST',
            body : formData

        }).then((response) => response.json())
            .then((data) => {
                console.log('서버 응답 데이터:', data);
                console.log('jwt컨트롤러로 보낸다')
                // document.cookie = 'accessToken=' + data.accessToken + ';path=/; expires=Sun, 31 Dec 2023 23:59:59 GMT';
                if(data.message === 'JWT'){
                    console.log('컨트롤러에서 jwt 받았다')
                    console.log('user_nm: ' + decodeURIComponent(data.user_nm));
                    cookieManage(data.accessToken, data.refreshToken, data.user_nm, data.role);
                    // cookieManage(data.accessToken);
                    // document.location.href='/guide';
                    navigate('/guide');
                } else if(data.message === 'ID_NOT_FOUND') {
                    setMessage('존재하지 않는 아이디입니다.');
                } else if(data.message === 'PASSWORD_NOT_FOUND') {
                    setMessage('잘못된 패스워드입니다.');
                } else {
                    console.log("message = " + data.message);
                    alert("시스템 장애로 로그인이 실패 했습니다.");
                }
            }).catch((error)=> {
                console.log("이런이런 ㅠㅠ")
                console.log("error = " + error);} );

    }

    //패스워드 입력창에서 엔터를 눌렀을때 로그인
    const onKeyDown = (e) => {
        if(e.key === 'Enter'){
            loginCheck();
        }
    };

    return(
        <div id='loginpageWrap'>
            <div className='main'>
                <div>
                    <img className="logo" src ="/images/steak2.png" alt="안심" />
                </div>
                <p className="ansimName">안심동행</p>
                {/*<h2>Sign In</h2>*/}
                <div className='login'>
                    {/* 아이디 */}
                    <input type="text" ref={user_idRef} value={user_id} className="user_id"
                           onChange={(e) => setUser_id(e.target.value)} placeholder="ID을 입력하세요."/>
                    {/* 패스워드 */}
                    <input type="password" ref={passwordRef} value={password} className="password"
                           onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력하세요." onKeyDown={onKeyDown}/>
                    <p style={{color: 'red', textAlign: 'center'}}>{message}</p>

                    {/* 체크박스[아이디 기억, 패스워드 기억, 자동 로그인, JWT 로그인 */}
                    <div className="checkboxContainer">
                    </div>
                    <Link to="/signup" className="signupBtn">Sign Up</Link><br/>
                    {/* 로그인 버튼 */}
                    <input type="button" className="login_btn" value="로그인" onClick={loginCheck}/>
                    <Link to="http://localhost:8080/oauth2/authorization/google" className="linkBtn">
                        <img src="/images/google.png" alt="google Login" style={{width: '100%', cursor: 'pointer'}}/>
                    </Link>
                    <Link to="http://localhost:8080/oauth2/authorization/kakao" className="linkBtn">
                        <img src="/images/kakao1.png" alt="Kakao Login" style={{width: '100%', cursor: 'pointer',}}/>
                    </Link>
                    <Link to="http://localhost:8080/oauth2/authorization/naver" className="linkBtn">
                        <img src="/images/naver.png" alt="Naver Login" style={{width: '100%', cursor: 'pointer'}}/>
                    </Link>

                    {/*<Link to="/member/searchID" className="findIdBtn">Find ID</Link>*/}
                    {/*<Link to="/member/searchPassword" className="findPwBtn">Find Password</Link>*/}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;