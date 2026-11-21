import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const AppLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Navbar */}
      <Navbar
        toggleMobileSidebar={toggleMobileSidebar}
        isMobileOpen={isMobileOpen}
      />

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex">
        <Sidebar
          isMobileOpen={isMobileOpen}
          closeMobileSidebar={closeMobileSidebar}
        />

        {/* Content View Area */}
        <main className="flex-1 lg:pl-64 min-w-0 flex flex-col">
          <div className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
