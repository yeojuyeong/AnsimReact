import './App.css';
import {Route, Routes} from "react-router-dom";
import Main from "./page/MainPage/Main";
// import SafeGuide from "./components/SafeGuide";
import InfoFacility from "./components/InfoFacility";
// import SafeCommunity from "./components/SafeCommunity";

function App() {
  return (
    <>
      <Routes>
          <Route path="/map" element={<Main />}>
              {/*<Route path="/quide" element={<SafeGuide />} />*/}
              <Route path="/info" element={<InfoFacility />} />
              {/*<Route path="/board" element={<SafeCommunity />} />*/}
          </Route>
          {/*<Route path="/login" element={<Login />} />*/}
          {/*<Route path="/signup" element={<Signup />} />*/}
      </Routes>
    </>
  );
}

export default App;
