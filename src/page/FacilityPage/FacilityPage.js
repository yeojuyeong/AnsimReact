import InfoSidebar from "../../components/InfoSidebar";
import Map from '../../components/Map';
import DataProvider from '../../components/DataProvider';

const FacilityPage = ({selectedMenu, menuVisible}) => {
    
    return (
        <DataProvider>
            <InfoSidebar selectedMenu={selectedMenu} menuVisible={menuVisible}/>
            <Map />
        </DataProvider>
    )
}
export default FacilityPage;