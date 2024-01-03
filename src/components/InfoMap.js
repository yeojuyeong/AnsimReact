import { useContext, useEffect, useState, useRef } from "react";
import { DataContext } from "./DataProvider";
import locationIcon from "../images/location.png";
import cctvIcon from "../images/cctv_c_icon.png";
import emergbellIcon from "../images/emergbell_c_icon.png";
import deliboxIcon from "../images/delivery_c_icon.png";
import policeIcon from "../images/police_c_icon.png";
import storeIcon from "../images/store_c_icon.png";
import axios from "axios";
const InfoMap = () => {
    const {Tmapv2} = window;
    //const [map, setMap] = useState(null);
    const [saveLocation, setSaveLocation] = useState(null);
    const currentMarker = useRef(null);
    const markers = useRef([]);
    const {
        cctvData, setCctvData
        ,emergbellData, setEmergbellData
        ,deliboxData,setDeliboxData
        ,policeData,setPoliceData
        ,storeData,setStoreData
        ,selectedOption, setSelectedOption
        ,dataIndex
        ,handleCardClick
        ,drawedInfoWindow,setDrawedInfoWindow
        ,map, setMap
        ,dataOfBreakdownReport, setDataOfBreakdownReport
    } = useContext(DataContext);
    const minZoom = 16;
    const maxZoom = 18;
   // console.log(map);

    // 최초 맵 생성
    useEffect(() => {

        var mapContainer = document.getElementById('map_container');
        var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        var mapWidth = screenWidth * 1; // 화면 너비의 80%
        var mapHeight = screenHeight * 0.7; // 화면 높이의 70%

        mapContainer.style.width = mapWidth + 'px';
        mapContainer.style.height = mapHeight + 'px';

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                const currentLat = position.coords.latitude;
                const currentLng = position.coords.longitude;
                const currentLocation = new Tmapv2.LatLng(currentLat, currentLng);

                //console.log("현재 위치 - 위도: " + currentLat + ", 경도: " + currentLng);

                // 현재 위치로 지도를 생성.
                const initialMap = new Tmapv2.Map("map_div", {
                    center: currentLocation,
                    //width: "1750px",
                    width: mapWidth,
                    height: "100vh",
                    zoom: 19,
                    zoomControl: true,
                    scrollwheel: true
                })
                initialMap.setZoomLimit(minZoom, maxZoom);

                // 현재 위치에 마커 생성
                const initialMarker = new Tmapv2.Marker({
                    position: currentLocation,
                    map: initialMap,
                    icon: locationIcon,
                });

                // 드래그 이벤트 등록
                initialMap.addListener("dragend", (e) => {
                    const dragLocation = e.latLng;
                    //console.log('드래그가 끝난 위치의 중앙좌표는 ' + dragLocation + '입니다.');
                    setSaveLocation(dragLocation);
                    if (currentMarker.current) {
                        currentMarker.current.setPosition(dragLocation);

                    } else {
                        // 마커가 없으면 새로운 마커를 생성
                        const newMarker = new Tmapv2.Marker({
                            position: dragLocation,
                            map: initialMap,
                            icon: locationIcon,
                        });
                        currentMarker.current = newMarker;
                    }
                })
                currentMarker.current = initialMarker;
                setMap(initialMap);
                setSelectedOption("cctv");
            }, (error) => {
                console.error("Geolocation 오류 : " + error.message);
            });
        } else {
            console.error("Geolocation을 지원하지 않는 브라우저입니다.");
        }
    }, []);

    // 기존 마커 삭제 함수
    const removeMarkers = () => {
        if (markers.current && markers.current.length > 0) {
            for (let i = 0; i < markers.current.length; i++) {
                const marker = markers.current[i];
                if (marker) {
                    marker.setMap(null);
                }
            }
            markers.current = [];
        }
    }

    // 안심객체 마커 생성
    const drawMarkers = (facList) => {
        removeMarkers();
        const newMarkers = [];

        if (selectedOption === "cctv") {
            // cctv 마커
           // console.log("selectDataPosition : ",selectDataPosition)
            for (let i = 0; i < facList.length; i++) {
                const position = new Tmapv2.LatLng(facList[i].latitude, facList[i].longitude);
                const marker = new Tmapv2.Marker({
                    position: position,
                    icon: cctvIcon,
                    map: map
                });
                newMarkers.push(marker);
                // marker.addListener("click", function(evt) {
                //     makeInfoWindow(facList[i])
                // });
            }
        } else if (selectedOption === "emergbell") {
            // 안심 비상벨 마커
            for (let i = 0; i < facList.length; i++) {
                const position = new Tmapv2.LatLng(facList[i].latitude, facList[i].longitude);
                const marker = new Tmapv2.Marker({
                    position: position,
                    icon: emergbellIcon,
                    map: map
                });
                newMarkers.push(marker);
                // marker.addListener("click", function(evt) {
                //     makeInfoWindow(facList[i])
                // });
            }

        } else if (selectedOption === "delibox") {
            // 안심 택배함 마커
            for (let i = 0; i < facList.length; i++) {
                const position = new Tmapv2.LatLng(facList[i].latitude, facList[i].longitude);
                const marker = new Tmapv2.Marker({
                    position: position,
                    icon: deliboxIcon,
                    map: map
                });
                newMarkers.push(marker);
                // marker.addListener("click", function(evt) {
                //     makeInfoWindow(facList[i])
                // });
            }
        } else if (selectedOption === "police") {
            // 경찰서 마커
            for (let i = 0; i < facList.length; i++) {
                const position = new Tmapv2.LatLng(facList[i].latitude, facList[i].longitude);
                const marker = new Tmapv2.Marker({
                    position: position,
                    icon: policeIcon,
                    map: map
                });
                newMarkers.push(marker);
                // marker.addListener("click", function(evt) {
                //     makeInfoWindow(facList[i])
                // });
            }
        } else if (selectedOption === "store") {
            // 안심 편의점 마커
            for (let i = 0; i < facList.length; i++) {
                const position = new Tmapv2.LatLng(facList[i].latitude, facList[i].longitude);
                const marker = new Tmapv2.Marker({
                    position: position,
                    icon: storeIcon,
                    map: map
                });
                newMarkers.push(marker);
                // marker.addListener("click", function(evt) {
                //     makeInfoWindow(facList[i])
                // });
            }
        }
        markers.current = newMarkers;
    }

    // 경계 좌표 문자열을 파싱하여 쿼리 문자열을 생성하는 함수
    const createQueryStringFromBounds = (bounds) => {
        const arr = bounds.toString().split(':');
        const bottomLeft = arr[0].split(',');
        const topRight = arr[1].split(',');

        return {
            bottomLeftLat: bottomLeft[0], // 최소 위도
            bottomLeftLng: bottomLeft[1], // 최소 경도
            topRightLat: topRight[0],     // 최대 위도
            topRightLng: topRight[1]      // 최대 경도
        };
    };
    // cctv 데이터 요청
    const fn_getCCTVInBound = async () => {
        const bounds = map.getBounds();
        const queryString = createQueryStringFromBounds(bounds);

        axios
            .post('http://localhost:8080/info/cctvList', queryString)
            .then((cctvRes) => {
                drawMarkers(cctvRes.data);
                setCctvData(cctvRes.data);
            });
    }
    // emergbell 데이터 요청
    const fn_getEmergbellInBound = async () => {
        const bounds = map.getBounds();
        const queryString = createQueryStringFromBounds(bounds);

        axios
            .post('http://localhost:8080/info/emergbellList', queryString)
            .then((emergRes) => {
                drawMarkers(emergRes.data);
                setEmergbellData(emergRes.data);
            });
    }
    // delibox 데이터 요청
    const fn_getDeliboxInBound = async () => {
        const bounds = map.getBounds();
        const queryString = createQueryStringFromBounds(bounds);

        axios
            .post('http://localhost:8080/info/deliboxList', queryString)
            .then((deliboxRes) => {
                drawMarkers(deliboxRes.data);
                setDeliboxData(deliboxRes.data);
            });
    }
    // police 데이터 요청
    const fn_getPoliceInBound = async () => {
        const bounds = map.getBounds();
        const queryString = createQueryStringFromBounds(bounds);

        axios
            .post('http://localhost:8080/info/policeList', queryString)
            .then((policeRes) => {
                drawMarkers(policeRes.data);
                setPoliceData(policeRes.data);
            });
    }
    // store 데이터 요청
    const fn_getStoreInBound = async () => {
        const bounds = map.getBounds();
        const queryString = createQueryStringFromBounds(bounds);

        axios
            .post('http://localhost:8080/info/storeList', queryString)
            .then((storeRes) => {
                drawMarkers(storeRes.data);
                setStoreData(storeRes.data);
            });
    }

     useEffect(() => {
        if (selectedOption === 'cctv') {
            fn_getCCTVInBound();
        } else if (selectedOption === 'emergbell') {
            fn_getEmergbellInBound();
        } else if (selectedOption === 'delibox') {
            fn_getDeliboxInBound();
        } else if (selectedOption === 'police') {
            fn_getPoliceInBound();
        } else if (selectedOption === 'store') {
            fn_getStoreInBound();
        }
     }, [selectedOption, saveLocation]);


     const makeInfoWindow = async (data)=>{ //infoWindow를 생성한다.

        let addr=null;
        if(data.addr===""){ //지번이 없는 경우 도로명 셋팅
            addr = data.road_addr;
        }else{
            addr = data.addr;
        }

        //console.log("makeInfoWindow 실행>data.addr:",data.addr);
        //console.log("addraddraddr:",addr);

         if(map != null && addr != null){
            var content =
                "<div style='position: relative; border-bottom: 1px solid #dcdcdc; line-height: 18px; padding: 0 2px 2px 0; '>"+
                "<div style='font-size: 12px; line-height: 15px;'>"+
                //"<input type='button' onclick='alert(aa)' value='고장신고'/>"+
                //"<input type='button' onclick='alert(&apos;버튼이 클릭되었습니다!&apos;)' value='고장신고'/>"+
                "</div>"+
                "</div>"+
                "<div style='width:100px; position: relative; padding-top: 5px; display:inline-block'>"+
                "<div style='display:inline-block; margin-left:5px; vertical-align: top;'>"+
                "<span style='font-size: 12px; margin-left:2px; margin-bottom:2px; display:block;'>"+addr+"</span>"+
                "</div>"+
                "</div>";

            //Popup 객체 생성.
             const infoWindow = await new Tmapv2.InfoWindow({
                position: new Tmapv2.LatLng(data.latitude, data.longitude), //Popup 이 표출될 맵 좌표
                content: content, //Popup 표시될 text
                type: 1, //Popup의 type 설정.
                map: map //Popup이 표시될 맵 객체
            });

            map.setCenter(new Tmapv2.LatLng(data.latitude, data.longitude));

            if(drawedInfoWindow != null){
                //기존 InfoWindow 화면에서 지우고
                drawedInfoWindow.setMap(null);
            }

            //새로운 InfoWindow 넣고
            await setDrawedInfoWindow(infoWindow);

            //고장신고 Report 컴포넌트에서 사용할 데이터
            await setDataOfBreakdownReport(data);

        }
    }


    useEffect(() => {
        console.log("dataIndex change!!:",selectedOption, dataIndex);
        const data = selectedOption === 'cctv' ? cctvData[dataIndex]
            : selectedOption === 'emergbell' ? emergbellData[dataIndex]
                : selectedOption === 'delibox' ? deliboxData[dataIndex]
                    : selectedOption === 'police' ? policeData[dataIndex]
                        : selectedOption === 'store' ? storeData[dataIndex]
                            : null;
        console.log("selectedOption > data",data);
        if(data) {makeInfoWindow(data);}
    }, [dataIndex]);

        return (
            <div id="map_container">
                <div id="map_div"></div>
            </div>
        );
    }
export default InfoMap;