import './MainPage.css';
import DataProvider from "../../components/DataProvider";
import Layout from '../../components/Layout';
import Sidebar from "../../components/Sidebar";
import FacilityPage from '../FacilityPage/FacilityPage';
// import TestMap from '../../components/TestMap';
const Main = () => {
    return (
        <DataProvider>
            <Layout>
                <Sidebar />
                <FacilityPage />
            </Layout>
        </DataProvider>
    )
}
export default Main;