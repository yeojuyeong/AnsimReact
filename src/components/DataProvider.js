import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
export const DataContext = createContext();

const DataProvider = ({ children }) => {
    const [selectedOption, setSelectedOption] = useState("00");
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
    const [dataIndex, setDataIndex] = useState(-1);

    const [cctvData, setCctvData] = useState([]);
    const [emergbellData, setEmergbellData] = useState([]);
    const [deliboxData, setDeliboxData] = useState([]);
    const [policeData, setPoliceData] = useState([]);
    const [storeData, setStoreData] = useState([]);

    const [drawedInfoWindow, setDrawedInfoWindow] = useState(null);
    const [map, setMap] = useState(null);
    const [dataOfDrawedInfoWindow, setDataOfDrawedInfoWindow] = useState('테스트');
    const [breakdownReportVisible, setBreakdownReportVisible] = useState(false);

    // 선택한 옵션에 따라 데이터 필터링
    const handleOptionChange = (event) => {
        const option = event.target.value;
        setSelectedOption(option);
        setCurrentPage(1); // 옵션 변경 시 페이지 번호 초기화
        //setDrawedInfoWindow(null);
        if(drawedInfoWindow != null){
            //기존 InfoWindow 화면에서 지우고
            drawedInfoWindow.setMap(null);
            setDrawedInfoWindow(null);
        }
    };

    // Card 클릭 이벤트
    const handleCardClick = (index) => {
        setDataIndex(index);
    }

    const handleBreakdownButtonInCard = (index) => {
        console.log("고장신고 버튼 눌렀다");
        setBreakdownReportVisible(true);
    }

    return (
        <DataContext.Provider
            value={{ cctvData, setCctvData, emergbellData, setEmergbellData, deliboxData, setDeliboxData, policeData, setPoliceData, storeData, setStoreData, selectedOption, currentPage, dataIndex
                , handleOptionChange, handleCardClick, drawedInfoWindow, setDrawedInfoWindow, map, setMap, dataOfDrawedInfoWindow, setDataOfDrawedInfoWindow, handleBreakdownButtonInCard
                ,breakdownReportVisible, setBreakdownReportVisible
            }}>
            {children}
        </DataContext.Provider>
    )

}
export default DataProvider;