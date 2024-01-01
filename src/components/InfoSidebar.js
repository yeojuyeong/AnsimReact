import { useState, useContext, useEffect } from "react";
import {DataContext} from "./DataProvider";
import InfoCard from '../components/InfoCard';
import { TbFileInfo } from "react-icons/tb";

const InfoSidebar = () => {
    const { cctvData, emergbellData, deliboxData, policeData, storeData } = useContext(DataContext);
    const { selectedOption, handleOptionChange, currentPage, handleCardClick} = useContext(DataContext);
    const [visibleData, setVisibleData] = useState([]); // 현재 보이는 CCTV 데이터 상태
    const [filteredData, setFilteredData] = useState([]); // 필터링된 데이터 상태
    const itemsPerPage = 10; // 한 번에 보여줄 항목 수

    //const { dataOfDrawedInfoWindow, setDataOfDrawedInfoWindow } = useContext(DataContext);
    //console.log("인포 사이드 랜더링:",dataOfDrawedInfoWindow);

    useEffect(() => {
        let data = [];
        switch (selectedOption) {
            case 'cctv':
                data = cctvData;
                break;
            case 'emergbell':
                data = emergbellData;
                break;
            case 'delibox':
                data = deliboxData;
                break;
            case 'police':
                data = policeData;
                break;
            case 'store':
                data = storeData;
                break;
        }
        setFilteredData(data);
    }, [selectedOption, cctvData, emergbellData, deliboxData, policeData, storeData]);

    useEffect(() => {
        // visibleData 업데이트
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setVisibleData(filteredData.slice(startIndex, endIndex));
    }, [currentPage, filteredData]);

    return (
        <div id="sidebar_menu" className='open'>
                <div id="info">
                    <h2><TbFileInfo/>&nbsp;안심 시설물</h2>
                    <select
                        id="dropdownMenu"
                        style={{ width: '230px', height: '25px' }}
                        value={selectedOption} // 선택된 옵션을 표시
                        onChange={handleOptionChange} // 옵션 변경 시 핸들러 호출
                    >
                        <option value="00" disabled>선택</option>
                        <option value="cctv">안심 CCTV</option>
                        <option value="emergbell">안심 비상벨</option>
                        <option value="delibox">안심 택배함</option>
                        <option value="police">경찰서</option>
                        <option value="store">안심 편의점</option>
                    </select>
                    <div id="cardList">
                        {visibleData.map((data, index) => (
                            <InfoCard data={data} key={data.id} index={index} handleCardClick={handleCardClick} selectedOption={selectedOption} />
                        ))}
                    </div>
                </div>
        </div>
    )}


export default InfoSidebar;