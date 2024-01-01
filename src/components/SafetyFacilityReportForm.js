import {useState, useContext, useEffect} from 'react';
import '../css/SafetyFacilityReportForm.css';
import {DataContext} from "./DataProvider";

const SafetyFacilityReportForm = () => {

    const { breakdownReportVisible, setBreakdownReportVisible } = useContext(DataContext);

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
                    <input type="text" name="facilityType" value={formData.facilityType} onChange={handleChange} />
                </label>
                <br />

                <label>
                    Location Description:
                    <textarea name="locationDescription" value={formData.locationDescription} onChange={handleChange} />
                </label>
                <br />

                <label>
                    Issue Details:
                    <textarea name="issueDetails" value={formData.issueDetails} onChange={handleChange} />
                </label>
                <br />

                <label>
                    Reporter Name:
                    <input type="text" name="reporterName" value={formData.reporterName} onChange={handleChange} />
                </label>
                <br />

                <label>
                    Contact Info:
                    <input type="text" name="contactInfo" value={formData.contactInfo} onChange={handleChange} />
                </label>
                <br />

                <label>
                    Photo:
                    <input type="file" name="photo" onChange={handleChange} />
                </label>
                <br />

                <label>
                    Priority:
                    <select name="priority" value={formData.priority} onChange={handleChange}>
                        <option value="">Select Priority</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </label>
                <br />

                <label>
                    Agree to Terms:
                    <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} />
                </label>
                <br />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default SafetyFacilityReportForm;