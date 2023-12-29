import React, {useContext} from "react";
import {DataContext} from "./DataProvider";
import '../css/MainPage.css';
import { Link } from "react-router-dom";
import { TbMapSearch } from "react-icons/tb";
import { PiMapPinLineBold } from "react-icons/pi";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { BiEdit } from "react-icons/bi";
import {FiLogIn, FiUser} from "react-icons/fi";
import getCookie from './GetCookie';

const Nav = () => {

    const ifCookie = getCookie('userid');

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

                {ifCookie &&
                    <li className="mypage_icon">
                        <Link to="/mypage" style={{textDecoration: "none"}}>
                            <FiUser/>
                        </Link>
                    </li>
                }
                {!ifCookie &&
                    <li className="mypage_icon">
                        <Link to="/Login" style={{textDecoration: "none"}}>
                            <FiLogIn/>
                        </Link>
                    </li>
                }
            </ul>
        </div>
    );
}
export default Nav;