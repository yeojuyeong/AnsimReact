import cuImage from "../images/cu.png";
import sevenElevenImage from "../images/seven.png";
import gsImage from "../images/gs.png";
import mnstopImage from "../images/ministop.png";

import {DataContext} from "./DataProvider";
import {useContext} from "react";

const InfoCard = ({ data, index, handleCardClick, selectedOption }) => {

    const { handleBreakdownButtonInCard } = useContext(DataContext);

    return (
        <div className="card_layout" onClick={(e) => {
            handleCardClick(index, e)
        }}>
            <div className="card_nm">
                {data.addr_nm ? data.addr_nm : selectedOption === 'cctv'
                    ? 'CCTV'
                    : selectedOption === 'emergbell'
                        ? '안심 비상벨'
                        : selectedOption === 'store'
                            ? (
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <div>
                                        <span style={{whiteSpace: 'nowrap'}}>{data.store_brand}</span>
                                        {'\n'}
                                        <span style={{whiteSpace: 'nowrap', marginLeft: '10px'}}> {data.store_nm}</span>
                                    </div>
                                    {data.store_brand === 'CU' && (
                                        <img src={cuImage} alt="CU" style={{width: '60px', height: '60px'}}/>
                                    )}
                                    {data.store_brand === '세븐일레븐' && (
                                        <img src={sevenElevenImage} alt="세븐일레븐"
                                             style={{width: '60px', height: '60px'}}/>
                                    )}
                                    {data.store_brand === 'GS25' && (
                                        <img src={gsImage} alt="GS25" style={{width: '60px', height: '60px'}}/>
                                    )}
                                    {data.store_brand === '미니스톱' && (
                                        <img src={mnstopImage} alt="미니스톱" style={{width: '60px', height: '60px'}}/>
                                    )}
                                </div>
                            )
                            : `${data.police_station_nm} ${data.police_office_nm} ${data.division}`}
            </div>

            <div className="card_addr">
                <span
                    style={{
                        color: '#817C7C',
                        backgroundColor: '#fff',
                        borderRadius: '10px',
                        padding: '3px',
                        fontSize: '8px',
                        fontWeight: 'bold'
                    }}>
                    지번</span>
                <span
                    style={{fontSize: '11px', marginLeft: '4px'}}>
                    {data.addr ? data.addr : data.road_addr} </span>
            </div>
            {data.police_conn_yn && (
                <div className="card_police">
                <span
                    style={{
                        color: '#817C7C',
                        backgroundColor: '#fff',
                        borderRadius: '10px',
                        padding: '3px',
                        fontSize: '8px',
                        fontWeight: 'bold'
                    }}>
                    경찰 연계</span>
                    <span
                        style={{fontSize: '10px', marginLeft: '10px'}}>
                    {data.police_conn_yn === 'Y' ? 'O' : 'X'}</span>
                    <span
                        style={{
                            color: '#817C7C',
                            backgroundColor: '#fff',
                            borderRadius: '10px',
                            padding: '3px',
                            fontSize: '8px',
                            marginLeft: '4px',
                            fontWeight: 'bold'
                        }}>
                    관할</span>
                    <span
                        style={{fontSize: '10px', marginLeft: '10px'}}>
                    {data.mng_org}</span>
                </div>
            )}
            {data.telno && (
                <div className="card_telno">
                <span
                    style={{
                        color: '#817C7C',
                        backgroundColor: '#fff',
                        borderRadius: '10px',
                        padding: ' 3px',
                        fontSize: '8px',
                        fontWeight: 'bold'
                    }}>
                    전화번호</span>
                    <span
                        style={{fontSize: '12px', marginLeft: '10px'}}>
                    {data.telno}</span>
                </div>
            )}
            <button onClick={() => handleBreakdownButtonInCard()}>
                고장신고
            </button>
        </div>
    )
}
export default InfoCard;