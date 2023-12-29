import React, { useState, useContext, useEffect, useRef, Rec } from "react";
import {DataContext} from "./DataProvider";
import pinIcon from "../images/pin_icon.png";
import { CiRedo } from "react-icons/ci";
import { FaRoute } from "react-icons/fa6";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaCaretDown } from "react-icons/fa";

const GuideSidebar =(props)=> {

    //console.log("GuideSidebar 랜더링");

    const [selectedFacOptions, setSelectedFacOptions] = useState([]); // 선택된 안심객체 옵션들을 저장할 상태

    const guideMap = props.param.guideMap;
    const setGuideBasePoint = props.param.setGuideBasePoint;
    const guideBasePoint = props.param.guideBasePoint;
    const Tmapv2 = props.param.Tmapv2;
    const drawMarker = props.param.drawMarker;
    const callPedestrianAPI = props.param.callPedestrianAPI;
    const callOrderListFacInBoundary = props.param.callOrderListFacInBoundary;
    const selectedMarkerInMap = props.param.selectedMarkerInMap;

    //console.log("GuideSidebar > selectedMarkerInMap:",selectedMarkerInMap);

    //안심객체
    const facOptions = [
        { label: 'CCTV', value: 'C' },
        { label: '안심택배', value: 'D' },
        { label: '비상벨', value: 'E' },
        { label: '편의점', value: 'S' },
        { label: '파출소', value: 'P' },
    ];

    // useState
    const [startKeyword, setStartKeyword] = useState();
    const [endKeyword, setEndKeyword] = useState();
    const [resultPoisObj, setResultPoisObj] = useState(null);

    const isMounted = useRef(false); //첫번째 랜더링에는 useEffect가 실행되지 않도록 하는 flag 값

    async function doMapGuide() {

        //시작마커
        drawMarker(guideBasePoint.startPointLat, guideBasePoint.startPointLon, 38, 38, pinIcon);
        //목적지마커
        drawMarker(guideBasePoint.endPointLat, guideBasePoint.endPointLon, 38, 38, pinIcon);

        //경유지 없는 보행자 경로 API 호출
        await callPedestrianAPI();

        //시작/도착 중심점 바운더리 내에 안심객체 찾는 컨트롤러 호출
        await callOrderListFacInBoundary(selectedFacOptions);

    }

    //POI 검색 결과 중 선택 시 출발지 OR 목적지 위도,경도 셋팅
    function selectPoi(id,arg,lat,lon){

        if(arg == 'start') {
            const updatedObject = {
                ...guideBasePoint,
                'startPointLat': lat,
                'startPointLon': lon
            };
            setGuideBasePoint(updatedObject);
        }

        if(arg == 'end') {
            const updatedObject = {
                ...guideBasePoint,
                'endPointLat': lat,
                'endPointLon': lon
            };
            setGuideBasePoint(updatedObject);
        }

        setResultPoisObj(null);

    }

    useEffect(() => {
        if (isMounted.current) {callPOIApi('start');}
    }, [startKeyword]);

    useEffect(() => {
        if (isMounted.current) callPOIApi('end');
        else { isMounted.current = true; } //첫번째 랜더링에는 실행되지 않고 이후부터는 실행되도록
    }, [endKeyword]);

    //POI API 호출
    async function callPOIApi(arg) {

        //text값 가져오기
        let searchKeyword = (arg == 'start')? startKeyword : endKeyword;

        if(typeof searchKeyword == "undefined" || searchKeyword == null || searchKeyword == "") return;

        console.log('searchKeyword',searchKeyword);

        var headers = {};
        headers["appKey"]="FMHrfuOs4Z6qvFnNXfZsV2fiSbTQjiC241luv6PK";

        const url = 'https://apis.openapi.sk.com/tmap/pois?version=1&format=json&callback=result'
            + '&searchKeyword=' + searchKeyword
            + '&resCoordType=' + 'EPSG3857'
            + '&reqCoordType=' + 'WGS84GEO'
            + '&count=' + '5'
        ;

        await fetch(url,{
            method:'GET',
            headers: headers
        }).then((response) => response.json())
            .then((data)=>{ //API 호출 성공 시

                console.log("data: ",data);
                let resultpoisData = data.searchPoiInfo.pois.poi;

                let arr = [];

                // POI 조회 결과 처리
                for (let k in resultpoisData) {

                    let noorLat = Number(resultpoisData[k].noorLat);
                    let noorLon = Number(resultpoisData[k].noorLon);

                    // EPSG3857좌표계를 WGS84GEO좌표계로 변환
                    let projectionCng
                        = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(new Tmapv2.Point(noorLon, noorLat));

                    let lat = projectionCng._lat; //찐 위도, 경도
                    let lon = projectionCng._lng;

                    const resultPoisObj = {
                        'name' : resultpoisData[k].name, //시설물 명칭
                        'upperBizName' : resultpoisData[k].upperBizName, //업종 대분류명
                        'middleBizName' : resultpoisData[k].middleBizName, //업종 중분류명
                        'lowerBizName' : resultpoisData[k].lowerBizName, //업종 소분류명
                        'upperAddrName' : resultpoisData[k].upperAddrName, //표출 주소 대분류명
                        'middleAddrName' : resultpoisData[k].middleAddrName, //표출 주소 중분류명
                        'lowerAddrName' : resultpoisData[k].lowerAddrName, //표출 주소 소분류명
                        'detailAddrName' : resultpoisData[k].detailAddrName, //표출 주소 세부
                        'id' : resultpoisData[k].id,
                        'lat' : lat,
                        'lon' : lon,
                        'arg' : arg
                    };
                    arr.push(resultPoisObj);
                }
                setResultPoisObj(arr);
            }).catch((error)=> {
                console.log("error = " + error);
            });

    } // getPOIApi() END

    const selectAll = (event) => {
        const { checked } = event.target;

        if (checked) {
            // ALL이 체크되면 모든 옵션을 선택
            setSelectedFacOptions(facOptions.map(option => option.value));
        } else {
            // ALL이 체크 해제되면 모든 옵션 선택 해제
            setSelectedFacOptions([]);
        }
    };

    const handleOptionChange = (value) => {
        // 개별 옵션이 변경되면 해당 옵션을 토글
        setSelectedFacOptions(prevOptions => {
            if (prevOptions.includes(value)) {
                return prevOptions.filter(option => option !== value);
            } else {
                return [...prevOptions, value];
            }
        });
    };

    return (
            <div id="sidebar_menu" className='open'>
                    <div>
                        <h2><FaRoute/> 안심 귀갓길 찾기</h2>

                        <div id="div1">
                            <input type="text" className="text_custom" id="searchStartKeyword" value={startKeyword}
                                   placeholder="출발지"
                                   onBlur={(e) => setStartKeyword(e.target.value)}/>
                            <br/>
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <FaCaretDown/>
                            </div>

                            <div className="stopover_wrap" style={{position: "relative", zIndex: 1999}}>
                                {selectedMarkerInMap.map((stopover,index) => (
                                    <div key={stopover.key} >
                                        <p>{stopover.type === 'C' ? 'CCTV' : stopover.type === 'D' ? '안심택배'
                                            : stopover.type === 'E' ? '비상벨' : stopover.type === 'S' ? '편의점' :  '파출소'}, {stopover.addr}</p>
                                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                            <FaCaretDown/>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <input type="text" className="text_custom" id="searchEndKeyword" value={endKeyword}
                                   placeholder="목적지"
                                   onBlur={(e) => setEndKeyword(e.target.value)}/>
                        </div>

                        <div style={{float: 'left', height: 'auto'}}>
                            <div className="rst_wrap" style={{position: "relative", zIndex: 1999}}>
                                <div className="rst mCustomScrollbar">
                                    <ul>
                                        {resultPoisObj && resultPoisObj.map((value, index) => {

                                            return <li key={index}>
                                                <div>
                                                    <div>
                                                        <HiOutlineLocationMarker/>
                                                        <span style={{fontWeight: 'bold'}}>{value.name}</span><br/>
                                                        <span>{value.upperBizName}</span>&nbsp;
                                                        <span>{value.middleBizName}</span>&nbsp;
                                                        <span>{value.lowerBizName}</span>
                                                    </div>
                                                    <div>
                                                        <span>{value.upperAddrName}</span>&nbsp;
                                                        <span>{value.middleAddrName}</span>&nbsp;
                                                        <span>{value.lowerAddrName}</span>&nbsp;
                                                        <span>{value.detailAddrName}</span>
                                                    </div>
                                                    <button type="button" name="sendBtn"
                                                            onClick={() => selectPoi(value.id, value.arg, value.lat, value.lon)}>
                                                        선택
                                                    </button>
                                                </div>

                                            </li>

                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div style={{position: "relative", zIndex: 999}}>
                            <label>
                                <input className="checkbox" type="checkbox" id="all" name="all"
                                       checked={selectedFacOptions.length === facOptions.length}
                                       onChange={(e) => selectAll(e)}/>
                                ALL <br/>
                            </label>
                            {facOptions.map(option => (
                                <label key={option.value}>
                                    <input
                                        className="checkbox"
                                        type="checkbox"
                                        name="ansimFacOption"
                                        value={option.value}
                                        checked={selectedFacOptions.includes(option.value)}
                                        onChange={() => handleOptionChange(option.value)}
                                    />
                                    {option.label}<br/>
                                </label>
                            ))}
                        </div>

                        <div>
                            <button className="button"><CiRedo/></button>
                            {selectedMarkerInMap.length === 0 ? (
                                <button className="button" onClick={() => doMapGuide()}>길찾기</button>
                            ) : (
                                <button className="button" onClick={() => callPedestrianAPI('Y')}>안심길찾기</button>
                            )}
                        </div>
                    </div>
            </div>
    );
}
export default GuideSidebar;