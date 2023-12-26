import './App.css';
import {Route, Routes} from "react-router-dom";
import DataProvider from './components/DataProvider';
import Layout from './components/Layout';
import Nav from './components/Nav';
import GuidePage from "./page/GuidePage/GuidePage";
import FacilityPage from "./page/FacilityPage/FacilityPage";

function App() {


  return (
      <DataProvider>
          <Layout>
              <Nav />
              <Routes>
                  <Route path="/guide" element={<GuidePage />} />
                  <Route path="/info" element={<FacilityPage />} />
              </Routes>
          </Layout>
      </DataProvider>
  );
}

export default App;
