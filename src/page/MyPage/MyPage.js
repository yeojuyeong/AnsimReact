import { Link } from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import getCookie from '../../components/GetCookie';

const MyPage = () => {

    //쿠키 가져 오기
    const user_idCookie = getCookie('user_id');
    //사용자 정보
    const [member, setMember] = useState({});

    useEffect(()=> {

        const fetchData = async () => {
            const member = await axios.get(`http://localhost:8080/member/memberInfo?&user_id=${user_idCookie}`);
            setMember(member.data);
        }
        fetchData();

    },[user_idCookie]);

    return (
        <>
            <div>
                <div>
                    <img className="logo" src="/images/steak2.png" alt="안심"/>
                </div>
                <div className='main'>
                    <h1>회원 정보 보기</h1>
                    <br/>
                    <div className="boardView">
                        <div className="imgView" style={{
                            "width": "80%",
                            "height": "auto",
                            "margin": "auto",
                            "padding": "20px",
                            "border": "none"
                        }}><img src={"http://localhost:8080/profile/" + member.stored_file_nm}
                                style={{"display": "block", "width": "500px", "height": "auto", "margin": "auto"}}
                                alt="사용자"/></div>
                        <div className="field">이메일(아이디) : {member.user_id}</div>
                        <div className="field">이름 : {member.user_nm}</div>
                        <div className="field">성별 : {member.gender}</div>
                        <div className="field">전화번호 : {member.tel_no}</div>
                    </div>

                    <br/>
                    <div className="bottom_menu" align="center">
                        &nbsp;&nbsp;
                        <a href="/guide/route">처음으로</a> &nbsp;&nbsp;
                        <Link to="/member/memberInfoModify">기본정보 변경</Link> &nbsp;&nbsp;
                        <Link to="/member/memberPasswordModify">패스워드 변경</Link> &nbsp;&nbsp;
                        <Link>회원탈퇴</Link> &nbsp;&nbsp;
                    </div>
                    <br/><br/>
                   
                </div>
            </div>

        </>
    )
}
export default MyPage;