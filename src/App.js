import './App.css';
import {Route, Routes} from "react-router-dom";
import Main from "./page/MainPage/Main";
// import SafeGuide from "./components/SafeGuide";
import FacilityPage from "./page/FacilityPage/FacilityPage";
// import SafeCommunity from "./components/SafeCommunity";

function App() {
  return (
    <>
      <Routes>
          <Route path="/" element={<Main />}>
              {/*<Route path="/quide" element={<SafeGuide />} />*/}
              <Route path="/info" element={<FacilityPage />} />
              {/*<Route path="/board" element={<SafeCommunity />} />*/}
              {/*<Route path="/login" element={<Login />} />*/}
              {/*<Route path="/signup" element={<Signup />} />*/}
          </Route>
      </Routes>
    </>
  );
}

export default App;
