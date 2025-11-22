import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple navigation for now */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl">🏥</span>
              <span className="ml-2 text-xl font-bold text-gray-800">Hospital DBMS</span>
            </div>
            <div className="flex space-x-4">
              <a href="/" className="text-gray-600 hover:text-blue-600">Home</a>
              <a href="/login" className="text-gray-600 hover:text-blue-600">Logout</a>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;