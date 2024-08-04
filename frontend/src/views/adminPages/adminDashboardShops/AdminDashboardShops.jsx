import React from 'react';
import './AdminDashboardShops.scss';
import AdminSidebar from '../../../components/admin/adminSidebar/AdminSidebar';
import AllShops from '../../../components/admin/allShops/AllShops';
import AdminHeader from '../../../components/admin/adminHeader/AdminHeader';

const AdminDashboardShops = () => {
  return (
    <main className="admin-dashboard-shops-page">
      <AdminHeader />
      <section className="admin-dashboard-shops-page-container">
        <h1 className="admin-dashboard-shops-page-title"> All Shops </h1>

        <div className="wrapper">
          <AdminSidebar />

          <AllShops />
        </div>
      </section>
    </main>
  );
};

export default AdminDashboardShops;
