import InfoSidebar from "../../components/InfoSidebar";
import InfoMap from '../../components/InfoMap';
import DataProvider from '../../components/DataProvider';

const InfoPage = () => {
    
    return (
        <DataProvider>
            <InfoSidebar />
            <InfoMap />
        </DataProvider>
    )
}
export default InfoPage;