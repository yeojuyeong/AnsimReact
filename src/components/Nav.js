import React, {useContext} from "react";
import {DataContext} from "./DataProvider";
import '../page/MainPage/MainPage.css';
import { Link } from "react-router-dom";
import { TbMapSearch } from "react-icons/tb";
import { PiMapPinLineBold } from "react-icons/pi";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { BiEdit } from "react-icons/bi";
import {FiLogIn, FiUser} from "react-icons/fi";
import getCookie from './GetCookie';
import { IoNotificationsCircle } from "react-icons/io5";

const Nav = ({handleMenuClick}) => {

    const accessTokenCookie = getCookie('accessToken');

    return (
        
        <div id="sidebar">
            <h2>Ansim</h2>
            <ul>
                <li onClick={() => handleMenuClick('안심 귀갓길')} className="direction_icon">
                    <Link to="/guide" style={{textDecoration: "none"}}>
                        <TbMapSearch/>
                    </Link>
                </li>
                <li onClick={() => handleMenuClick('안심 시설물')} className="facility_icon">
                    <Link to="/info" style={{textDecoration: "none"}}>
                        <PiMapPinLineBold/>
                    </Link>
                </li>
                <li onClick={() => handleMenuClick('동행 게시판')} className="board_icon">
                    <Link to="/board" style={{textDecoration: "none"}}>
                        <BiEdit/>
                    </Link>
                </li>
                {accessTokenCookie ? (
                    <li onClick={() => handleMenuClick('마이페이지')} className="mypage_icon">
                        <Link to="/mypage" style={{textDecoration: "none"}}>
                            <FiUser/>
                        </Link>
                    </li>
                ) : (
                    <li onClick={() => handleMenuClick('로그인')} className="mypage_icon">
                        <Link to="/Login" style={{textDecoration: "none"}}>
                            <FiLogIn/>
                        </Link>
                    </li>
                )}
                <li className="notification_div">
                    <div className="notification_icon">
                    <IoNotificationsCircle /> </div>
                    <div className="counter">2</div>
                </li>
            </ul>
        </div>
    );
}
export default Nav;