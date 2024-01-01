import React, { useEffect, useState } from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import GetCookie from "./GetCookie";
import axios from 'axios';

var stompClient =null;

const WebSocket = () => {
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab,setTab] =useState("CHATROOM");
    const [apply, setApply] = useState(false);
    const boardData =
        {
            userId: "jd8606",
            boardTitle: "동행구해요",
        };

    const [notification, setNotification] = useState(null);

    // 알림 메시지를 받았을 때 처리하는 함수
    const handleNotification = (Message) => {
        setNotification(Message);
    };

    useEffect(() => {
        connect();
    }, []);

    const userIdCookie = GetCookie("userid").split('@')[0];
    //console.log('userid 쿠키 값 (@ 앞 부분):', userIdCookie);

    const [userData, setUserData] = useState({
        username: userIdCookie,
        receivername: boardData.userId,
        connected: false,
        message: ''
    });

    const connect =()=>{
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock); //SockJS 연결을 STOMP 클라이언트로 래핑
        stompClient.connect({username: userIdCookie},onConnected, onError);
    }

    const onConnected = () => {
        setUserData({...userData,"connected": true});

        userJoin();
        stompClient.subscribe('/users/queue/message', (data) => {
            // const body = JSON.parse(data.body);
            // $('body').append(`전송자: ${body.sender}, 메시지: ${body.message}<br/>`);
            //console.log('topic wiki subscribe data - ', JSON.parse(data.body));
            const message = JSON.parse(data.body);
            // 메시지를 받았을 때 수행할 작업을 여기에 추가
            console.log('받은 메시지:', message);
        });
    }

    const userJoin=()=>{
        var Message = {
            senderName: userIdCookie,
            status:"JOIN"
        };
        stompClient.send("/app/join", {}, JSON.stringify(Message));
    }

    const onError = (err) => {
        console.log(err);
    }

    const handleMessage =(event)=>{
        const {value}=event.target;
        setUserData({...userData,"message": value});
    }

    const registerUser = () => {
        if (stompClient) {
            var Message = {
                senderName: userIdCookie,
                receiverName: boardData.userId,
                message: '동행 신청하였습니다!',
                status: 'MESSAGE'
            };
            console.log(Message);
            stompClient.send("/app/message", {}, JSON.stringify(Message));
            // 알림 메시지를 처리하는 함수 호출
            handleNotification(Message);

            // 동행 신청 완료 메시지를 표시하는 코드
            setNotification({
                senderName: userIdCookie,
                message: '동행 신청이 완료되었습니다!'
            });
        }
    };

    function showGreeting(message) {
        // 새로운 <tr> 요소를 생성하고 메시지를 추가합니다.
        var newRow = document.createElement("tr");
        var newCell = document.createElement("td");
        var textNode = document.createTextNode(message);
        newCell.appendChild(textNode);
        newRow.appendChild(newCell);

        // <table> 요소에 새로운 <tr> 요소를 추가합니다.
        document.getElementById("greetings").appendChild(newRow);
    }

    return (
        <div className="socket_container">
                <div className="register">
                    <div
                    > 유저ID: {userIdCookie} </div>
                    <div className="apply_btn" onClick={registerUser}>
                        동행 신청😊
                    </div>

                </div>

                <div className="connect">
                    <div className="col-md-12">
                        <table id="conversation" className="table table-striped">
                            <thead>
                            <tr>
                                <th>Message 주고받기 Check</th>
                            </tr>
                            </thead>
                            <tbody id="greetings">
                            </tbody>
                        </table>
                    </div>
                </div>
        </div>
        // <div>
        //     <div className="sendUsername"> 보낼 유저명: <input type="text" id="targetUsername"/></div>
        //     <div className="sendMessage">보낼 메시지: <textarea id="message"></textarea></div>
        //     <button id="sendBtn">전송</button>
        //     <br/>
        // </div>
    );
};

export default WebSocket;
