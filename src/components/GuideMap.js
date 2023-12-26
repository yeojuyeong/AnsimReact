import { useState, useContext, useEffect, useRef } from "react";
import {DataContext} from "./DataProvider";

const GuideMap =(props)=>{

    //console.log('GuideMap > props',props)

    const setGuideMap = props.param.setGuideMap;
    const Tmapv2 = props.param.Tmapv2;

    //const { Tmapv2 } = window;
    //const [map, setMap] = useState(null);

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
                const map = new Tmapv2.Map("map_div", {
                    center: currentLocation,
                    width: "1750px",
                    height: "89vh",
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