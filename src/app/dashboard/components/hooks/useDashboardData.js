import { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';

const useDashboardData = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    // http://127.0.0.1:5000/api/dashboard/DashBoardData  --> new 
    try {
      const response = await fetch("https://ghg-conversion-factors-backend.vercel.app/api/DashBoardData", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const res = await response.json();
      const formattedData = Array.isArray(res)
        ? res.map((item) => ({
            date: item.date,
            goodsProduced: parseInt(item.goodsProduced, 10) || 0,
            co2Emitted: parseInt(item.co2Emitted, 10) || 0,
            scope1: parseInt(item.scope1, 10) || 0,
            scope2: parseInt(item.scope2, 10) || 0,
            shift: parseInt(item.shift, 10) || 0,
          }))
        : [];
      setData(formattedData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { data, isLoading, refetch: fetchDashboardData };
};

export default useDashboardData;