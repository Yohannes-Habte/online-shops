
import './AdminDashboardPage.scss';
import AdminDashboardOverview from '../../../components/admin/adminDashboardOverview/AdminDashboardOverview';
import AdminHeader from '../../../components/admin/adminHeader/AdminHeader';
import AdminSidebar from '../../../components/layouts/adminSidebar/AdminSidebar';

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
