import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom'; // Import Outlet for nested routes
import Sidebar from '../component/sidebar/Sidebar'; // Import Sidebar component
import Overview from '../component/overview/Overview'; // Your Overview component
import Banners from '../component/banners/Banners'; // Your Banners component
import Categories from '../component/categories/Categories'; // Your Categories component
import Courses from '../component/courses/Courses'; // Your Courses component
import ManageUser from '../component/manage-user/ManageUser'; // Your ManageUser component
import Requests from '../component/requests/Requests'; // Your Requests component
import Transactions from '../component/transaction/Transactions'; // Your Transactions component
import styles from './AdminPage.module.css';
function AdminPage() {
  return (
    <div className={styles.adminPageContainer}>
      {/* Sidebar for navigation */}
      <Sidebar />
      
      {/* Main content area */}
      <div className={styles.mainContainer}>
        {/* Define Routes for each section */}
        <Routes>
          <Route path="overview" element={<Overview />} />
          <Route path="banners" element={<Banners />} />
          <Route path="categories" element={<Categories />} />
          <Route path="courses" element={<Courses />} />
          <Route path="manage-users" element={<ManageUser />} />
          <Route path="requests" element={<Requests />} />
          <Route path="transactions" element={<Transactions />} />
          
          {/* Placeholder for nested routes */}
          <Route path="/" element={<Overview />} /> {/* Default route */}
        </Routes>
        {/* Outlet for rendering the matched nested route */}
        <Outlet />
      </div>
    </div>
  );
}

export default AdminPage;
