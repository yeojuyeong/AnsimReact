import React, {useContext} from "react";
import {DataContext} from "./DataProvider";
import '../css/MainPage.css';
import { Link } from "react-router-dom";
import { TbMapSearch } from "react-icons/tb";
import { PiMapPinLineBold } from "react-icons/pi";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { BiEdit } from "react-icons/bi";
import {FiLogIn, FiLogOut, FiUser} from "react-icons/fi";
import getCookie from './GetCookie';
import { IoNotificationsCircle } from "react-icons/io5";

const Nav = () => {

    const useridCookie = getCookie('userid');
    const jwtCookie = getCookie('jwt');

    const logout = () => {

        document.cookie = 'userid=' + useridCookie  + ';path=/; max-age=0';
        document.cookie = 'jwt=' + jwtCookie + ';path=/; max-age=0';
        document.location.href="/guide";

    }

    return (
        
        <div id="sidebar">
            <h2>Ansim</h2>
            <ul>
                <li className="direction_icon">
                    <Link to="/guide" style={{textDecoration: "none"}}>
                        <TbMapSearch/>
                    </Link>
                </li>
                <li className="facility_icon">
                    <Link to="/info" style={{textDecoration: "none"}}>
                        <PiMapPinLineBold/>
                    </Link>
                </li>
                <li className="board_icon">
                    <Link to="/board" style={{textDecoration: "none"}}>
                        <BiEdit/>
                    </Link>
                </li>

                {jwtCookie && (
                    <>
                        <li className="mypage_icon">
                            <Link to="/mypage" style={{ textDecoration: "none" }}>
                                <FiUser />
                            </Link>
                        </li>
                        <li className="logout_icon">
                            <Link onClick={logout} style={{ textDecoration: "none" }}>
                                <FiLogOut />
                            </Link>
                        </li>
                    </>
                )}

                {!jwtCookie && (
                    <li className="login_icon">
                        <Link to="/Login" style={{ textDecoration: "none" }}>
                            <FiLogIn />
                        </Link>
                    </li>
                )}
                <li className="notification_div">
                    <div className="notification_icon">
                        <IoNotificationsCircle/></div>
                    <div className="counter">2</div>
                </li>
            </ul>
        </div>
    );
}
export default Nav;