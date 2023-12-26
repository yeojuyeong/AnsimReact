import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

function Room() {
    const [roomName, setRoomName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    const stompRef = useRef(null); // stomp 변수를 useRef를 사용하여 선언

    useEffect(() => {
        // WebSocket 연결
        if (!stompRef.current) { // 이미 연결이 열려 있지 않을 때만 연결을 열도록
            const sockJs = new SockJS("/stomp/chat");
            stompRef.current = Stomp.over(sockJs);

            stompRef.current.connect({}, () => {
                console.log("STOMP Connection");

                // 채팅 메시지 구독
                stompRef.current.subscribe("/sub/chat/room/" + roomId, (chat) => {
                    const content = JSON.parse(chat.body);
                    const writer = content.writer;
                    const message = content.message;

                    // 새 메시지를 메시지 목록에 추가
                    setMessages([...messages, { writer, message }]);
                });

                // 입장 메시지 전송
                stompRef.current.send('/pub/chat/enter', {}, JSON.stringify({ roomId, writer: username }));
            });
        }

        // 컴포넌트 언마운트 시 WebSocket 연결 닫기
        return () => {
            if (stompRef.current) {
                stompRef.current.disconnect();
                stompRef.current = null; // 연결 해제 후 null로 설정
            }
        };
    }, [roomId, username, messages]);

    // 메시지 전송
    const sendMessage = () => {
        if (message.trim() === '') return;

        // 메시지 전송
        stompRef.current.send('/pub/chat/message', {}, JSON.stringify({ roomId, message, writer: username }));

        // 메시지 입력 필드 초기화
        setMessage('');
    };

    return (
        <div className="container">
            {/* 이하 코드 생략 */}
        </div>
    );
}

export default Room;
