import React, { useEffect, useState } from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import GetCookie from "./GetCookie";

var stompClient =null;

const WebSocket = () => {
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab,setTab] =useState("CHATROOM");
    /////////////////////////////////////////////////////////////////////////////////
    const [apply, setApply] = useState(false);
    const boardData =
        {
            userId: "jd8606",
            boardTitle: "동행구해요",
        };

    const [notification, setNotification] = useState(null);

    // 알림 메시지를 받았을 때 처리하는 함수
    const handleNotification = (message) => {
        setNotification(message);
    };

    var onlineUsers = [];

    const addNewUser = (recieverNm) => {
        if (!onlineUsers.some((user) => user.receivername === recieverNm)) {
            onlineUsers.push({ receiverName: recieverNm });
        }
    }
    const removeUser = (recieverNm) => {
        onlineUsers = onlineUsers.filter((user) => user.receivername !== recieverNm);
    };
    const getUser = (recieverNm) => {
        return onlineUsers.find((user) => user.receivername === recieverNm);
    };
    /////////////////////////////////////////////////////////////////////////////////////

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
        stompClient.connect({},onConnected, onError);
    }

    const onConnected = (recieverNm) => {
        setUserData({...userData,"connected": true});
        stompClient.subscribe('/apply/public', onMessageReceived);
        stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage);
        userJoin();

        addNewUser(recieverNm);
    }

    const userJoin=()=>{
        var Message = {
            senderName: userIdCookie,
            status:"JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(Message));
    }

    const onMessageReceived = (payload)=>{
        //var payloadData = JSON.parse(payload.body);
        switch(userIdCookie.status){
            case "JOIN":
                if(!privateChats.get(userIdCookie.senderName)){
                    privateChats.set(userIdCookie.senderName,[]);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(userIdCookie);
                setPublicChats([...publicChats]);
                break;
        }
    }

    const onPrivateMessage = (userIdCookie)=>{
        //console.log(userIdCookie);
        //var userIdCookie = JSON.parse(userIdCookie.body);
        if(privateChats.get(userIdCookie.senderName)){
            privateChats.get(userIdCookie.senderName).push(userIdCookie);
            setPrivateChats(new Map(privateChats));
        }else{
            let list =[];
            list.push(userIdCookie);
            privateChats.set(userIdCookie.senderName,list);
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
            var Message = {
                senderName: userIdCookie,
                receiverName: boardData.userId,
                message: '',
                status:"MESSAGE"
            };
            console.log(Message);
            stompClient.send("/app/message", {}, JSON.stringify(Message));
            setUserData({...userData,"message": ""});
        }
    }

    const sendPrivateValue=()=>{
        if (stompClient) {
            var Message = {
                senderName: userIdCookie,
                receiverName:boardData.userId,
                message: '',
                status:"MESSAGE"
            };

            if(userData.username !== tab){
                privateChats.get(tab).push(Message);
                setPrivateChats(new Map(privateChats));
            }
            // stompClient.send("/app/private-message", {}, JSON.stringify(Message));
            // setUserData({...userData,"message": ""});
            stompClient.send(`/app/${boardData.userId}/private-message`, {}, JSON.stringify(Message));
            setUserData({ ...userData, "message": "" });
        }
    }
    const registerUser=()=>{
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
        }
    }
    return (
        <div className="socket_container">
                <div className="register">
                    <div
                        id="user-name"
                        placeholder="Enter your name"
                        name="userName"
                        margin="normal"
                    > 유저ID: {userIdCookie} </div>
                    <div className="apply_btn" onClick={registerUser}>
                        동행 신청😊
                    </div>

                    {notification && (
                        <div className="notification">
                            {notification.senderName}님이 {notification.message}
                        </div>
                    )}

                </div>
        </div>
    );
};

export default WebSocket;
