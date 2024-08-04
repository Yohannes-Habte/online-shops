import React from 'react';
import './UserOrderDetailsPage.scss';
import { useSelector } from 'react-redux';

import UserOrderDetails from '../../../components/cart/userOrderDetails/UserOrderDetails';
import Header from '../../../components/userLayout/header/Header';
import Footer from '../../../components/userLayout/footer/Footer';

const UserOrderDetailsPage = () => {
  // Global state variables
  const { currentUser } = useSelector((state) => state.user);

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
