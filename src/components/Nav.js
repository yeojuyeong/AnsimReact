import React, {useContext} from "react";
import {DataContext} from "./DataProvider";
import '../page/MainPage/MainPage.css';
import { Link } from "react-router-dom";
import { TbMapSearch } from "react-icons/tb";
import { PiMapPinLineBold } from "react-icons/pi";
import { LiaUserFriendsSolid } from "react-icons/lia";

const Nav = () => {
    const { handleMenuClick } = useContext(DataContext);

    return (
        
        <div id="sidebar">
            <h2>Ansim</h2>
            <ul>
                <li className="direction_icon">
                    <TbMapSearch />
                </li>
                <li onClick={() => handleMenuClick('안심 시설물')} className="facility_icon">
                    <Link to="/info" style={{ textDecoration: "none" }}>
                        <PiMapPinLineBold />
                    </Link>
                </li>
                <li className="board_icon">
                    <LiaUserFriendsSolid />
                </li>
            </ul>
        </div>
    );
}
export default Nav;