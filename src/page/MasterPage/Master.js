import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

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
                pastWeek.reverse().forEach(date => {
                    newData[date] = data['7days_report'].find(d => d.date === date) || {date, count: 0};
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
        {name: 'Delivery Box', delibox_report: data['delibox_report']}
    ];

    return (
        <div>
            <LineChart
                width={500}
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
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>

            <BarChart
                width={500}
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
                <Bar dataKey="emerg_report" fill="#8884d8" />
                <Bar dataKey="delibox_report" fill="red" />
            </BarChart>
        </div>
    );
}

export default Master;