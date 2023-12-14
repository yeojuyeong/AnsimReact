import { useState, useContext, useEffect } from "react";
import {DataContext} from "./DataProvider";

const TestMenu = (props) => {
    const { cctvData } = useContext(DataContext);
    const { selectedOption, handleOptionChange, currentPage, handleCCTVClick } = props;
    const [visibleCCTVData, setVisibleCCTVData] = useState([]); // 현재 보이는 CCTV 데이터 상태
    const [filteredCCTVData, setFilteredCCTVData] = useState([]); // 필터링된 CCTV 데이터 상태
    const itemsPerPage = 10; // 한 번에 보여줄 항목 수


    useEffect(() => {
        // cctvData가 유효한 배열일 때 필터링 수행
        if (Array.isArray(cctvData)) {
            const filteredData = cctvData.filter((item) => {
                if (selectedOption === 'cctv') {
                    return true;
                } else {
                    // 다른 옵션에 따라 필터링
                    return false;
                }
            });
            setFilteredCCTVData(filteredData);
        }
    }, [cctvData, selectedOption]);

    useEffect(() => {
        // visibleCCTVData 업데이트
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setVisibleCCTVData(filteredCCTVData.slice(startIndex, endIndex));
    }, [currentPage, filteredCCTVData]);

    return (
        <div
            id="menu2"
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
            <div id="cctvList"
                 style={{ cursor: 'pointer', maxHeight: '720px', overflowY: 'auto' }} >
                {visibleCCTVData.map((cctv, index) => (
                    <div key={index}
                         className="card_layout" onClick={(e) => {handleCCTVClick(index, e)}}>
                        <div className="card_nm">CCTV</div>
                        <div className="card_addr">
                            <span
                                style={{ color: '#817C7C', backgroundColor: '#fff', borderRadius: '10px', padding: ' 5px', fontSize: '9px' }}>
                                지번</span>
                            <span
                                style={{ fontSize: '12px', marginLeft: '10px' }}>
                                {cctv.addr}</span>
                        </div>
                        <div className="card_cnt">
                            <span
                                style={{ color: '#817C7C', backgroundColor: '#fff', borderRadius: '10px', padding: ' 5px', fontSize: '9px' }}>
                                갯수</span>
                            <span
                                style={{ fontSize: '12px', marginLeft: '10px' }}>
                                {cctv.quantity}</span>
                        </div>
                    </div>
                ))}
            </div>
            {/*<div id="emergList"*/}
            {/*     style={{ cursor: 'pointer', maxHeight: '720px', overflowY: 'auto' }} >*/}
            {/*    /!*{visibleCCTVData.map((cctv, index) => (*!/*/}
            {/*        <div*/}
            {/*             className="card_layout">*/}
            {/*            <div className="emerg_nm">안심 비상벨</div>*/}
            {/*            <div className="emerg_addr">*/}
            {/*                <span*/}
            {/*                    style={{ color: '#817C7C', backgroundColor: '#fff', borderRadius: '10px', padding: ' 5px', fontSize: '9px' }}>*/}
            {/*                    지번</span>*/}
            {/*                <span*/}
            {/*                    style={{ fontSize: '12px', marginLeft: '10px' }}>*/}
            {/*                    주소..</span>*/}
            {/*            </div>*/}
            {/*            <div className="emerg_cnt">*/}
            {/*                <span*/}
            {/*                    style={{ color: '#817C7C', backgroundColor: '#fff', borderRadius: '10px', padding: ' 5px', fontSize: '9px' }}>*/}
            {/*                    갯수</span>*/}
            {/*                <span*/}
            {/*                    style={{ fontSize: '12px', marginLeft: '10px' }}>*/}
            {/*                    1개..</span>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    /!*))}*!/*/}
            {/*</div>*/}
            {/*<div id="deliList"*/}
            {/*     style={{ cursor: 'pointer', maxHeight: '720px', overflowY: 'auto' }} >*/}
            {/*    /!*{visibleCCTVData.map((cctv, index) => (*!/*/}
            {/*    <div*/}
            {/*        className="card_layout">*/}
            {/*        <div className="card_nm">상봉2동 주민센터</div>*/}
            {/*        <div className="card_addr">*/}
            {/*                <span*/}
            {/*                    style={{ color: '#817C7C', backgroundColor: '#fff', borderRadius: '10px', padding: ' 5px', fontSize: '9px' }}>*/}
            {/*                    지번</span>*/}
            {/*            <span*/}
            {/*                style={{ fontSize: '12px', marginLeft: '10px' }}>*/}
            {/*                    주소..</span>*/}
            {/*        </div>*/}

            {/*    </div>*/}
            {/*    /!*))}*!/*/}
            {/*</div>*/}
            {/*<div id="policeList"*/}
            {/*     style={{ cursor: 'pointer', maxHeight: '720px', overflowY: 'auto' }} >*/}
            {/*    /!*{visibleCCTVData.map((cctv, index) => (*!/*/}
            {/*    <div*/}
            {/*        className="card_layout">*/}
            {/*        <div className="card_nm">서울 중부 을지 지구대</div>*/}
            {/*        <div className="card_addr">*/}
            {/*                <span*/}
            {/*                    style={{ color: '#817C7C', backgroundColor: '#fff', borderRadius: '10px', padding: ' 5px', fontSize: '9px' }}>*/}
            {/*                    지번</span>*/}
            {/*            <span*/}
            {/*                style={{ fontSize: '12px', marginLeft: '10px' }}>*/}
            {/*                    주소..</span>*/}
            {/*        </div>*/}

            {/*    </div>*/}
            {/*    /!*))}*!/*/}
            {/*</div>*/}
            {/*<div id="storeList"*/}
            {/*     style={{ cursor: 'pointer', maxHeight: '720px', overflowY: 'auto' }} >*/}
            {/*    /!*{visibleCCTVData.map((cctv, index) => (*!/*/}
            {/*    <div*/}
            {/*        className="card_layout">*/}
            {/*        <div className="card_nm">GS25 화곡 우정점</div>*/}
            {/*        <div className="card_addr">*/}
            {/*                <span*/}
            {/*                    style={{ color: '#817C7C', backgroundColor: '#fff', borderRadius: '10px', padding: ' 5px', fontSize: '9px' }}>*/}
            {/*                    도로명</span>*/}
            {/*            <span*/}
            {/*                style={{ fontSize: '12px', marginLeft: '10px' }}>*/}
            {/*                    도로명 주소..</span>*/}
            {/*        </div>*/}
            {/*        <div className="card_addr">*/}
            {/*                <span*/}
            {/*                    style={{ color: '#817C7C', backgroundColor: '#fff', borderRadius: '10px', padding: ' 5px', fontSize: '9px' }}>*/}
            {/*                    지번</span>*/}
            {/*            <span*/}
            {/*                style={{ fontSize: '12px', marginLeft: '10px' }}>*/}
            {/*                    구 주소..</span>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    /!*))}*!/*/}
            {/*</div>*/}
        </div>
    )
}

export default TestMenu;