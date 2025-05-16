import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const CumulativeLineChart = ({ data, selectedShift }) => {
  const filteredData = data.filter((item) => selectedShift === "both" || item.shift === (selectedShift === "shift1" ? 1 : 2));

  const getCumulativeData = () => {
    const cumulativeMap = new Map();
    let cumulativeGoods = 0;
    let cumulativeCO2 = 0;

    filteredData.forEach((item) => {
      const key = `${item.date}-${item.shift}`;
      if (!cumulativeMap.has(key)) {
        cumulativeMap.set(key, { date: item.date, shift: item.shift, cumulativeGoods: 0, cumulativeCO2: 0 });
      }
      const record = cumulativeMap.get(key);
      cumulativeGoods += item.goodsProduced;
      cumulativeCO2 += item.co2Emitted;
      record.cumulativeGoods = cumulativeGoods;
      record.cumulativeCO2 = cumulativeCO2;
    });
    return Array.from(cumulativeMap.values());
  };

  const cumulativeData = getCumulativeData();

  return (
    <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Cumulative Goods Produced & CO₂ Emissions</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={cumulativeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 rounded shadow-lg opacity-90">
                    <p className="text-sm font-bold">{`Date: ${label}`}</p>
                    <p className="text-sm">{`Shift: ${payload[0]?.payload?.shift || "N/A"}`}</p>
                    <p className="text-sm">{`Cumulative Goods: ${payload[0]?.value}`}</p>
                    <p className="text-sm">{`Cumulative CO₂: ${payload[1]?.value || 0}`}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="cumulativeGoods" stroke="#7625F5" name="Cumulative Goods" strokeWidth={3} />
          <Line type="monotone" dataKey="cumulativeCO2" stroke="#EF4444" name="Cumulative CO₂" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CumulativeLineChart;