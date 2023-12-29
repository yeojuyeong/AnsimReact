import GuideSidebar from "../../components/GuideSidebar";
import GuideMap from '../../components/GuideMap';
import '../../css/GuidePage.css';
import {useState, useRef, useEffect} from "react";
import cctv_c_icon from "../../images/cctv_c_icon.png";
import delivery_c_icon from "../../images/delivery_c_icon.png";
import emergbell_c_icon from "../../images/emergbell_c_icon.png";
import police_c_icon from "../../images/police_c_icon.png";
import store_c_icon from "../../images/store_c_icon.png";
import cctv_b_icon from "../../images/cctv_b_icon.png";
import delivery_b_icon from "../../images/delivery_b_icon.png";
import emergbell_b_icon from "../../images/emergbell_b_icon.png";
import police_b_icon from "../../images/police_b_icon.png";
import store_b_icon from "../../images/store_b_icon.png";

const GuidePage = (props) => {

    //console.log("GuidePage 랜더링");

    //InfoMap 사용 변수
    const { Tmapv2 } = window;
    var drawInfoArr = [];
    var resultdrawArr = [];

    console.log("resultdrawArr",resultdrawArr);

    const [guideMap, setGuideMap] = useState(null);
    const [selectedMarkerInMap, setSelectedMarkerInMap] = useState([]);

    const [guideBasePoint, setGuideBasePoint] = useState({
         'startPointLat': null
         ,'startPointLon': null
         ,'endPointLat': null
         ,'endPointLon': null
         ,'midLat': null
         ,'midLon': null
    });

    // --------------------------------funtion--------------------------------

    const drawMarker=(lat, lon, size1, size2, icon, obj)=>{
        //console.log("drawMarker: ",lat, lon, size1, size2, icon, obj);
        const marker = new Tmapv2.Marker( //생성과 동시에 화면에 찍어짐
            {
                position : new Tmapv2.LatLng(lat, lon),
                icon : icon,
                iconSize : new Tmapv2.Size(size1, size2),
                map : guideMap
            });

        if(obj){
            marker.addListener("click", function(evt) {
                //alert("삥");
                clickMarker(marker, obj);
            });
        }
        //resultdrawArr.push(marker);
    }

    function clickMarker(marker, fac){

        const key = `${fac.type}_${fac.id}`;
        const coordinates = `${fac.latitude} ${fac.longitude}`;
        const type = fac.type;
        const addr = fac.addr;

        setSelectedMarkerInMap((prevMarkers) => {
            const index = prevMarkers.findIndex((item) => item.key === key);

            if (index !== -1) {
                // key 값이 존재하면 배열에서 제거
                const updatedMarkers = [...prevMarkers];
                updatedMarkers.splice(index, 1);
                return updatedMarkers;
            } else {
                // key 값이 존재하지 않으면 배열에 추가
                return [...prevMarkers, { key, coordinates, type, addr }];
            }
        });

        if (fac.type === 'C') {
            marker.setIcon(marker.getIcon() === cctv_b_icon
                ? cctv_c_icon : cctv_b_icon);
        }
        if (fac.type === 'D') {
            marker.setIcon(marker.getIcon() === delivery_b_icon
                ? delivery_c_icon : delivery_b_icon);
        }
        if (fac.type === 'E') {
            marker.setIcon(marker.getIcon() === emergbell_b_icon
                ? emergbell_c_icon : emergbell_b_icon);
        }
        if (fac.type === 'P') {
            marker.setIcon(marker.getIcon() === police_b_icon
                ? police_c_icon : police_b_icon);
        }
        if (fac.type === 'S') {
            marker.setIcon(marker.getIcon() === store_b_icon
                ? store_c_icon : store_b_icon);
        }
    }

    function drawLine(arrPoint,stopover) {
        var polyline_;
        const lineColor = stopover ==='Y'? '#DD0000':'#0000FF';

        polyline_ = new Tmapv2.Polyline({
            path : arrPoint,
            strokeColor : lineColor,
            strokeWeight : 6,
            map : guideMap
        });
        resultdrawArr.push(polyline_);
    }

    // --------------------------------API 호출---------------------------------
    //
    // 보행자 경로 API 호출
    async function callPedestrianAPI(stopover) {

        var headers = {};
        headers["appKey"]="FMHrfuOs4Z6qvFnNXfZsV2fiSbTQjiC241luv6PK";

        const data = { //(중요!!) 경도, 위도 순으로 넣어야 한다.
            "startX" : guideBasePoint.startPointLon,
            "startY" : guideBasePoint.startPointLat,
            "endX" : guideBasePoint.endPointLon,
            "endY" : guideBasePoint.endPointLat,
            "reqCoordType" : "WGS84GEO",
            "resCoordType" : "EPSG3857",
            "startName" : "출발지",
            "endName" : "도착지"
        }

        if(stopover === 'Y'){
            let passListStr='';

            for (const stopover of selectedMarkerInMap) {
                let coordinates = stopover.coordinates.split(" ");
                passListStr += `${coordinates[1]},${coordinates[0]}`;
                passListStr += '_';
            }
            passListStr = passListStr.slice(0, -1);

            console.log('passListStr',passListStr);
            data.passList = passListStr;
        }

        await fetch('https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result',{
            method:'POST',
            headers: headers,
            body: JSON.stringify(data)
        }).then((response) => response.json())
            .then((data)=>{ //API 호출 성공 시

                var resultData = data.features;

                //결과 출력
                var tDistance = "총 거리 : "
                    + ((resultData[0].properties.totalDistance) / 1000)
                        .toFixed(1) + "km,";
                var tTime = " 총 시간 : "
                    + ((resultData[0].properties.totalTime) / 60)
                        .toFixed(0) + "분";

                //result.innerText=tDistance + tTime;

                //기존 그려진 라인 & 마커가 있다면 초기화
                if (resultdrawArr.length > 0) {
                    for ( var i in resultdrawArr) {
                        resultdrawArr[i]
                            .setMap(null);
                    }
                    resultdrawArr = [];
                }

                drawInfoArr = [];

                for ( var i in resultData) { //for문 [S]
                    var geometry = resultData[i].geometry;
                    var properties = resultData[i].properties;
                    var polyline_;

                    if (geometry.type == "LineString") {
                        for ( var j in geometry.coordinates) {
                            // 경로들의 결과값(구간)들을 포인트 객체로 변환
                            var latlng = new Tmapv2.Point(
                                geometry.coordinates[j][0],
                                geometry.coordinates[j][1]);
                            // 포인트 객체를 받아 좌표값으로 변환
                            var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
                                latlng);
                            // 포인트객체의 정보로 좌표값 변환 객체로 저장
                            var convertChange = new Tmapv2.LatLng(
                                convertPoint._lat,
                                convertPoint._lng);
                            // 배열에 담기
                            drawInfoArr.push(convertChange);
                        }
                    } else {
                        var markerImg = "";
                        var pType = "";
                        var size;

                        if (properties.pointType == "S") { //출발지 마커
                        } else if (properties.pointType == "E") { //도착지 마커
                        } else { //각 포인트 마커
                            markerImg = "http://topopen.tmap.co.kr/imgs/point.png";
                            pType = "P";
                            size = new Tmapv2.Size(8, 8);
                        }

                        // 경로들의 결과값들을 포인트 객체로 변환
                        var latlon = new Tmapv2.Point(
                            geometry.coordinates[0],
                            geometry.coordinates[1]);

                        // 포인트 객체를 받아 좌표값으로 다시 변환
                        var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
                            latlon);

                        var routeInfoObj = {
                            markerImage : markerImg,
                            lng : convertPoint._lng,
                            lat : convertPoint._lat,
                            pointType : pType
                        };

                        // Marker 추가
                        new Tmapv2.Marker(
                        {
                            position : new Tmapv2.LatLng(
                                routeInfoObj.lat,
                                routeInfoObj.lng),
                            icon : routeInfoObj.markerImage,
                            iconSize : size,
                            map : guideMap
                        });
                    }
                }//for문 [E]
                drawLine(drawInfoArr,stopover);
            }).catch((error)=> {
                console.log("error = " + error);
            });

        //출발지 목적지 직선의 중심점 구하기
        guideBasePoint.midLat = (guideBasePoint.startPointLat + guideBasePoint.endPointLat) / 2.0;
        guideBasePoint.midLon = (guideBasePoint.startPointLon + guideBasePoint.endPointLon) / 2.0;

        console.log('midLat, midLon', guideBasePoint.midLat, guideBasePoint.midLon);

        //await guideMap.panTo(new Tmapv2.LatLng(guideBasePoint.midLat, guideBasePoint.midLon));
        guideMap.setCenter(new Tmapv2.LatLng(guideBasePoint.midLat, guideBasePoint.midLon));
        guideMap.zoomOut();

    } //callPedestrianAPI() END

    async function callOrderListFacInBoundary(facOptions){

        //facOptions는 안심객체 key 값을 가지고 있는 배열

        const queryString = {
            ...guideBasePoint,
            'selectedFacOption' : facOptions
        }

        console.log('queryString',queryString);

        //컨트롤러 호출
        await fetch('http://localhost:8080/guide/route',{
            method:'POST',
            headers: {"content-type":"application/json"},
            body: JSON.stringify(queryString)
        }).then((response) => response.json())
            .then((data)=>{
                console.log(" callOrderListFacInBoundary data: ",data);
                // data 배열의 각 요소에 대해 반복
                for (let i = 0; i < data.length; i++) {
                    // drawMarker 함수에 현재 요소 전달

                    let icon;
                    if(data[i].type==='C')  icon = cctv_b_icon;
                    if(data[i].type==='D')  icon = delivery_b_icon;
                    if(data[i].type==='E')  icon = emergbell_b_icon;
                    if(data[i].type==='P')  icon = police_b_icon;
                    if(data[i].type==='S')  icon = store_b_icon;

                    drawMarker(data[i].latitude, data[i].longitude, 25, 25, icon, data[i]);
                }
            }).catch((error)=> {
                console.log("error = " + error);
            });

    } // callOrderListFacInBoundary  END

    // ---------------------------------param----------------------------------

    const param = {
        'map' : guideMap
        ,'setGuideMap' : setGuideMap
        ,'guideBasePoint' : guideBasePoint
        ,'setGuideBasePoint' : setGuideBasePoint
        ,'Tmapv2' : Tmapv2
        ,'drawMarker' : drawMarker
        ,'callPedestrianAPI' : callPedestrianAPI
        ,'callOrderListFacInBoundary' : callOrderListFacInBoundary
        , 'selectedMarkerInMap' : selectedMarkerInMap
    }

    return (
        <>
            <GuideSidebar param={param}/>
            <GuideMap param={param}/>
        </>
    )
}
export default GuidePage;