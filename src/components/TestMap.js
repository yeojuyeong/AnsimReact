import { useContext, useEffect, useState } from "react";
import { DataContext } from "./DataProvider";
import locationIcon from "../images/location.png";
import cctvIcon from "../images/cctv.png";
import axios from "axios";

const TestMap = (props) => {
    const { Tmapv2 } = window;
    const { selectedOption, cctvIndex } = props;
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState([]);
    // const marker = [];
    const cctvData = useContext(DataContext).cctvData;

    // 최초 맵 생성
    useEffect(() => {
        const initTmap = () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(position => {
                    const currentLat = position.coords.latitude;
                    const currentLng = position.coords.longitude;

                    console.log("현재 위치 - 위도: " + currentLat + ", 경도: " + currentLng);

                    // 현재 위치로 지도를 생성.
                    const initialMap = new Tmapv2.Map("map_div", {
                        center: new Tmapv2.LatLng(currentLat, currentLng),
                        width: "1700px",
                        height: "89vh",
                        zoom: 17
                    });
                    const currentLocation = new Tmapv2.LatLng(currentLat, currentLng);
                    // 현재 위치에 마커 생성
                    const initialMarker = new Tmapv2.Marker({
                        position: currentLocation,
                        map: initialMap,
                        icon: locationIcon,
                    });
                    setMap(initialMap);
                    marker.push(initialMarker);
                    console.log("현재 위치 마커", marker);


                        const data2 = {
                            "bottomLeftLat": "37.537397342400425",
                            "bottomLeftLng":"126.83655738830606",
                            "bottomRightLat":"37.56461635030337",
                            "bottomRightLng":"126.83655738830606",
                            "topRightLat":"37.56461635030337",
                            "topRightLng":"126.86187744140662",
                            "topLeftLat": "37.537397342400425",
                            "topLeftLng":"126.86187744140662"
                        };

                        axios
                            .post('http://localhost:8080/guide/postAnsimFacListInBoundary', data2) //파일 전송시나 개인정보
                            .then((res) => {
                                console.log('rrrrrfggrrrrrrrrrrrrr');
                                console.log(res.data);
                                //return res.data;
                            });


                }, (error) => {
                    console.error("Geolocation 오류 : " + error.message);
                });
            } else {
                console.error("Geolocation을 지원하지 않는 브라우저입니다.");
            }
        };

        // const drawMarkers = () => {
        //     const newMarkers = [];
        //     if (selectedOption === "cctv") {
        //         // cctv 마커 그리기
        //         cctvData.forEach(element => {
        //             const position = new Tmapv2.LatLng(element.latitude, element.longitude);
        //             const marker = new Tmapv2.Marker({
        //                 position: position,
        //                 map: map,
        //                 icon: cctvIcon
        //             });
        //
        //             newMarkers.push(marker);
        //             console.log(marker)
        //         });
        //     }
        // }

        // console.log("맵 생성");
        if (map === null) {
            initTmap();
        } else {
            // drawMarker();
        }
        // 드래그 이벤트 핸들러 등록
        if (map !== null) {
            const dragEndHandler = (e) => {
                const dragLocation = e.latLng; // 드래그된 위치의 좌표 가져오기
                console.log('드래그가 끝난 위치의 중앙좌표는 ' + dragLocation + '입니다.');

                // 드래그된 위치에 마커 생성
                const draggedMarker = new Tmapv2.Marker({
                    position: dragLocation,
                    map: map,
                    icon: locationIcon
                });
                setMarker([draggedMarker]); // 새로운 마커로 배열을 갱신
                console.log("드래그 위치 마커", marker);

            };
            map.addListener("dragend", dragEndHandler);
        }

    }, [Tmapv2.LatLng, Tmapv2.Map, Tmapv2.Marker, cctvData, selectedOption, map]);

    if (cctvIndex > -1 && map !== null) {
        const cctv = cctvData[cctvIndex];
        const position = new Tmapv2.LatLng(cctv.latitude, cctv.longitude);

        map.setCenter(position);
    }
    // 화면에 DB에서 select된 cctv 객체들 뿌리기
    const drawMarker = function (facList){
        for (let i=0; i< facList.length; i++){
            const marker = new Tmapv2.Marker({
                position: new Tmapv2.LatLng(facList[i].latitude, facList[i].longitude),
                icon: cctvIcon,
                map: map
            });
        }
    }

    //map에서 bound가져와서 해당 bound안에있는 안심객체 불러오기
    const fn_getAnsimOjbectInBound = async(map)=>{

        // 지도의 영역을 가져오는 함수 bound(bottomLeft, topRight)
        var bound = map.getBounds();
        const arr = bound.toString().split(':');
        const bottomLeft = arr[0].split(',');
        const topRight = arr[1].split(',');

        //Map의 bound(bottomLeft, topRight)를 가지고 bottomRight, topLeft 좌표 구하는 함수
        function fn_findingDifferentPoint(bottomLeft,topRight){
            const topLeft = { lat: bottomLeft.lat, lng: topRight.lng };
            const bottomRight = { lat: topRight.lat, lng: bottomLeft.lng };
            return {topLeft, bottomRight};
        }

        const topLeftBottomRight = fn_findingDifferentPoint(
            {lat: bottomLeft[0], lng: bottomLeft[1]},
            {lat: topRight[0], lng: topRight[1]}
        )

        const queryString = {
            bottomLeftLat: bottomLeft[0],
            bottomLeftLng: bottomLeft[1],
            bottomRightLat:topLeftBottomRight.bottomRight.lat,
            bottomRightLng:topLeftBottomRight.bottomRight.lng,
            topRightLat:topRight[0],
            topRightLng:topRight[1],
            topLeftLat:topLeftBottomRight.topLeft.lat,
            topLeftLng:topLeftBottomRight.topLeft.lng
        }

        axios
            .post('http://localhost:8080/guide/postAnsimFacListInBoundary', queryString) 
            .then((res) => {
                console.log('rrrrrfggrrrrrrrrrrrrr');
                console.log(res.data);
                drawMarker(res.data);
            });


    }


    return (
        <div id="map_container">
            <div id="map_container">
                <div id="map_div"></div>
            </div>
        </div>
    );
}

export default TestMap;