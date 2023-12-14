import { useState, useContext, useEffect } from "react";
import {DataContext} from "./DataProvider";
import InfoCard from '../components/InfoCard';

const InfoFacility = () => {
    const { cctvData } = useContext(DataContext);
    const { selectedOption, handleOptionChange, currentPage, handleCCTVClick, menuVisible, selectedMenu} = useContext(DataContext);
    const [visibleCCTVData, setVisibleCCTVData] = useState([]); // 현재 보이는 CCTV 데이터 상태
    // const [filteredCCTVData, setFilteredCCTVData] = useState([]); // 필터링된 CCTV 데이터 상태
    const [filteredData, setFilteredData] = useState([]); // 필터링된 데이터 상태
    const itemsPerPage = 10; // 한 번에 보여줄 항목 수

    useEffect(() => {
        let data = [];
        switch (selectedOption) {
            case 'cctv':
                data = cctvData;
                break;
            // case 'emrgbell':
            //     data = emergData;
            //     break;
            // ... 다른 옵션에 따른 데이터 처리 로직 추가
        }
        setFilteredData(data);
    }, [selectedOption, cctvData, /* ... 다른 데이터들 */]);

    useEffect(() => {
        // visibleCCTVData 업데이트
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setVisibleCCTVData(filteredData.slice(startIndex, endIndex));
    }, [currentPage, filteredData]);

    return (
        <div id="sidebar_menu" className={menuVisible ? 'open' : 'closed'}>
            {selectedMenu === '안심 시설물' && (
                <div
                    id="info"
                >
                    <h2>안심 시설물</h2>
                    <select
                        id="dropdownMenu"
                        style={{ width: '250px', height: '25px' }}
                        value={selectedOption} // 선택된 옵션을 표시
                        onChange={handleOptionChange} // 옵션 변경 시 핸들러 호출
                    >
                        <option value="00" disabled>선택</option>
                        <option value="cctv">안심 CCTV</option>
                        <option value="emrgbell">안심 비상벨</option>
                        <option value="delibox">안심 택배함</option>
                        <option value="police">경찰서</option>
                        <option value="safeStore">안심 편의점</option>
                    </select>
                    <div id="cardList">
                        {visibleCCTVData.map((data, index) => (
                            <InfoCard data={data} key={index} handleCCTVClick={handleCCTVClick} selectedOption={selectedOption}/>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )}


export default InfoFacility;