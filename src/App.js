import './App.css';
import {Route, Routes} from "react-router-dom";
import Layout from './components/Layout';
import Nav from './components/Nav';
import MainPage from "./page/MainPage/MainPage";
import FacilityPage from "./page/FacilityPage/FacilityPage";
import BoardPage from "./page/BoardPage/BoardPage";
import MyPage from "./page/MyPage/MyPage";
import GuidePage from "./page/GuidePage/GuidePage";
import React, { createContext, useState, useEffect } from 'react';

function App() {
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const handleMenuClick = (menu) => {
        // 현재 선택한 메뉴와 클릭한 메뉴가 같은 경우 닫기.
        if (selectedMenu === menu && menuVisible) {
            setSelectedMenu(null);
            setMenuVisible(false);
        } else {
            setSelectedMenu(menu);
            setMenuVisible(true);

        }
    };

  return (
        <>
          <Layout>
              <Nav handleMenuClick={handleMenuClick}/>
              <Routes>
                  <Route path="/" element={<MainPage />} />
                  <Route path="/guide" element={<GuidePage selectedMenu={selectedMenu} menuVisible={menuVisible}/>} />
                  <Route path="/info" element={<FacilityPage selectedMenu={selectedMenu} menuVisible={menuVisible} />} />
                  <Route path="/board" element={<BoardPage />} />
                  <Route path="/mypage" element={<MyPage />} />
              </Routes>
          </Layout>
        </>
  );
}

export default App;
