import { Link } from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import getCookie from '../../components/GetCookie';

const MyPage = () => {

    //쿠키 가져 오기
    const userCookie = getCookie('userid');
    //사용자 정보
    const [member, setMember] = useState({});
    console.log(userCookie);

    useEffect(()=> {

        const fetchData = async () => {
            const member = await axios.get(`http://localhost:8080/member/memberInfo?&user_id=${userCookie}`);
            setMember(member.data);
        }
        fetchData();

    },[userCookie]);

    if (userCookie == null) {
        <Link to="http://localhost:3000/Login" />
    }

    return (
        <>
            <div>

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
                                style={{"display": "block", "width": "100%", "height": "auto", "margin": "auto"}}
                                alt="사용자"/></div>
                        <div className="field">아이디 : {member.user_id}</div>
                        <div className="field">이름 : {member.user_nm}</div>
                        <div className="field">성별 : {member.gender}</div>
                        <div className="field">MBTI : {member.mbti}</div>
                        <div className="field">전화번호 : {member.tel_no}</div>
                    </div>

                    <br/>
                    <div className="bottom_menu" align="center">
                        &nbsp;&nbsp;
                        <Link to="/myPageModify">기본정보 변경</Link> &nbsp;&nbsp;
                        {/* fromSocial이 'Y'인 경우에만 링크를 보여줌 */}
                        {member.fromSocial !== 'Y' &&
                            <Link to="/passwordModify">패스워드 변경</Link>}&nbsp;&nbsp;
                    </div>
                    <br/><br/>
                   
                </div>
            </div>

        </>
    )
}
export default MyPage;