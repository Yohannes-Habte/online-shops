import React from 'react';
import './Home.scss';
import Blog from '../../components/blog/Blog';
import Categories from '../../components/categories/Categories';
import FeaturedProducts from '../../components/products/featuredProducts/FeaturedProducts';
import BestDealProducts from '../../components/products/bestDealProducts/BestDealProducts';
import Events from '../../components/events/events/Events';
import Header from '../../components/userLayout/header/Header';
import Footer from '../../components/userLayout/footer/Footer';

const Home = () => {
  return (
    <main className="home-page">
      <Header />
      <section className="home-page-container">
        <Blog />

        <Categories />

        <BestDealProducts />

        <Events />

        <FeaturedProducts />
      </section>

      <Footer />
    </main>
  );
};

export default Home;
