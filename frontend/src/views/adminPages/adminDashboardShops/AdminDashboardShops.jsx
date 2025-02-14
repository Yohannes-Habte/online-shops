
import './AdminDashboardShops.scss';

import AllShops from '../../../components/admin/allShops/AllShops';
import AdminHeader from '../../../components/admin/adminHeader/AdminHeader';
import AdminSidebar from '../../../components/layouts/adminSidebar/AdminSidebar';

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
