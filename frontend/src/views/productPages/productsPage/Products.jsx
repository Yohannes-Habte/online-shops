import React, { useEffect, useState } from 'react';
import './Products.scss';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../../../components/userLayout/header/Header';
import Footer from '../../../components/userLayout/footer/Footer';
import ProductCard from '../../../components/products/productCard/ProductCard';

const Products = () => {
  // Global state variables
  const { products } = useSelector((state) => state.product);
  const { currentSeller } = useSelector((state) => state.seller);

  // Local state variables
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get('category');
  const [allProducts, setAllProducts] = useState([]);

  console.log('useSearchParams', categoryData);
  // Displaying data
  useEffect(() => {
    const fetachAllProducts = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products`);

        if (categoryData === null) {
          setAllProducts(data);
        } else {
          const categories =
            allProducts &&
            allProducts.filter((item) => item.category === categoryData);
          setAllProducts(categories);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetachAllProducts();
  }, []);

  return (
    <main className="products-page">
      <Header />

      <section className="products-container">
        <h1 className="products-title"> Products Title </h1>

        <div className="products-wrapper">
          {allProducts &&
            allProducts.map((product) => (
              <ProductCard product={product} key={product._id} />
            ))}{' '}
        </div>

        {allProducts && allProducts.length === 0 && (
          <h1 className="subTitle">No products Found!</h1>
        )}
      </section>

      <Footer />
    </main>
  );
};

export default Products;
