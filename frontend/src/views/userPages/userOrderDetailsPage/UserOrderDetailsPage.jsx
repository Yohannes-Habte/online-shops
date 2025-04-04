import "./UserOrderDetailsPage.scss";
import Header from "../../../components/layouts/header/Header";
import Footer from "../../../components/layouts/footer/Footer";
import UserOrderDetails from "../../../components/user/userOrderDetails/UserOrderDetails";


const UserOrderDetailsPage = () => {
  return (
    <main className="user-order-details-page">
      <Header />
      <section className="user-order-details-page-container">
        <h1 className="user-order-details-page-title">User Order Details</h1>
        <UserOrderDetails />
      </section>
      <Footer />
    </main>
  );
};

export default UserOrderDetailsPage;
