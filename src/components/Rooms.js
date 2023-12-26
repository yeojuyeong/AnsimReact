import React, { useEffect, useState } from 'react';
import axios from "axios";

function Rooms() {
    const [roomName, setRoomName] = useState('');
    const [list, setList] = useState([]);
    const [newRoomName, setNewRoomName] = useState('');

    // useEffect(() => {
    //     // 초기 렌더링 시 방 목록을 가져옴
    //     findAllRoom();
    // }, []);


    const createRoom = () => {
        if (!newRoomName) {
            alert('방 이름을 입력하세요.');
            return;
        }

        axios.post('/chat/room', { name: newRoomName })
            .then((response) => {
                const newRoomName = response.data; // 새로운 채팅방의 이름을 받음
                alert(newRoomName + "방 개설에 성공하였습니다.");
                console.log(newRoomName);

                // // 채팅방을 생성한 후에 새로운 방 목록을 다시 가져옴
                // findAllRoom();
            })
            .catch((error) => {
                alert("채팅방 개설에 실패하였습니다.");
            });
    };

    // const findAllRoom = () => {
    //     axios.get('/chat/rooms')
    //         .then((response) => {
    //             setList(response.data);
    //         })
    //         .catch((error) => {
    //             console.error("방 목록을 가져오는데 실패하였습니다.", error);
    //         });
    // };

    return (
        <div className="container">
            <div>
                <ul>
                    {list.map((room) => (
                        <li key={room.roomId}>
                            <a href={`/chat/room?roomId=${room.roomId}`}>{room.name}</a>
                        </li>
                    ))}
                </ul>
            </div>
            <form>
                <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                />
                <button className="btn btn-secondary" onClick={createRoom}>
                    개설하기
                </button>
            </form>
        </div>
    );
}

export default Rooms;
