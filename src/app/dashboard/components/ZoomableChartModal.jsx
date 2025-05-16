"use client"

import React, { useState, useRef } from 'react';
import { Modal } from "antd";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const ZoomableChartModal = ({ isOpen, onClose, title, data, dataKey, chartColor }) => {
  const chartRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleWheel = (e) => {
    const scaleAmount = 0.1;
    setZoom((prev) => (e.deltaY < 0 ? Math.min(prev + scaleAmount, 3) : Math.max(prev - scaleAmount, 1)));
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - translate.x, y: e.clientY - translate.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setTranslate({ x: e.clientX - startPos.x, y: e.clientY - translate.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <Modal title={title} open={isOpen} onCancel={onClose} footer={null} width={1000}>
      <div
        className="w-full overflow-x-auto cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={chartRef}
        style={{ transform: `scale(${zoom}) translate(${translate.x}px, ${translate.y}px)`, transition: "transform 0.2s ease" }}
      >
        <div className="w-[1600px] h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`colorModal${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey={dataKey} stroke={chartColor} fill={`url(#colorModal${dataKey})`} strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Modal>
  );
};

export default ZoomableChartModal;