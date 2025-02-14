
import './TrackOrderPage.scss';
import TrackOrder from '../../../components/user/trackOrder/TrackOrder';
import Header from '../../../components/layouts/header/Header';
import Footer from '../../../components/layouts/footer/Footer';



const TrackOrderPage = () => {
  return (
    <main className="track-order-page">
      <Header />
      <section className="track-order-page-container">
        <h1 className="track-order-title">Track Order</h1>
        <TrackOrder />
      </section>
      <Footer />
    </main>
  );
};

export default TrackOrderPage;
