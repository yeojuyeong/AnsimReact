import './MainPage.css';
import DataProvider from "../../components/DataProvider";
import Layout from '../../components/Layout';
import Sidebar from "../../components/Sidebar";
import InfoFacility from "../../components/InfoFacility";
import Map from '../../components/Map';

const Main = () => {
    return (
        <DataProvider>
            <Layout>
                <Sidebar1 />
                <InfoFacility />
                <Sidebar />
                <InfoFacility />
                <Map />
            </Layout>
        </DataProvider>
    )
}
export default Main;