import "./Home.scss";
import FeaturedProducts from "../../components/products/featuredProducts/FeaturedProducts";
import BestDealProducts from "../../components/products/bestDealProducts/BestDealProducts";
import Events from "../../components/events/events/Events";
import Header from "../../components/userLayout/header/Header";
import Footer from "../../components/userLayout/footer/Footer";
import Hero from "../../components/heroSection/Hero";
import ServiceInformation from "../../components/serviceInfo/ServiceInformation";

const Home = () => {
  return (
    <main className="home-page">
      <Header />
      <section className="home-page-container">
        <Hero />

        <ServiceInformation />

        <BestDealProducts />

        <Events />

        <FeaturedProducts />
      </section>

      <Footer />
    </main>
  );
};

export default Home;
