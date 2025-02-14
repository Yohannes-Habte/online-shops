
import './AdminDashboardWithdraws.scss';
import AllShopsWithdraws from '../../../components/admin/allShopsWithdraws/AllShopsWithdraws';
import AdminHeader from '../../../components/admin/adminHeader/AdminHeader';
import AdminSidebar from '../../../components/layouts/adminSidebar/AdminSidebar';

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
