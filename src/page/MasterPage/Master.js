import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import '../../css/MasterPage.css';


function Master() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('/restapi/master')
            .then(response => response.json())
            .then(data => {
                let newData = {};
                let pastWeek = Array.from({length: 7}, (v, i) => {
                    let d = new Date();
                    d.setDate(d.getDate() - i);
                    return d.toISOString().split('T')[0];
                });
                pastWeek.reverse().forEach(regdate => {
                    newData[regdate] = data['7days_report'].find(d => d.regdate === regdate) || {regdate, count: 0};
                });
                data['7days_report'] = Object.values(newData);
                setData(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    const colorScale = scaleOrdinal(schemeCategory10);

    const barData = [
        {name: 'CCTV', cctv_report: data['cctv_report']},
        {name: 'Emergency Bell', emerg_report: data['emergbell_report']},
        {name: 'Delivery Box', delibox_report: data['delibox_report']},
        {name: 'Police', police_report: data['police_report']},
        {name: 'Store', store_report: data['store_report']}
    ];

   // console.log("data",data);

    return (
        <div>
            <div className='chart_title'>지난 7일간 고장신고 현황</div>
            <LineChart
                width={900}
                height={300}
                data={data['7days_report']}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="regdate" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>

            <BarChart
                width={900}
                height={300}
                data={barData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cctv_report" fill="#82ca9d" />
                <Bar dataKey="emerg_report" fill="#0067a3" />
                <Bar dataKey="delibox_report" fill="red" />
                <Bar dataKey="police_report" fill="purple" />
                <Bar dataKey="store_report" fill="#c68a12" />
            </BarChart>

        </div>
    );
}

export default Master;