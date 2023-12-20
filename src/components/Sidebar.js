import React, {useContext} from "react";
import {DataContext} from "./DataProvider";
import '../page/MainPage/MainPage.css';
import { Link } from "react-router-dom";

const Sidebar = () => {
    const { handleMenuClick } = useContext(DataContext);

    return (
        
        <div id="sidebar">
            <h2>사이드바</h2>
            <ul>
                <li onClick={() => handleMenuClick('안심 길찾기')}>
                    <Link to="/info" style={{ textDecoration: "none" }}>안심 길찾기</Link>
                </li>
                <li onClick={() => handleMenuClick('안심 시설물')}>
                    <Link to="/info" style={{ textDecoration: "none" }}>안심 시설물</Link>
                </li>
                <li>
                    안심 동행
                </li>
            </ul>
        </div>
    );
}
export default Sidebar;