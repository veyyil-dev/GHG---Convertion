"use client";
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Users, UserPlus, User, Settings, X } from 'lucide-react';

const Sidebar = ({ isMobileOpen, toggleMobileSidebar }) => {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: '/dashboard', label: 'dashboard', icon: <Users size={20} /> },
    { href: '/Userprofile', label: 'UserProfile', icon: <Users size={20} /> },
    { href: '/Userprofile/Adduser', label: 'Add User', icon: <UserPlus size={20} /> },
    { href: '/Userprofile/Myprofile', label: 'My Profile', icon: <User size={20} /> },
    { href: '/Userprofile/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const handleNavigation = (href) => {
    router.replace(href); // Replaces the current route
    if (isMobileOpen) toggleMobileSidebar(); // Close sidebar on mobile
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:w-64 lg:shrink-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 w-8 h-8 rounded-md flex items-center justify-center">
              <Users className="text-white" size={18} />
            </div>
            <h1 className="text-xl font-semibold text-gray-800">User Manager</h1>
          </div>
          <button
            className="p-1 rounded-md text-gray-500 hover:bg-gray-100 lg:hidden"
            onClick={toggleMobileSidebar}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <button
                key={link.href}
                onClick={() => handleNavigation(link.href)}
                className={`w-full text-left flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700'
                }`}
              >
                <span className="mr-3">{link.icon}</span>
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
