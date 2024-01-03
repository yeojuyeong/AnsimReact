import './App.css';
import {Route, Routes} from "react-router-dom";
import Layout from './components/Layout';
import Nav from './components/Nav';
import MainPage from "./page/MainPage/MainPage";
import InfoPage from "./page/InfoPage/InfoPage";
import Board from "./page/BoardPage/Board";
import GuidePage from "./page/GuidePage/GuidePage";
import MyPage from "./page/MyPage/MyPage";
import Login from "./page/LoginPage/LoginPage";
import SignupPage from "./page/SignupPage/SignupPage";
import React, { createContext, useState, useEffect } from 'react';
import MyPageModify from "./page/MyPage/MyPageModify";
import PasswordModify from "./page/MyPage/PasswordModify";
import Introduce from "./components/Introduce";
import Master from "./page/MasterPage/Master";
function App() {

  return (
        <>
          <Layout>
              <Nav />
              <Routes>
                  <Route path="/" element={<MainPage />} />
                  <Route path="/guide" element={<GuidePage />} />
                  <Route path="/info" element={<InfoPage />} />
                  <Route path="/board/*" element={<Board />} />
                  <Route path="/mypage" element={<MyPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/myPageModify" element={<MyPageModify />} />
                  <Route path="/passwordModify" element={<PasswordModify />} />
                  <Route path="/introduce" element={<Introduce />} />
                  <Route path="/master" element={<Master />} />
              </Routes>
          </Layout>
        </>
  );
}

export default App;
