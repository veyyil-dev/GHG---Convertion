"use client"; // ✅ Ensure it runs on the client side

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Login from "./(Auth)/login/page";

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

   
    

    if (!token) {
      router.push("/login"); // Redirect to login if no token
    } else {
      setIsAuthenticated(true); // Allow access
    }
  }, []);

  if (!isAuthenticated) {
    return <p>Redirecting...</p>; // Prevents flickering
  }

  return (<Login />); // Show dashboard when authenticated
}
