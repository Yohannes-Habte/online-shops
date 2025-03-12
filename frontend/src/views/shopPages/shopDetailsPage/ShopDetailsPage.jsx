
import './ShopDetailsPage.scss';
import ShopBiodata from '../../../components/shop/shopProfile/ShopProfile';
import ShopInfo from '../../../components/shop/shopInventory/ShopInventory';
import { Link } from 'react-router-dom';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import Footer from '../../../components/layouts/footer/Footer';


const ShopDetailsPage = () => {
  return (
    <main className="shop-detials-page">
       <Link to="/" className="go-back-link">
              <FaArrowAltCircleLeft /> Home
            </Link>
      <section className="shop-details-container">
        <ShopBiodata isOwner={false} />

        <ShopInfo isOwner={false} />
      </section>
      <Footer />
    </main>
  );
};

export default ShopDetailsPage;
