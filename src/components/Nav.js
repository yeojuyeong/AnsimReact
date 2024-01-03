import React, {useContext} from "react";
import {DataContext} from "./DataProvider";
import '../css/MainPage.css';
import { NavLink } from "react-router-dom";
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
    const activeStyle = {
        color: "#6392ff",
    };

    return (
        
        <div id="sidebar">
            <h2>Ansim</h2>
            <ul>
                <li className="direction_icon">
                    <NavLink to="/guide"  style={({ isActive }) => (isActive ? activeStyle : {})}>
                        <TbMapSearch/>
                    </NavLink>
                </li>
                <li className="facility_icon">
                    <NavLink to="/info"  style={({ isActive }) => (isActive ? activeStyle : {})}>
                        <PiMapPinLineBold/>
                    </NavLink>
                </li>
                <li className="board_icon">
                    <NavLink to="/board"  style={({ isActive }) => (isActive ? activeStyle : {})}>
                        <BiEdit/>
                    </NavLink>
                </li>

                {jwtCookie && (
                    <>
                        <li className="mypage_icon">
                            <NavLink to="/mypage"  style={({ isActive }) => (isActive ? activeStyle : {})}>
                                <FiUser />
                            </NavLink>
                        </li>
                        <li className="logout_icon">
                            <NavLink onClick={logout} >
                                <FiLogOut />
                            </NavLink>
                        </li>
                    </>
                )}
                {!jwtCookie && (
                    <li className="login_icon">
                        <NavLink to="/Login"  style={({ isActive }) => (isActive ? activeStyle : {})}>
                            <FiLogIn />
                        </NavLink>
                    </li>
                )}
            </ul>
        </div>
    );
}
export default Nav;