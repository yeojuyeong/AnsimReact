import './App.css';
import {Route, Routes} from "react-router-dom";
import Layout from './components/Layout';
import Nav from './components/Nav';
import Main from "./page/MainPage/Main";
import FacilityPage from "./page/FacilityPage/FacilityPage";
import Board from "./page/BoardPage/Board";
import MyPage from "./page/MyPage/MyPage";
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
                  <Route path="/" element={<Main />} />
                  <Route path="/info" element={<FacilityPage selectedMenu={selectedMenu} menuVisible={menuVisible} />} />
                  <Route path="/board" element={<Board />} />
                  <Route path="/mypage" element={<MyPage />} />
              </Routes>
          </Layout>
        </>
  );
}

export default App;
