import { Link } from "react-router-dom";
import {useEffect, useState} from "react";
import ChatContainer from '../../components/ChatContainer';

const MyPage = () => {
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("/test")
            .then((response) => response.json())
            .then((json) => setMessage(json.SUCCESS_TEXT));
    }, []);
    
    return (
        <div>
            <Link to="/mychat">
                <button>채팅방 목록</button>
                {message}
                <ChatContainer/>
            </Link>
        </div>
    )
}
export default MyPage;