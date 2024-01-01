import '../../css/MyPage.css';
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

    if (!userCookie) {
        document.location.href='/guide';
    }

    return (
        <>
            <div>
                <div className='myPageMain'>
                    <h1>마이페이지</h1>
                    <br/>
                    <div className="myPageInfo">
                        <div className="imgView">
                            {member.stored_file_nm ? (
                                <img className="imgBox" src={"http://localhost:8080/profile/" + member.stored_file_nm}
                                     alt="사용자"/>
                            ) : (
                                <img className="imgBox" src="/images/steak1.png" alt="사용자"/>
                            )}
                        </div>
                        <br/>
                        <div className="field">아이디 : {member.user_id}</div>
                        <div className="field">이름 : {member.user_nm}</div>
                        <div className="field">성별 : {member.gender}</div>
                        <div className="field">MBTI : {member.mbti}</div>
                        <div className="field">전화번호 : {member.tel_no}</div>
                    </div><br/>
                    <div>
                        <div className="myPageBtnDiv">
                        <Link to="/myPageModify" className="myPageBtn">기본정보 변경</Link></div> &nbsp;&nbsp;
                        {/* fromSocial이 'Y'인 경우에만 링크를 보여줌 */}
                        {member.fromSocial !== 'Y' &&
                         <div className="myPageBtnDiv"><Link to="/passwordModify" className="myPageBtn">패스워드 변경</Link></div>}&nbsp;&nbsp;
                    </div>
                    <br/><br/>
                </div>
            </div>
        </>
    )
}
export default MyPage;