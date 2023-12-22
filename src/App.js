import './App.css';
import {Route, Routes} from "react-router-dom";
import DataProvider from './components/DataProvider';
import Layout from './components/Layout';
import Nav from './components/Nav';
import Main from "./page/MainPage/Main";
import FacilityPage from "./page/FacilityPage/FacilityPage";
import Board from "./page/BoardPage/Board";
import MyPage from "./page/MyPage/MyPage";
import React, { createContext, useState, useEffect } from 'react';

function App() {

  return (
      <DataProvider>
          <Layout>
              <Nav />
              <Routes>
                  <Route path="/" element={<Main />} />
                  <Route path="/info" element={<FacilityPage />} />
                  <Route path="/board" element={<Board />} />
                  <Route path="/mypage" element={<MyPage />} />
              </Routes>
          </Layout>
      </DataProvider>
  );
}

export default App;
