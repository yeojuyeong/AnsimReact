import './App.css';
import {Route, Routes} from "react-router-dom";
import DataProvider from './components/DataProvider';
import Layout from './components/Layout';
import Sidebar from './components/Sidebar';
import Main from "./page/MainPage/Main";
import FacilityPage from "./page/FacilityPage/FacilityPage";

function App() {
  return (
      <DataProvider>
          <Layout>
              <Sidebar />
              <Routes>
                  <Route path="/" element={<Main />} />
                  <Route path="/info" element={<FacilityPage />} />
              </Routes>
          </Layout>
      </DataProvider>
  );
}

export default App;
