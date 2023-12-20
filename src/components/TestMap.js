import { useContext, useEffect, useState, useRef } from "react";
import { DataContext } from "./DataProvider";
import locationIcon from "../images/location.png";
import cctvIcon from "../images/cctv.png";

const TestMap = () => {
    const { Tmapv2 } = window;
    const [map, setMap] = useState(null);
    const currentMarker = useRef(null);
    const markers = useRef([]);
    const { cctvData, selectedOption, cctvIndex } = useContext(DataContext);
    // 최초 맵 생성
    useEffect(() => {
        const initTmap = () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(position => {
                    const currentLat = position.coords.latitude;
                    const currentLng = position.coords.longitude;
                    const currentLocation = new Tmapv2.LatLng(currentLat, currentLng);

                    console.log("현재 위치 - 위도: " + currentLat + ", 경도: " + currentLng);

                    // 현재 위치로 지도를 생성.
                    const initialMap = new Tmapv2.Map("map_div", {
                        center: currentLocation,
                        width: "1700px",
                        height: "89vh",
                        zoom: 14
                    });

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
        };

        const removeMarkers = () => {
            if (markers.current && markers.current.length > 0) {
                markers.current.forEach(element => {
                    element.setMap(null);
                });

                markers.current = [];
            }
        }

        const drawMarkers = () => {
            const newMarkers = [];
            if (selectedOption === "cctv") {
                // cctv 마커 그리기
                cctvData.forEach(element => {
                    const position = new Tmapv2.LatLng(element.latitude, element.longitude);
                    const marker = new Tmapv2.Marker({
                        position: position,
                        map: map,
                        icon: cctvIcon
                    });
                    newMarkers.push(marker);
                });

                markers.current = newMarkers;
            } else if (selectedOption === "emrgbell") {
                // 안심 비상벨
                removeMarkers();
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

        if (map === null) {
            initTmap();
        } else {
            drawMarkers();
        }

    }, [Tmapv2.LatLng, Tmapv2.Map, Tmapv2.Marker, cctvData, selectedOption, map]);

    // CCTV 위치로 지도 중심 이동
    if (cctvIndex > -1 && map !== null) {
        const cctv = cctvData[cctvIndex];
        const position = new Tmapv2.LatLng(cctv.latitude, cctv.longitude);

        map.setCenter(position);
    }

    return (
        <div id="map_container">
            <div id="map_div"></div>
        </div>
    );
}

export default TestMap;