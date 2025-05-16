'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '../../components/layout/sidebar';
import Header from "../../components/layout/Header"

export default function Layout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard':
        return 'User Management';
      case '/add-user':
        return 'Add New User';
      case '/profile':
        return 'My Profile';
      case '/data-entry':
        return 'Data Entry';
      case '/settings':
        return 'Settings';
      default:
        if (pathname.startsWith('/edituser/')) {
          return 'Edit User';
        }
        if (pathname.startsWith('/user/')) {
          return 'User Details';
        }
        return 'User Management';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isMobileOpen={isMobileOpen} 
        toggleMobileSidebar={toggleMobileSidebar} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          toggleMobileSidebar={toggleMobileSidebar} 
          title={getPageTitle()}
        />

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="container mx-auto">
            {children}
          </div>
        </main>

        <footer className="bg-white border-t border-gray-200 py-2 px-4 text-center text-sm text-gray-500">
          User Management System &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
