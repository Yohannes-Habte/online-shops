
import './PaymentPage.scss';
import PaymentMethod from '../../../components/payment/paymentMethod/PaymentMethod';
import Header from '../../../components/layouts/header/Header';
import Footer from '../../../components/layouts/footer/Footer';

const PaymentPage = () => {
  return (
    <main className="payment-page">
      <Header />
      <section className="payment-page-container">
        <h1 className="payment-page-title"> Payment Methods</h1>
        <PaymentMethod />
      </section>
      <Footer />
    </main>
  );
};

export default PaymentPage;
