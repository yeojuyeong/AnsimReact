import { Link } from "react-router-dom";
import {Fragment, useEffect, useState} from "react";
import ChatContainer from '../../components/ChatContainer';

const MyPage = () => {
    
    return (
        <div>
            <Link to="/mychat">
                <button>채팅방 목록</button>
            </Link>
        </div>
    )
}
export default MyPage;