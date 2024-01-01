import InfoSidebar from "../../components/InfoSidebar";
import InfoMap from '../../components/InfoMap';
import DataProvider from '../../components/DataProvider';
import SafetyFacilityReportForm from "../../components/SafetyFacilityReportForm";
import React, { createContext, useState, useEffect } from 'react';

const InfoPage = () => {

    //SafetyFacilityReportForm 컴포넌트 안 보이게 하기 위해서
    const [showReportForm, setShowReportForm] = useState(false);
    
    return (
        <DataProvider>
            <InfoSidebar />
            <InfoMap />
            <SafetyFacilityReportForm />
        </DataProvider>
    )
}
export default InfoPage;