import React, { useState } from 'react';
import { Bell, Search, Menu, User } from 'lucide-react';

const Header = ({ toggleMobileSidebar, title }) => {
  const [searchValue, setSearchValue] = useState('');
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleMobileSidebar}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none lg:hidden"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 ml-2 lg:ml-0">{title}</h1>
          </div>

          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none">
              <Bell size={20} />
            </button>
            <div className="border-l border-gray-300 h-6 mx-2"></div>
            <div className="flex items-center">
              <button className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User size={18} />
                </div>
                <span className="hidden md:inline-block">Admin User</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;