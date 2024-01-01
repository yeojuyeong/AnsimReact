import {useEffect, useState, useRef} from "react";
import {useNavigate} from 'react-router-dom';
import getCookie from '../../components/GetCookie';
import axios from "axios";


const MyPageModify = () =>{
    //쿠키 가져 오기
    const userCookie = getCookie('userid');


    const [member, setMember] = useState({});
    const [mbti, setMbti] = useState();
    const [gender, setGender] = useState()
    const [file, setFile] = useState();
    const [previewImage, setPreviewImage] = useState();

    const user_nmRef = useRef();
    const genderRef = useRef();
    const mbtiRef = useRef();
    const tel_noRef = useRef();
    const fileUploadRef = useRef();
    const navigate = useNavigate();



    useEffect(()=>{
        const fetchData = async() => {
            const member = await axios.get(`http://localhost:8080/member/memberInfo?user_id=${userCookie}`);
            setMember(member.data);
            setGender(member.data.gender);
        }
        fetchData();
    },[userCookie]);

    const handleGenderChange = (e) => {
        setGender(e.target.value);
    }
    const handleFileUpload = (e) => {
        const files = e.target.files;
        setFile(files);  // 여러 파일을 저장하려면 state에 배열로 저장
        showImage(files); // 이미지 미리보기 업데이트
    };

    const showImage = (files) => {
        const imgFile = files[0];

        if (imgFile && imgFile.type.indexOf("image") >= 0) {
            const reader = new FileReader();
            reader.onload = function (event) {
                // 이미지를 미리보기로 보여줄 state 업데이트
                setPreviewImage(event.target.result);
            };

            reader.readAsDataURL(imgFile);
        } else {
            alert("이미지 파일만 올려 주세요");
        }
    };

    const myPageModify = async () => {
        const user_nm = user_nmRef.current.value;
        const gender = genderRef.current.value;
        const mbti = mbtiRef.current.value;
        const tel_no = tel_noRef.current.value;
        const file = fileUploadRef.current.value;

        let formData = new FormData();
        formData.append("user_nm", user_nm);
        formData.append("gender", gender);
        formData.append("mbti", mbti);
        formData.append("tel_no", tel_no);
        formData.append("fileUpload", file);

        try {
            const response = await axios.post('http://localhost:8080/member/memberInfoModify', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.message === 'GOOD') {
                alert("게시물이 수정되었습니다.");
                document.location.href = `/MyPage`;
            }
        } catch (error) {
            console.log("이론이롱ㅠ")
            alert("시스템 장애로 게시물 수정이 실패했습니다.");
            console.log("error = " + error);
        }
    };


    const goBack = () => {
        navigate(-1);
    }
    return(
        <>
            <div>
                <div className='myPageMain'>
                    <h1>수정</h1>
                    <br/>
                    <div className="myPageInfo">
                        <input
                            type="file"
                            name="fileUpload"
                            id="imageFile"
                            ref="fileUploadRef"
                            style={{"display": "none"}}
                            onChange={(e) => handleFileUpload(e.target.files)}
                        />
                        <span onClick={() => document.getElementById("imageFile").click()}>
                        이미지 수정을 원하시면 화면을 클릭해 주세요.
                        </span>
                        <div className="imageZone" id="imageZone"><img
                            src={"http://localhost:8080/profile/" + member.stored_file_nm}
                            style={{"display": "block", "width": "500px", "height": "auto", "margin": "auto"}}
                            alt="회원사진"/></div>
                        <br/>
                        <input type="hidden" value={member.org_file_nm}/>
                        <input type="hidden" value={member.stored_file_nm}/>
                        <input type="hidden" value={member.user_id}/>

                        <input
                            type="text"
                            className="field"
                            ref={user_nmRef}
                            value={member.user_nm}
                            onChange={(e) => setMember({...member, user_nm: e.target.value})}
                        />

                        <div>
                            성별:
                            {["여성", "남성", "FTM(Female to male)", "MTF(Male to Female)", "상관없음"].map((option) => (
                                <label key={option}>
                                    <input
                                        type="radio"
                                        value={option}
                                        checked={gender === option}
                                        onChange={handleGenderChange}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>

                        <select onChange={(e) => setMbti(e.target.value)} value={member.mbti} ref={mbtiRef}>
                            {["ISTJ", "ISTP", "ISFJ", "ISFP", "INFJ", "INTJ", "INFP", "INTP", "ESTJ", "ESFP", "ESFJ", "ESTP", "ENFP", "ENTP", "ENFJ", "ENTJ"]
                                .map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                        </select>

                        <input
                            type="text"
                            className="field"
                            ref={tel_noRef}
                            value={member.tel_no}
                            onChange={(e) => setMember({...member, tel_no: e.target.value})}
                        />
                    </div>
                    <br/>
                    <input type="button" id="btnModify" className="btn_modify" value="수정" onClick={myPageModify}/>
                    <input type="button" id="btnCancel" className="btn_cancel" value="취소" onClick={goBack}/>
                    <br/><br/>
                </div>
            </div>
        </>
    )
}

export default MyPageModify;