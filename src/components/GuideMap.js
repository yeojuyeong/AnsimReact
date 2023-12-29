import { useState, useContext, useEffect, useRef } from "react";
import {DataContext} from "./DataProvider";

const GuideMap =(props)=>{

    //console.log('GuideMap > props',props)

    const setGuideMap = props.param.setGuideMap;
    const Tmapv2 = props.param.Tmapv2;

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

                console.log("현재 위치 - 위도: " + currentLat + ", 경도: " + currentLng);

                // 현재 위치로 지도를 생성.
                const map = new Tmapv2.Map("map_div", {
                    center: currentLocation,
                    //width: "1750px",
                    width: mapWidth,
                    height: "89vh",
                    //height: mapHeight+'px',
                    zoom: 16,
                    zoomControl : true,
                    scrollwheel : true
                });

                setGuideMap(map);

                //initialMap.setZoomLimit(minZoom, maxZoom);

            }, (error) => {
                console.error("Geolocation 오류 : " + error.message);
            });
        } else {
            console.error("Geolocation을 지원하지 않는 브라우저입니다.");
        }
    }, []);
    return(
        <>
            <div id="map_container">
                <div id="map_div"></div>
            </div>
        </>
    );
}
export default GuideMap;