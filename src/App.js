import './App.css';
import {Route, Routes} from "react-router-dom";
import DataProvider from './components/DataProvider';
import Layout from './components/Layout';
import Nav from './components/Nav';
import Main from "./page/MainPage/Main";
import FacilityPage from "./page/FacilityPage/FacilityPage";
import MyPage from "./page/MyPage/MyPage";

function App() {
  return (
      <DataProvider>
          <Layout>
              <Nav />
              <Routes>
                  <Route path="/" element={<Main />} />
                  <Route path="/info" element={<FacilityPage />} />
                  <Route path="/mypage" element={<MyPage />} />
              </Routes>
          </Layout>
      </DataProvider>
  );
}

export default App;
