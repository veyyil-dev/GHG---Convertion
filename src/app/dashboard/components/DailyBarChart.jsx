"use client"
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const DailyBarChart = ({ data, selectedShift }) => {
  const filteredData = data.filter((item) => selectedShift === "both" || item.shift === (selectedShift === "shift1" ? 1 : 2));

  return (
    <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Daily Goods Produced vs CO₂ Emitted</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={filteredData}>
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
                    <p className="text-sm">{`Goods Produced: ${payload[0]?.value}`}</p>
                    <p className="text-sm">{`CO₂ Emitted: ${payload[1]?.value || 0}`}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar dataKey="goodsProduced" fill="#7625F5" name="Goods Produced" />
          <Bar dataKey="co2Emitted" fill="#EF4444" name="CO₂ Emitted" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyBarChart;