import { useState, useContext, useEffect } from "react";
import {DataContext} from "./DataProvider";
import InfoCard from "./InfoCard";

const GuideBar =()=>{
    const {menuVisible, selectedMenu} = useContext(DataContext);

    return (
        <div id="sidebar_menu" className={menuVisible ? 'open' : 'closed'}>
            {selectedMenu === '안심 길찾기' && (<div id="info">안심길찾기페이지입니다.</div>)}
        </div>
    );
}
export default GuideBar;