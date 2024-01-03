import {useState, useContext, useEffect} from 'react';
import '../css/SafetyFacilityReportForm.css';
import {DataContext} from "./DataProvider";
import getCookie from './GetCookie';

const SafetyFacilityReportForm = () => {

    const [brokenOption, setBrokenOption] = useState(null);
    const [selectedBrokenOption, setSelectedBrokenOption] = useState(null);
    const [content, setContent] = useState(null);

    const {
        breakdownReportVisible, setBreakdownReportVisible
        ,dataOfBreakdownReport, setDataOfBreakdownReport
    } = useContext(DataContext);

    //시설type별 고장유형 가져오기
    async function callBrokenType(type){

        await fetch(`http://localhost:8080/info/brokenType?type=${type}`,{
            method:'GET'
        }).then((response) => response.json())
            .then((data)=>{
                //console.log("callBrokenType > data",data);
                setBrokenOption(data);
            }).catch((error)=> {
                console.log("error = " + error);
            });
    } //callBrokenType  END

    //고장신고 등록 API 호출
    async function registerBrokenReport(){

        //로그인된 쿠키값 가져오기
        const userid = getCookie('userid');
        console.log(userid);

        if(userid === undefined || userid === null){
            alert("로그인 후 이용가능한 서비스입니다.");
            return;
        }

        const data = {
            fac_id: dataOfBreakdownReport.id,
            fac_type: dataOfBreakdownReport.type,
            broken_opt_cd: selectedBrokenOption,
            content: content,
            user_id: userid //쿠키에서 가져오기
            //photo: null //사진 첨부 추후 작업 예정
        }

        console.log("data:",data);

        //컨트롤러 호출
        await fetch(`http://localhost:8080/info/brokenReportAdd`,{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then((response) => response.json())
            .then((data)=>{
                //console.log("registerBrokenReport api 호출 결과값",data);
                alert("고장신고가 등록되었습니다.");
                window.location.reload();
            }).catch((error)=> {
                console.log("error = " + error);
            });
    } //registerBrokenReport  END


    useEffect(() => {
        if(dataOfBreakdownReport){callBrokenType(dataOfBreakdownReport.type);}
    }, [dataOfBreakdownReport]);

    return (
        <div id='SafetyFacilityReportForm' className={breakdownReportVisible ? 'open' : 'closed'}>
            <form className="facilityReportForm" >
                <label>
                    시설유형:
                    <input type="text" name="facilityType"
                           value={dataOfBreakdownReport &&
                               (dataOfBreakdownReport.type === 'C' ? 'CCTV' :
                                   dataOfBreakdownReport.type === 'E' ? '비상벨' :
                                       dataOfBreakdownReport.type === 'D' ? '안심 택배함' :
                                           dataOfBreakdownReport.type === 'S' ? '편의점' : '경찰서')
                           } disabled/>
                </label>
                <label>
                    시설위치:
                    <input name="locationDescription" value={dataOfBreakdownReport && dataOfBreakdownReport.addr} disabled/>
                </label>
                <label>
                    고장유형:
                    <select value={selectedBrokenOption}
                            onChange={(e) => setSelectedBrokenOption(e.target.value)}
                            style={{ width: '200px', height: '35px', fontSize: '12px' }}>
                        <option value="">선택하세요</option>
                        {brokenOption && brokenOption.map((option, index) => (
                            <option key={index} value={option.opt_cd}>
                                {option.opt_nm}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    상세내용:
                    <textarea name="issueDetails" value={content}
                              onChange={(e) => setContent(e.target.value)}/>
                </label>
                <label>
                    사진:
                    <input type="file" name="photo" />
                </label>
                <button type="button" onClick={()=>{registerBrokenReport()}}>Submit</button>
                <button type="button" onClick={()=>{setBreakdownReportVisible(false)}}>Close</button>
            </form>
        </div>
    );
};

export default SafetyFacilityReportForm;