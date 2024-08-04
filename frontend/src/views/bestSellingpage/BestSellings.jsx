import React, { useEffect, useState } from 'react';
import './BestSellings.scss';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ProductCard from '../../components/products/productCard/ProductCard';
import Header from '../../components/userLayout/header/Header';
import Footer from '../../components/userLayout/footer/Footer';

const BestSellings = () => {
  // Global state variables
  const { products } = useSelector((state) => state.product);

  // Local state variables
  const [data, setData] = useState([]);
  console.log('Sorted data are', data);

  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      try {
        const { data } = await axios(`http://localhost:5000/api/products`);

        const allProductsData = data ? [...data] : [];

        const sortedData = allProductsData?.sort(
          (a, b) => b.sold_out - a.sold_out
        );
        setData(sortedData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBestSellingProducts();
    //==========
  }, [products]);

  return (
    <main className="best-sellings-page">
      <Header />
      <section className="best-selleings-container">
        <h1 className="best-sellings-title">Best Selling Products </h1>

        <div className="products-wrapper">
          {data &&
            data.map((product) => (
              <ProductCard product={product} key={product._id} />
            ))}{' '}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default BestSellings;
