import React from 'react';
import './AdminDashboardPage.scss';
import AdminSidebar from '../../../components/admin/adminSidebar/AdminSidebar';
import AdminDashboardOverview from '../../../components/admin/adminDashboardOverview/AdminDashboardOverview';
import AdminHeader from '../../../components/admin/adminHeader/AdminHeader';

const AdminDashboardPage = () => {
  return (
    <main className="admin-dashboard-page">
      <AdminHeader />
      <section className="admin-dashboard-page-container">
        <h1 className="admin-dashboard-page-title">Admin Dashboard Overview</h1>
        <div className="wrapper">
          <AdminSidebar />
          <AdminDashboardOverview />
        </div>
      </section>
    </main>
  );
};

export default AdminDashboardPage;
