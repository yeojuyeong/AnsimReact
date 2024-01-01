import React, { useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const Socket = () => {
    let stompClient = null;

    useEffect(() => {
        onSocket();

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, []);

    function onSocket() {
        const socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);

            stompClient.subscribe('/queue/private', function (greeting) {
                // 메세지 알람 띄우기 (예시: 사용자에 맞게 변경해야 함)
                alert(greeting.body.split('"')[3]);
            });
        });
    }

    // send 함수는 피드 작성 시 실행됨
    function send() {
        // 제일 최근에 써진 피드 가져오기
        fetch('http://localhost:8080/feeds')
            .then((response) => response.json())
            .then((data) => {
                const contents = data[0]['contents'];
                const username = data[0]['username'];

                stompClient.send('/pub/post', {}, JSON.stringify({'msg': `${username}님이 피드를 작성했습니다 - ${contents}`}));
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <div>
            <button onClick={send}>Send</button>
        </div>
    );
};

export default Socket;