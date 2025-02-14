import "./Home.scss";
import Events from "../../components/events/events/Events";
import Header from "../../components/layouts/header/Header";
import Hero from "../../components/heroSection/Hero";
import ServiceInformation from "../../components/serviceInfo/ServiceInformation";
import WomenProducts from "../../components/products/womenProducts/WomenProducts";
import MenProducts from "../../components/products/menProducts/MenProducts";
import KidsProducts from "../../components/products/kidsProducts/KidsProducts";
import Footer from "../../components/layouts/footer/Footer";

const Home = () => {
  return (
    <main className="home-page">
      <Header />
      <section className="home-page-container">
        <Hero />

        <ServiceInformation />

        <WomenProducts />

        <MenProducts />

        <KidsProducts />

        <Events />

      </section>

      <Footer />
    </main>
  );
};

export default Home;
