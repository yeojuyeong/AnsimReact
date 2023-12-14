import React, { createContext, useState } from 'react';
export const DataContext = createContext();

const DataProvider = ({ children }) => {
    // CCTV 데이터를 가져와서 state에 저장
    const [cctvData, setCCTVData] = useState([
        {
        addr: '등촌2동 509-1',
        quantity: 1,
        latitude: 37.5493,
        longitude: 126.8634
    },
        {
            addr: '등촌2동 509-1',
            quantity: 3,
            latitude: 37.5611,
            longitude: 127.0293
        },
        {
            addr: '풍납동 388-8 풍성초 정문',
            quantity: 2,
            latitude: 37.5261,
            longitude: 127.1125
        },
        {
            addr: '여의대방로65길 13',
            quantity: 2,
            latitude: 37.5168,
            longitude: 126.929
        },
        {
            addr: '응암1동 109-22 드림캐시아 앞(방범)',
            quantity: 2,
            latitude: 37.5987,
            longitude: 126.921
        },
        {
            addr: '등촌2동 509-1',
            quantity: 1,
            latitude: 37.5493,
            longitude: 126.8634
        },
        {
            addr: '등촌2동 509-1',
            quantity: 1,
            latitude: 37.5493,
            longitude: 126.8634
        },
        {
            addr: '여의대방로65길 13',
            quantity: 2,
            latitude: 37.5168,
            longitude: 126.929
        },
        {
            addr: '여의대방로65길 13',
            quantity: 2,
            latitude: 37.5168,
            longitude: 126.929
        },
        {
            addr: '여의대방로65길 13',
            quantity: 2,
            latitude: 37.5168,
            longitude: 126.929
        },
        {
            addr: '여의대방로65길 13',
            quantity: 2,
            latitude: 37.5168,
            longitude: 126.929
        },
        {
            addr: '여의대방로65길 13',
            quantity: 2,
            latitude: 37.5168,
            longitude: 126.929
        }]);
    // const [cctvData, setCctvData] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    
    const [selectedOption, setSelectedOption] = useState("00");
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
    const [cctvIndex, setCCTVIndex] = useState(-1);

    // 선택한 옵션에 따라 데이터 필터링
    const handleOptionChange = (event) => {
        const option = event.target.value;
        setSelectedOption(option);
        setCurrentPage(1); // 옵션 변경 시 페이지 번호 초기화
    };

    // CCTV 클릭 이벤트
    const handleCCTVClick = (index) => {
        setCCTVIndex(index);
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
            value={{ cctvData, selectedMenu, menuVisible, selectedOption, currentPage, cctvIndex
                , handleOptionChange, handleCCTVClick, handleMenuClick}}>
            {children}
        </DataContext.Provider>
    )

}
export default DataProvider;