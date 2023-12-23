import { useContext, useEffect, useState, useRef } from "react";
import { DataContext } from "./DataProvider";
import locationIcon from "../images/location.png";
import cctvIcon from "../images/cctv_c_icon.png";
import emergbellIcon from "../images/emergbell_c_icon.png";
import deliboxIcon from "../images/delivery_c_icon.png";
import policeIcon from "../images/police_c_icon.png";
import storeIcon from "../images/store_c_icon.png";
import axios from "axios";

const Map = () => {
    const {Tmapv2} = window;
    const [map, setMap] = useState(null);
    const [saveLocation, setSaveLocation] = useState(null);
    const [selectDataPosition, setSelectDataPosition] = useState(null);
    const currentMarker = useRef(null);
    const markers = useRef([]);
    const {
        cctvData,
        setCctvData,
        emergbellData,
        setEmergbellData,
        deliboxData,
        setDeliboxData,
        policeData,
        setPoliceData,
        storeData,
        setStoreData,
        selectedOption,
        dataIndex,
        handleCardClick
    } = useContext(DataContext);
    const minZoom = 16;
    const maxZoom = 18;
   // console.log(map);

    // 최초 맵 생성
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                const currentLat = position.coords.latitude;
                const currentLng = position.coords.longitude;
                const currentLocation = new Tmapv2.LatLng(currentLat, currentLng);

                console.log("현재 위치 - 위도: " + currentLat + ", 경도: " + currentLng);

                // 현재 위치로 지도를 생성.
                const initialMap = new Tmapv2.Map("map_div", {
                    center: currentLocation,
                    width: "1750px",
                    height: "89vh",
                    zoom: 19,
                    zoomControl: true,
                    scrollwheel: true,
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
                    console.log('드래그가 끝난 위치의 중앙좌표는 ' + dragLocation + '입니다.');
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
                if(selectDataPosition){
                    if(position.lat() === selectDataPosition.lat() &&
                    position.lng() === selectDataPosition.lng()) {
                        const marker = new Tmapv2.Marker({
                            position: position,
                            icon: cctvIcon,
                            animation: Tmapv2.MarkerOptions.ANIMATE_BOUNCE,
                            map: map
                        });
                        newMarkers.push(marker);
                    }else{
                        const marker = new Tmapv2.Marker({
                            position: position,
                            icon: cctvIcon,
                            map: map
                        });
                        newMarkers.push(marker);
                    }
                }else{
                    const marker = new Tmapv2.Marker({
                        position: position,
                        icon: cctvIcon,
                        map: map
                    });
                    newMarkers.push(marker);
                }
            }
        } else if (selectedOption === "emergbell") {
            // 안심 비상벨 마커
            for (let i = 0; i < facList.length; i++) {
                const position = new Tmapv2.LatLng(facList[i].latitude, facList[i].longitude);
                if(selectDataPosition){
                    if(position.lat() === selectDataPosition.lat() &&
                        position.lng() === selectDataPosition.lng()) {
                        const marker = new Tmapv2.Marker({
                            position: position,
                            icon: emergbellIcon,
                            animation: Tmapv2.MarkerOptions.ANIMATE_BOUNCE,
                            map: map
                        });
                        newMarkers.push(marker);
                    }else{
                        const marker = new Tmapv2.Marker({
                            position: position,
                            icon: emergbellIcon,
                            map: map
                        });
                        newMarkers.push(marker);
                    }
                }else{
                    const marker = new Tmapv2.Marker({
                        position: position,
                        icon: emergbellIcon,
                        map: map
                    });
                    newMarkers.push(marker);
                }
            }

        } else if (selectedOption === "delibox") {
            // 안심 택배함 마커
            for (let i = 0; i < facList.length; i++) {
                const position = new Tmapv2.LatLng(facList[i].latitude, facList[i].longitude);
                if(selectDataPosition){
                    if(position.lat() === selectDataPosition.lat() &&
                        position.lng() === selectDataPosition.lng()) {
                        const marker = new Tmapv2.Marker({
                            position: position,
                            icon: deliboxIcon,
                            animation: Tmapv2.MarkerOptions.ANIMATE_BOUNCE,
                            map: map
                        });
                        newMarkers.push(marker);
                    }else{
                        const marker = new Tmapv2.Marker({
                            position: position,
                            icon: deliboxIcon,
                            map: map
                        });
                        newMarkers.push(marker);
                    }
                }else{
                    const marker = new Tmapv2.Marker({
                        position: position,
                        icon: deliboxIcon,
                        map: map
                    });
                    newMarkers.push(marker);
                }
            }
        } else if (selectedOption === "police") {
            // 경찰서 마커
            for (let i = 0; i < facList.length; i++) {
                const position = new Tmapv2.LatLng(facList[i].latitude, facList[i].longitude);
                if(selectDataPosition){
                    if(position.lat() === selectDataPosition.lat() &&
                        position.lng() === selectDataPosition.lng()) {
                        const marker = new Tmapv2.Marker({
                            position: position,
                            icon: policeIcon,
                            animation: Tmapv2.MarkerOptions.ANIMATE_BOUNCE,
                            map: map
                        });
                        newMarkers.push(marker);
                    }else{
                        const marker = new Tmapv2.Marker({
                            position: position,
                            icon: policeIcon,
                            map: map
                        });
                        newMarkers.push(marker);
                    }
                }else{
                    const marker = new Tmapv2.Marker({
                        position: position,
                        icon: policeIcon,
                        map: map
                    });
                    newMarkers.push(marker);
                }
            }
        } else if (selectedOption === "store") {
            // 안심 편의점 마커
            for (let i = 0; i < facList.length; i++) {
                const position = new Tmapv2.LatLng(facList[i].latitude, facList[i].longitude);
                if(selectDataPosition){
                    if(position.lat() === selectDataPosition.lat() &&
                        position.lng() === selectDataPosition.lng()) {
                        const marker = new Tmapv2.Marker({
                            position: position,
                            icon: storeIcon,
                            animation: Tmapv2.MarkerOptions.ANIMATE_BOUNCE,
                            map: map
                        });
                        newMarkers.push(marker);
                    }else{
                        const marker = new Tmapv2.Marker({
                            position: position,
                            icon: storeIcon,
                            map: map
                        });
                        newMarkers.push(marker);
                    }
                }else{
                    const marker = new Tmapv2.Marker({
                        position: position,
                        icon: storeIcon,
                        map: map
                    });
                    newMarkers.push(marker);
                }
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
    const fn_getCCTVInBound = async (map) => {
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
    const fn_getEmergbellInBound = async (map) => {
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
    const fn_getDeliboxInBound = async (map) => {
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
    const fn_getPoliceInBound = async (map) => {
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
    const fn_getStoreInBound = async (map) => {
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
            fn_getCCTVInBound(map);
        } else if (selectedOption === 'emergbell') {
            fn_getEmergbellInBound(map);
        } else if (selectedOption === 'delibox') {
            fn_getDeliboxInBound(map);
        } else if (selectedOption === 'police') {
            fn_getPoliceInBound(map);
        } else if (selectedOption === 'store') {
            fn_getStoreInBound(map);
        }
     }, [selectedOption, saveLocation, selectDataPosition]);

    //카드 위치로 이동
    let data;
    if (selectedOption === 'cctv') {
        data = cctvData[dataIndex];
        //setSelectDataPosition(data)
    } else if (selectedOption === 'emergbell') {
        data = emergbellData[dataIndex];
    } else if (selectedOption === 'delibox') {
        data = deliboxData[dataIndex];
    } else if (selectedOption === 'police') {
        data = policeData[dataIndex];
    } else if (selectedOption === 'store') {
        data = storeData[dataIndex];
    }
    //console.log(selectedOption, dataIndex);

    if (data) {
        const dataPosition = new Tmapv2.LatLng(data.latitude, data.longitude);
        map.setCenter(dataPosition);
        if (!selectDataPosition ||
            selectDataPosition.lat() !== dataPosition.lat() ||
            selectDataPosition.lng() !== dataPosition.lng()) {
            setSelectDataPosition(dataPosition);
        }
       // console.log("ggdsg",selectDataPosition)
    }
    
        return (
            <div id="map_container">
                <div id="map_div"></div>
            </div>
        );
    }
        export default Map;