import React from 'react';
import './AdminDashboardEvents.scss';
import AdminSidebar from '../../../components/admin/adminSidebar/AdminSidebar';
import AllShopsEvents from '../../../components/admin/allShopsEvents/AllShopsEvents';
import AdminHeader from '../../../components/admin/adminHeader/AdminHeader';

const AdminDashboardEvents = () => {
  return (
    <main className="admin-dashboard-events-page">
      <AdminHeader />
      <section className="admin-dashboard-events-page-container">
        <h1 className="admin-dashboard-events-page-title"> All Shops Events</h1>

        <div className="wrapper">
          <AdminSidebar />
          <AllShopsEvents />
        </div>
      </section>
    </main>
  );
};

export default AdminDashboardEvents;
