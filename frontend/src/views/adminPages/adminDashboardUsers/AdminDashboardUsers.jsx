import React from 'react';
import './AdminDashboardUsers.scss';
import AdminSidebar from '../../../components/admin/adminSidebar/AdminSidebar';
import AllShopsUsers from '../../../components/admin/allShopsUsers/AllShopsUsers';
import AdminHeader from '../../../components/admin/adminHeader/AdminHeader';

const AdminDashboardUsers = () => {
  return (
    <main className="admin-dashboard-users-page">
      <AdminHeader />
      <section className="admin-dashboard-users-page-container">
        <h1 className="admin-dashboard-users-page-title"> All Users </h1>

        <div className="wrapper">
          <AdminSidebar />

          <AllShopsUsers />
        </div>
      </section>
    </main>
  );
};

export default AdminDashboardUsers;
