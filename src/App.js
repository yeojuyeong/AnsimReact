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
import Signup from "./page/SignupPage/Signup";
import Footer from "./components/Footer";
import WebSocket from "./components/WebSocket";
// import Socket from "./components/Socket";
import React, { createContext, useState, useEffect } from 'react';
import MyPageModify from "./page/MyPage/MyPageModify";
import PasswordModify from "./page/MyPage/PasswordModify";

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
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/myPageModify" element={<MyPageModify />} />
                  <Route path="/passwordModify" element={<PasswordModify />} />
                  <Route path="/ws" element={<WebSocket />} />
                  {/*<Route path="/ws" element={<Socket />} />*/}
              </Routes>
          </Layout>
        </>
  );
}

export default App;
