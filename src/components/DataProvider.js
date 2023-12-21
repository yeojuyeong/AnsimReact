import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
export const DataContext = createContext();

const DataProvider = ({ children }) => {
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    
    const [selectedOption, setSelectedOption] = useState("00");
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
    const [cctvIndex, setCctvIndex] = useState(-1);

    const [cctvData, setCctvData] = useState([]);
    const [emergbellData, setEmergbellData] = useState([]);
    const [deliboxData, setDeliboxData] = useState([]);
    const [policeData, setPoliceData] = useState([]);
    const [storeData, setStoreData] = useState([]);

    // 선택한 옵션에 따라 데이터 필터링
    const handleOptionChange = (event) => {
        const option = event.target.value;
        setSelectedOption(option);
        setCurrentPage(1); // 옵션 변경 시 페이지 번호 초기화
    };

    // Card 클릭 이벤트
    const handleCardClick = (index) => {
        setCctvIndex(index);
    }

    const handleMenuClick = (menu) => {
        // 현재 선택한 메뉴와 클릭한 메뉴가 같은 경우 닫기.
        if (selectedMenu === menu && menuVisible) {
            setSelectedMenu(null);
            setMenuVisible(false);
        } else {
            setSelectedMenu(menu);
            setMenuVisible(true);
        }
    };

    return (
        <DataContext.Provider
            value={{ cctvData, setCctvData, emergbellData, setEmergbellData, deliboxData, setDeliboxData, policeData, setPoliceData, storeData, setStoreData, selectedMenu, menuVisible, selectedOption, currentPage, cctvIndex
                , handleOptionChange, handleCardClick, handleMenuClick}}>
            {children}
        </DataContext.Provider>
    )

}
export default DataProvider;