import InfoSidebar from "../../components/InfoSidebar";
import InfoMap from '../../components/InfoMap';
import DataProvider from '../../components/DataProvider';
import SafetyFacilityReportForm from "../../components/SafetyFacilityReportForm";
import React, { createContext, useState, useEffect } from 'react';

const InfoPage = () => {
    
    return (
        <DataProvider>
            <InfoSidebar />
            <InfoMap />
            <SafetyFacilityReportForm />
        </DataProvider>
    )
}
export default InfoPage;