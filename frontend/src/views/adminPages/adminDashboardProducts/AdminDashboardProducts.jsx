
import './AdminDashboardProducts.scss';

import AllShopsProducts from '../../../components/admin/allShopsProducts/AllShopsProducts';
import AdminHeader from '../../../components/admin/adminHeader/AdminHeader';
import AdminSidebar from '../../../components/layouts/adminSidebar/AdminSidebar';

const AdminDashboardProducts = () => {
  return (
    <main className="admin-dashboard-products-page">
      <AdminHeader />
      <section className="admin-dashboard-products-page-container">
        <h1 className="admin-dashboard-products-page-title">Shops Products</h1>

        <div className="wrapper">
          <AdminSidebar />

          <AllShopsProducts />
        </div>
      </section>
    </main>
  );
};

export default AdminDashboardProducts;
