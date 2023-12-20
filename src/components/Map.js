import { useContext, useEffect, useState, useRef } from "react";
import { DataContext } from "./DataProvider";
import locationIcon from "../images/location.png";
import cctvIcon from "../images/cctv.png";
import emergbellIcon from "../images/emergbell.png";
import axios from "axios";

const Map = () => {
    const {Tmapv2} = window;
    const [map, setMap] = useState(null);
    const currentMarker = useRef(null);
    const markers = useRef([]);
    const {cctvData, setCctvData, emergbellData, setEmergbellData, selectedOption, cctvIndex} = useContext(DataContext);
    var infoWindow = new Tmapv2.InfoWindow();
    const minZoom = 17;
    const maxZoom = 18;
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
                        zoomControl : true,
                        scrollwheel : true,
                    })
                    initialMap.setZoomLimit(minZoom, maxZoom);

                    // 현재 위치에 마커 생성
                    const initialMarker = new Tmapv2.Marker({
                        position: currentLocation,
                        map: initialMap,
                        icon: locationIcon,
                    });

                    // 처음에 1회만 axios 요청
                    fn_getAnsimOjbectInBound(initialMap);

                    // 드래그 이벤트 등록
                    initialMap.addListener("dragend", (e) => {
                        const dragLocation = e.latLng;
                        console.log('드래그가 끝난 위치의 중앙좌표는 ' + dragLocation + '입니다.');

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
                    // console.log(marker);
                    if (marker) {
                        marker.setMap(null);
                    }
                }
                markers.current = [];
            }
        }

        const drawMarkers = (facList) => {

            if (selectedOption === "cctv") {
                const newMarkers = [];
                // cctv 마커
                for (let i = 0; i < facList.length; i++) {
                    const position = new Tmapv2.LatLng(facList[i].latitude, facList[i].longitude);
                    const marker = new Tmapv2.Marker({
                        position: position,
                        icon: cctvIcon,
                        map: map
                    });
                    newMarkers.push(marker);
                }
                removeMarkers();
                markers.current = newMarkers;

            } else if (selectedOption === "emrgbell") {
                // 안심 비상벨
                removeMarkers();
                const newMarkers = [];
                // emrgbell 마커
                for (let i = 0; i < facList.length; i++) {
                    const position = new Tmapv2.LatLng(facList[i].latitude, facList[i].longitude);
                    const marker = new Tmapv2.Marker({
                        position: position,
                        icon: emergbellIcon,
                        map: map
                    });
                    newMarkers.push(marker);
                }
                removeMarkers();
                markers.current = newMarkers;

            } else if (selectedOption === "delibox") {
                // 안심 택배함
                removeMarkers();
            } else if (selectedOption === "police") {
                // 경찰서
                removeMarkers();
            } else if (selectedOption === "safeStore") {
                // 안심 편의점
                removeMarkers();
            }
        }

        // map에서 bound가져와서 해당 bound안에있는 안심객체 불러오기
        const fn_getAnsimOjbectInBound = async (map) => {
            // 지도의 영역을 가져오는 함수 bound(bottomLeft, topRight)
            const bound = map.getBounds();
            const arr = bound.toString().split(':');
            const bottomLeft = arr[0].split(',');
            const topRight = arr[1].split(',');

            const queryString = {
                bottomLeftLat: bottomLeft[0], //최소위도
                bottomLeftLng: bottomLeft[1], //최소경도
                topRightLat: topRight[0], //최대위도
                topRightLng: topRight[1] //최대경도
            }
            // 해당 영역 내 cctv 데이터 요청
            axios
                .post('http://localhost:8080/info/cctvList', queryString) //파일 전송시나 개인정보
                .then((cctvRes) => {
                    drawMarkers(cctvRes.data);
                    //console.log(cctvRes.data)
                    setCctvData(cctvRes.data);
                });

            // // 해당 영역 내 cctv 데이터 요청
            // axios
            //     .post('http://localhost:8080/guide/postAnsimFacListInBoundary', queryString) //파일 전송시나 개인정보
            //     .then((emergRes) => {
            //         drawMarkers(emergRes.data);
            //         //console.log(emergRes.data);
            //         setEmergbellData(emergRes.data);
            //     });
        }

        if(selectedOption === 'cctv'){
            fn_getAnsimOjbectInBound(map);
            // console.log(cctvData2);
        }
        if(selectedOption === 'emergbell'){
            removeMarkers();
            fn_getAnsimOjbectInBound(map);
        }

        // CCTV 위치로 지도 중심 이동
        if (cctvIndex > -1) {
            const cctv = cctvData[cctvIndex];
            // console.log(cctv)
            const position = new Tmapv2.LatLng(cctv.latitude, cctv.longitude);

            map.setCenter(position);
        }

    return (
        <div id="map_container">
            <div id="map_div"></div>
        </div>
    );
}
    export default Map;