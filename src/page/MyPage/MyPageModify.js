import {useState, useRef, useEffect} from 'react';
import getCookie from '../../components/GetCookie';
import {useNavigate} from 'react-router-dom';
import axios from "axios";


const MyPageModify = () => {

    //쿠키 가져 오기
    const userCookie = getCookie('userid');
    //사용자 정보
    const [member, setMember] = useState({});
    console.log(userCookie);

    const navigate = useNavigate();


    useEffect(()=> {

        const fetchData = async () => {
            const response = await axios.get(`http://localhost:8080/member/memberInfo?&user_id=${userCookie}`);
            const memberData = response.data; // 응답에서 data 속성에 액세스
            console.log(memberData);
            setMember(memberData);
            setUser_id(memberData.user_id || '');
            setUser_nm(memberData.user_nm || '');
            setGender(memberData.gender || '');
            setMbti(memberData.mbti || '');
            setTel_no(memberData.tel_no || '');

            // const fileFromPath = (filePath) => {
            //     return new File([new Blob()], filePath);
            // };
            // 이미지가 DB에서 불러와졌을 때 imgCheck를 'Y'로 설정
            if (memberData.stored_file_nm) {
                setImgCheck('Y');
                // setImgProfile(fileFromPath(`http://localhost:8080/profile/${memberData.stored_file_nm}`));
            }
        }
        fetchData();

    },[userCookie]);

    if (!userCookie) {
        document.location.href='/guide';
    }

    const handleGenderChange = (e) => {
        setGender(e.target.value);
    }


    const imageZone = {
        border: '2px solid #92AAB0',
        width: '70%',
        height: 'auto',
        color: '#92AAB0',
        textAlign: 'center',
        verticalAlign: 'middle',
        margin: 'auto',
        padding: '10px 10px',
        fontSize: '200%'
    }


    //회원 등록 정보 - state 등록
    const [user_id, setUser_id] = useState('');
    const user_idRef = useRef();
    const [message, setMessage] = useState('');


    const [user_nm, setUser_nm] = useState('');
    const user_nmRef = useRef();
    const [gender, setGender] = useState(member.gender);
    const genderValue = gender;


    const [mbti, setMbti] = useState('');
    const mbtiRef = useRef();
    const [tel_no, setTel_no] = useState('');
    const tel_noRef = useRef();

    //이미지 저장용 state
    const [imgProfile, setImgProfile] = useState('');
    //이미지 등록 여부 확인
    const [imgCheck, setImgCheck] = useState("N");

    //이미지 미리 보기
    const [imgFile, setImgFile] = useState("");
    const imgZoneRef = useRef();
    const fileEventRef = useRef();
    const imgZoneClick = (e) => { fileEventRef.current.click(e); }
    const fileEventChange = (e) => {
        showImage(e.target.files[0]);
        setImgProfile(e.target.files[0]);
    }
    const showImage = (files) => {
        const reader = new FileReader(); //new 연산자를 통해서 FileReader() 객체를 reader가 참조(상속)
        reader.readAsDataURL(files);
        reader.onload = () => { setImgFile(reader.result); };
        setImgCheck("Y");
    }



    const handleRegister = async () => {

        //유효성 검사
        if(imgCheck === 'N') { alert("프로필 이미지를 등록하세요"); return false; }
        if(user_nmRef.current.value === '') { alert("이름을 입력하세요."); user_nmRef.current.focus(); return false; }



        if(!Boolean(genderValue)) { alert("성별을 선택하세요."); return false; }
        // if(checkItems.length === 0) { alert("취미를 선택하세요."); return false; }
        if(mbtiRef.current.value === 'description') { alert("mbti을 선택하세요."); return false; }
        if(tel_noRef.current.value === '') { alert("전화번호를 입력하세요."); tel_noRef.current.focus(); return false; }
        //전화번호 문자열 정리
        const beforeTelno = tel_noRef.current.value;
        const afterTelno = beforeTelno.replace(/-/gi,"").replace(/ /gi,"").trim();
        tel_noRef.current.value = afterTelno;
        // if(nicknameRef.current.value === '') { alert("별명을 입력하세요."); nicknameRef.current.focus(); return false; }
        // if(descriptionRef.current.value ==='') { alert("자기소개를 입력하세요."); descriptionRef.current.focus(); return false; }

        let formData = new FormData();

        formData.append("user_id", user_idRef.current.value);
        formData.append("user_nm", user_nmRef.current.value);
        console.log("user_nmRef.current.value:", user_nmRef.current.value);
        formData.append("gender",genderValue);
        formData.append("mbti",mbtiRef.current.value);
        formData.append("tel_no",tel_noRef.current.value);
        // formData.append("imgProfile", imgProfile);
        // 기존 이미지가 없거나, 새로운 이미지를 선택한 경우에만 추가
        console.log("imgProfile: "+imgProfile);
        formData.append('imgProfile', imgProfile);


        await fetch('http://localhost:8080/member/mypageModify', {
            method: 'POST',
            body: formData,
        }).then((response) => response.json())
            .then((data) => {
                console.log('수정 컨트롤러에 보낸다.')
                if(data.message === 'GOOD'){
                    alert(decodeURIComponent(data.user_nm) + "님, 회원정보가 정상적으로 수정되었습니다.");
                    document.location.href="/guide";
                } else {
                    alert("서버 장애로 회원 가입에 실패했습니다.");
                }
            });



    }
    const goBack = () => {
        navigate(-1);
    }
    return(
        <>
            <div>

                <form className="WriteForm">
                    <h1>수정</h1><br/>
                    <div id="RegistryForm">
                        <br/><br/>
                        {/*<input type="file" name="fileUpload" ref={fileEventRef} onChange={(e) => fileEventChange(e)}*/}
                        {/*       style={{display: 'none'}}/>*/}
                        {/*<div className="imageZone" style={imageZone} ref={imgZoneRef} onClick={(e) => imgZoneClick(e)}>*/}
                        {/*    {imgFile ? <img src={imgFile} alt="회원 프로파일"*/}
                        {/*                    style={{width: '350px', height: 'auto'}}/> : "클릭 후 탐색창에서 사진을 선택해 주세요."}*/}
                        {/*</div>*/}
                        <input
                            type="file"
                            name="fileUpload"
                            ref={fileEventRef}
                            onChange={(e) => fileEventChange(e)}
                            style={{display: 'none'}}
                        />
                        <div className="imageZone" style={imageZone} ref={imgZoneRef} onClick={(e) => imgZoneClick(e)}>
                            {imgFile ? (
                                <img src={imgFile} alt="회원 프로파일" style={{width: '350px', height: 'auto'}}/>
                            ) : member.stored_file_nm ? (
                                <img
                                    src={`http://localhost:8080/profile/${member.stored_file_nm}`}
                                    alt="회원 프로파일"
                                    style={{width: '350px', height: 'auto'}}
                                />
                            ) : (
                                "클릭 후 탐색창에서 사진을 선택해 주세요."
                            )}
                        </div>
                        <input type="hidden" className="input_field" ref={user_idRef} value={user_id}/><br/>
                        <span style={{color: 'red'}}>{message}</span>
                        <input type="text" className="input_field" ref={user_nmRef} value={user_nm}
                               onChange={(e) => setUser_nm(e.target.value)}/>

                        <div style={{
                            width: '90%',
                            textAlign: 'left',
                            position: 'relative',
                            left: '35px',
                            borderBottom: '2px solid #adadad',
                            margin: '10px',
                            padding: '10px'
                        }}>
                            성별:
                            {["여성", "남성", "FTM(Female to male)", "MTF(Male to Female)"].map((option) => (
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
                            <br/>
                            MBTI :
                            <select onChange={(e) => setMbti(e.target.value)} value={mbti} ref={mbtiRef}>
                                {["ISTJ", "ISTP", "ISFJ", "ISFP", "INFJ", "INTJ", "INFP", "INTP", "ESTJ", "ESFP", "ESFJ", "ESTP", "ENFP", "ENTP", "ENFJ", "ENTJ"]
                                    .map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                            </select>
                            <br/>
                        </div>
                        <input
                            type="text"
                            className="input_field"
                            ref={tel_noRef}
                            value={tel_no}
                            onChange={(e) => setTel_no(e.target.value)}
                        />
                        <br/>
                        <input type="button" className="btn_write" onClick={handleRegister} value="여기를 클릭하세요!!!"/>
                        <input type="button" id="btnCancel" className="btn_cancel" value="취소" onClick={goBack}/>
                    </div>
                </form>
                <br/><br/>
            </div>
        </>
    )
}
export default MyPageModify;