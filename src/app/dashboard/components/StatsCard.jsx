"use client"

import React from 'react';
import { Card, Statistic } from "antd";
import { motion } from "framer-motion";
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

const cardVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } } };
const chartVariants = { hidden: { scale: 0.8, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } } };

const StatsCard = ({ title, value, chartData, dataKey, chartColor, onClick }) => (
  <motion.div variants={cardVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
    <Card
      className="rounded-lg shadow-lg border-0 overflow-hidden cursor-pointer"
      style={{ background: "white", borderLeft: `10px solid ${chartColor}` }}
      onClick={onClick}
    >
      <div className="p-4 text-black">
        <h3 className="text-[25px] font-semibold mb-2">{title}</h3>
        <Statistic value={value} valueStyle={{ fontSize: "40px", fontWeight: "bold", color: "black" }} />
      </div>
      <motion.div className="h-20 ml-60" variants={chartVariants}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-2 rounded shadow-lg opacity-80 h-[80]">
                      <p className="text-sm mt-4 ml-2">{`${title}: ${payload[0].value}`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area type="monotone" dataKey={dataKey} stroke={chartColor} fill={`url(#color${dataKey})`} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </Card>
  </motion.div>
);

export default StatsCard;