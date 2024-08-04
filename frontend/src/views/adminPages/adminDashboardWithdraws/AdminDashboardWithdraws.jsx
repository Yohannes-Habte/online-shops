import React from 'react';
import './AdminDashboardWithdraws.scss';
import AdminSidebar from '../../../components/admin/adminSidebar/AdminSidebar';
import AllShopsWithdraws from '../../../components/admin/allShopsWithdraws/AllShopsWithdraws';
import AdminHeader from '../../../components/admin/adminHeader/AdminHeader';

const AdminDashboardWithdraws = () => {
  return (
    <main className="admin-dashboard-withdraws-page">
      <AdminHeader />
      <section className="admin-dashboard-withdraws-page-container">
        <h1 className="admin-dashboard-withdraws-page-title">
          Shops Withdraws
        </h1>

        <div className="wrapper">
          <AdminSidebar />

          <AllShopsWithdraws />
        </div>
      </section>
    </main>
  );
};

export default AdminDashboardWithdraws;
