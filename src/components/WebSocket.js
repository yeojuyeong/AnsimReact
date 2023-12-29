import React, { useEffect, useState } from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import { Cookies } from "react-cookie";

var stompClient =null;

const WebSocket = () => {
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab,setTab] =useState("CHATROOM");
    useEffect(() => {
        connect();
    }, []);

    const cookies = new Cookies();
    function setRefreshTokenToCookie(refresh_token) {
        cookies.set('refresh_token', refresh_token, { sameSite: 'strict' });
    }
    console.log(cookies);

    const jwtToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXNzd29yZCI6IjEyMzRxd2VyIiwidXNlcl9pZCI6InVuaXZlcnNlIiwiaWF0IjoxNzAzNzQ0MDYyLCJleHAiOjE3MDM4MzA0NjJ9.HfNt-ZzLCvKji5PP_JEke1q9lm6V3tOPDSxCbzXPyQI';
    const receiverjwtToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXNzd29yZCI6IjEyMzRxd2VyIiwidXNlcl9pZCI6Imp1ZGl0aCIsImlhdCI6MTcwMzc0NjE5NCwiZXhwIjoxNzAzODMyNTk0fQ.QvMtCXj97VTx9BoU-vPoqgaCdqpaFptDPiJBy0aR1Sw'
    // JWT 토큰을 "." 문자로 분리
    const tokenParts = jwtToken.split('.');
    const tokenParts2 = receiverjwtToken.split('.');

    // 각 부분을 Base64 디코딩
    const header = JSON.parse(atob(tokenParts[0]));
    const payload = JSON.parse(atob(tokenParts[1]));
    const receiverpayload = JSON.parse(atob(tokenParts2[1]));

    const [userData, setUserData] = useState({
        username: payload.user_id,
        receivername: receiverpayload.user_id,
        connected: false,
        message: ''
    });
    console.log('Payload.user_id:', payload.user_id);
    console.log('Payload2.user_id:', receiverpayload.user_id);
    const connect =()=>{
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock);
        stompClient.connect({},onConnected, onError);
    }

    const onConnected = () => {
        setUserData({...userData,"connected": true});
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage);
        userJoin();
    }

    const userJoin=()=>{
        var chatMessage = {
            senderName: userData.username,
            status:"JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onMessageReceived = (payload)=>{
        var payloadData = JSON.parse(payload.body);
        switch(payloadData.status){
            case "JOIN":
                if(!privateChats.get(payloadData.senderName)){
                    privateChats.set(payloadData.senderName,[]);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
        }
    }

    const onPrivateMessage = (payload)=>{
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        if(privateChats.get(payloadData.senderName)){
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        }else{
            let list =[];
            list.push(payloadData);
            privateChats.set(payloadData.senderName,list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onError = (err) => {
        console.log(err);
    }

    const handleMessage =(event)=>{
        const {value}=event.target;
        setUserData({...userData,"message": value});
    }
    const sendValue=()=>{
        if (stompClient) {
            var chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status:"MESSAGE"
            };
            console.log(chatMessage);
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({...userData,"message": ""});
        }
    }

    const sendPrivateValue=()=>{
        if (stompClient) {
            var chatMessage = {
                senderName: userData.username,
                receiverName: receiverpayload.user_id,
                message: userData.message,
                status:"MESSAGE"
            };

            if(userData.username !== tab){
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            setUserData({...userData,"message": ""});
        }
    }

    const registerUser=()=>{
        if (stompClient) {
            var chatMessage = {
                senderName: userData.username,
                receiverName: userData.receivername,
                message: '동행 신청하였습니다!',
                status: 'MESSAGE'
            };
            console.log(chatMessage);
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
        }
    }
    return (
        <div className="container">
                <div className="register">
                    <div
                        id="user-name"
                        placeholder="Enter your name"
                        name="userName"
                        margin="normal"
                    > 유저ID: {payload.user_id} </div>
                    <button type="button" onClick={registerUser}>
                        동행 신청
                    </button>
                </div>
        </div>
    );
};

export default WebSocket;
