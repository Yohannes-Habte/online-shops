import React from 'react';
import "./ShopWithdrawMoney.scss"
import HeaderDashboard from '../../../components/shopDashboard/headerDashboard/HeaderDashboard';
import SidebarDashboard from '../../../components/shopDashboard/sidebarDashboard/SidebarDashboard';
import WithdrawMoney from '../../../components/shop/withdrawMoney/WithDrawMoney';

const ShopWithdrawMoney = () => {
  return (
    <main className='shop-withdraw-money-page'>
      <HeaderDashboard />
      <section className='shop-withdraw-money-container'>
        <SidebarDashboard />
        <WithdrawMoney />
      </section>
    </main>
  );
};

export default ShopWithdrawMoney;
