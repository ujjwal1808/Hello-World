import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const [activeItem, setActiveItem] = useState('dashboard');
    // State for mobile sidebar collapse functionality
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  
    // Menu items data structure for easier management
    const menuItems = [
      {
        id: '#',
        name: 'Dashboard',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        )
      },
      {
        id: 'user-management',
        name: 'User Management',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        )
      },
      {
        id: 'post-content',
        name: 'Post and Content',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        )
      },
      {
        id: 'admin-profile',
        name: 'Admin Profile',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        )
      }
    ];
  
    // Handle item click
    const handleItemClick = (itemId) => {
      setActiveItem(itemId);
      // You could add navigation logic here using React Router
      // history.push(`/${itemId}`);
      
      // Close sidebar on mobile after selection
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };
  
    // Toggle sidebar visibility for mobile
    const toggleSidebar = () => {
      setSidebarCollapsed(!isSidebarCollapsed);
    };
  
    return (
      <div >
        {/* Mobile menu button */}
        <button 
          className="md:hidden fixed top-4 left-4 z-20 bg-white p-2 rounded-md shadow-md"
          onClick={toggleSidebar}
        >
          {isSidebarCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
  
        {/* Sidebar */}
        
        <div className={`w-64 h-screen  bg-white shadow-md transition-all duration-300 ease-in-out ${isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'} md:translate-x-0 fixed md:relative z-10`}>
          {/* Header */}
          <div className="p-4  flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">AdminPanel</h1>
            <button 
              className="text-gray-500 hover:text-gray-700 md:hidden"
              onClick={toggleSidebar}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="mt-2">
            {menuItems.map((item) => (
                <div onClick={(e) => {
                  e.preventDefault();
                  handleItemClick(item.id);
                }}>
                    
              <NavLink 
                key={item.id}
                to={`/${item.id}`} 
                className={`flex items-center px-4 py-3 ${
                  activeItem === item.id 
                    ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600' 
                    : 'text-gray-500 hover:bg-gray-50 border-l-4 border-transparent'
                }`}
                
              >
                <div className="mr-3">
                  {item.icon}
                </div>
                <span className="font-medium">{item.name}</span>
              </NavLink>
              </div>
            ))}
          </nav>
  
          {/* User info at bottom - optional */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">Logout</p>
              </div>
            </div>
          </div>
        </div>
  
        {/* Content area - shows active section */}
        
      </div>
    );
}

export default Sidebar