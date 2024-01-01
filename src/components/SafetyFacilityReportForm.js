import {useState, useContext, useEffect} from 'react';
import '../css/SafetyFacilityReportForm.css';
import {DataContext} from "./DataProvider";

const SafetyFacilityReportForm = () => {

    const {
        breakdownReportVisible, setBreakdownReportVisible
        ,dataOfBreakdownReport, setDataOfBreakdownReport
    } = useContext(DataContext);

    console.log("SafetyFacilityReportForm > dataOfBreakdownReport ",dataOfBreakdownReport);

    const [formData, setFormData] = useState({
        facilityType: '',
        locationDescription: '',
        issueDetails: '',
        reporterName: '',
        contactInfo: '',
        photo: null, // 파일 업로드를 위한 상태
        priority: '',
        agreeTerms: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : files ? files[0] : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 여기서 폼 제출 로직을 작성하면 됩니다.
        console.log('Form Data:', formData);
        // 실제로는 서버로 데이터를 전송하거나 상태를 업데이트하는 로직을 추가해야 합니다.
    };

    return (
        <div id='SafetyFacilityReportForm' className={breakdownReportVisible ? 'open' : 'closed'}>
            <form className="facilityReportForm" onSubmit={handleSubmit}>
                <label>
                    Facility Type:
                    <input type="text" name="facilityType"
                           value={ dataOfBreakdownReport && dataOfBreakdownReport.type ?
                                    dataOfBreakdownReport.type === 'C' ? 'CCTV' :
                                        dataOfBreakdownReport.type === 'E' ? '비상벨' :
                                            dataOfBreakdownReport.type === 'D' ? '안심 택배함' :
                                                dataOfBreakdownReport.type === 'S' ? '편의점' : '경찰서' : ''
                                }
                           onChange={handleChange} disabled />
                </label>
                <label>
                    Location:
                    <input name="locationDescription" value={dataOfBreakdownReport && dataOfBreakdownReport.addr} onChange={handleChange} disabled />
                </label>
                <label>
                    Priority:
                    <select name="priority" value={formData.priority} onChange={handleChange}>
                        <option value="">Select Priority</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </label>
                <label>
                    Issue Details:
                    <textarea name="issueDetails" value={formData.issueDetails} onChange={handleChange}/>
                </label>
                <label>
                    Photo:
                    <input type="file" name="photo" onChange={handleChange}/>
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default SafetyFacilityReportForm;