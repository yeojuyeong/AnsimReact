import '../../css/SignupPage.css';
import { useState, useRef} from 'react';
const SignupPage = () => {

    //회원 등록 정보 - state 등록
    const [user_id, setUser_id] = useState('');
    const user_idRef = useRef();
    const [message, setMessage] = useState('');
    const user_idChange = async (e) =>{
        setUser_id(e.target.value);
        let formData = new FormData();
        formData.append("user_id",user_idRef.current.value);
        await fetch('http://localhost:8080/member/idCheck',{method : 'POST', body: formData})
            .then((response) => response.json())
            .then((data) => {
                console.log("아이디체크 컨트롤러보낸다")
                if(data.status === 'GOOD') {
                    console.log("아이디체크 오케이 서버에서 받았다")
                    setMessage('사용 가능한 아이디입니다.');
                } else setMessage('이미 사용중인 아이디입니다.');
            }).catch((error)=> { console.log("error = " + error);} );
    }

    const [user_nm, setUser_nm] = useState('');
    const user_nmRef = useRef();
    const [password, setPassword] = useState('');
    const [password1, setPassword1] = useState('');
    const passwordRef = useRef();
    const password1Ref = useRef();
    const [gender, setGender] = useState('');
    const genderValue = gender;


    const [mbti, setMbti] = useState('');
    const mbtiRef = useRef();
    const [tel_no, setTel_no] = useState('');
    const tel_noRef = useRef();
    const fromSocial = "N";

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

    const handleGenderChange = (e) => {
        setGender(e.target.value);
    }

    const handleRegister = async () => {

        //유효성 검사
        if(imgCheck === 'N') { alert("프로필 이미지를 등록하세요"); return false; }
        if(user_idRef.current.value === '') { alert("아이디을 입력하세요."); user_idRef.current.focus();  return false; }
        if(user_nmRef.current.value === '') { alert("이름을 입력하세요."); user_nmRef.current.focus(); return false; }

        const Pass = passwordRef.current.value;
        const Pass1 = password1Ref.current.value;
        if(Pass === '') { alert("암호를 입력하세요."); passwordRef.current.focus(); return false; }
        if(Pass1 === '') { alert("암호를 입력하세요."); password1Ref.current.focus(); return false; }
        if(Pass !== Pass1)
        { alert("입력된 비밀번호를 확인하세요"); password1Ref.current.focus(); return false; }

        // 암호유효성 검사
        //자바스크립트의 정규식(Regular Expression)
        let num = Pass.search(/[0-9]/g); // 0-9까지의 숫자가 들어 있는지 검색. 검색이 안되면 -1을 리턴
        let eng = Pass.search(/[a-z]/ig); //i : 알파벳 대소문자 구분 없이...
        // let spe = Pass.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);	//특수문자가 포함되어 있는가 검색
        if(Pass.length < 8 || Pass.length > 20) { alert("암호는 8자리 ~ 20자리 이내로 입력해주세요."); return false; }
        else if(Pass.search(/\s/) !== -1){ alert("암호는 공백 없이 입력해주세요."); return false; }
        // else if(num < 0 || eng < 0 || spe < 0 ){ alert("암호는 영문,숫자,특수문자를 혼합하여 입력해주세요."); return false; }
        else if(num < 0 || eng < 0 ){ alert("암호는 영문,숫자를 혼합하여 입력해주세요."); return false; }

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
        formData.append("password", passwordRef.current.value);
        formData.append("gender",genderValue);
        // formData.append("hobby",checkItems.toString());
        formData.append("mbti",mbtiRef.current.value);
        formData.append("tel_no",tel_noRef.current.value);
        // formData.append("description",descriptionRef.current.value);
        // formData.append("nickname",nicknameRef.current.value);
        formData.append("fromSocial",fromSocial);
        formData.append("imgProfile", imgProfile);

        await fetch('http://localhost:8080/member/signup', {
            method: 'POST',
            body: formData,
        }).then((response) => response.json())
            .then((data) => {
                console.log('회원가입 컨트롤러에 보낸다.')
                if(data.message === 'GOOD'){
                    alert(decodeURIComponent(data.user_nm) + "님, 회원 가입을 축하 드립니다.");
                    document.location.href="/login";
                } else {
                    alert("서버 장애로 회원 가입에 실패했습니다.");
                }
            });

    }
    return(
        <>
            <div>
                <form className="signupMain">
                    <h1 className="signupTitle">Sign Up</h1>
                    <div>
                        <input type="file" name="fileUpload" className="signupInputImage" ref={fileEventRef}
                               onChange={(e) => fileEventChange(e)}
                               style={{display: 'none'}}/>
                        <div className="signupImgView" ref={imgZoneRef} onClick={(e) => imgZoneClick(e)}>
                            {imgFile ? <img className="signupImgBox" src={imgFile} alt="회원 프로파일"/> : <>
                                클릭 후 탐색창에서<br/>
                                사진을 선택해 주세요.
                            </>}
                        </div>
                        <br/>
                        <input type="text" className="signupField" ref={user_idRef} value={user_id}
                               onChange={(e) => user_idChange(e)} placeholder="아이디"/><br/>
                        <span style={{color: 'red'}}>{message}</span>
                        <input type="text" className="signupField" ref={user_nmRef} value={user_nm}
                               onChange={(e) => setUser_nm(e.target.value)} placeholder="이름"/>
                        <input type="password" className="signupField" ref={passwordRef} value={password}
                               onChange={(e) => setPassword(e.target.value)} placeholder="패스워드"/>
                        <input type="password" className="signupField" ref={password1Ref} value={password1}
                               onChange={(e) => setPassword1(e.target.value)} placeholder="패스워드 확인"/><br /><br />

                            <div className="genderDiv">Gender :
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
                            </div>
                            <br/>
                            MBTI :
                            <select className="signupOptionField" onChange={(e) => setMbti(e.target.value)} value={mbti}
                                    ref={mbtiRef}>
                                {["ISTJ", "ISTP", "ISFJ", "ISFP", "INFJ", "INTJ", "INFP", "INTP", "ESTJ", "ESFP", "ESFJ", "ESTP", "ENFP", "ENTP", "ENFJ", "ENTJ"]
                                    .map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                            </select>
                            <br/>

                        <input type="text" value={tel_no} ref={tel_noRef} onChange={(e) => setTel_no(e.target.value)}
                               className="signupField" placeholder="전화번호를 입력하세요."/>
                        <br/><br/>
                        <input type="button" className="signupPageBtn" onClick={handleRegister} value="등록"/>

                    </div>
                </form>
                <br/><br/>
            </div>
        </>
    )
}
export default SignupPage;