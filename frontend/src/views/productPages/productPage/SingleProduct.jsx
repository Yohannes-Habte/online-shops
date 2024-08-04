import React, { useEffect, useState } from 'react';
import './SingleProduct.scss';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import RelatedProducts from '../../../components/products/relatedProducts/RelatedProducts';
import Header from '../../../components/userLayout/header/Header';
import Footer from '../../../components/userLayout/footer/Footer';
import ProductDetails from '../../../components/products/productDetails/ProductDetails';
import { API } from '../../../utils/security/secreteKey';

const SingleProduct = () => {
  const { productID } = useParams();

  // Global state variables
  const { products } = useSelector((state) => state.product);
  const { currentSeller } = useSelector((state) => state.seller);

  // Local variables
  const [productData, setProductData] = useState([]);
  const { events } = useSelector((state) => state.event);
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get('isEvent');
  console.log('eventdata is', eventData);

  // Display products
  // useEffect(() => {
  //   if (eventData !== null) {
  //     const data = events && events.find((i) => i._id === id);
  //     setData(data);
  //   } else {
  //     const data = products && products.find((i) => i._id === id);
  //     setData(data);
  //   }
  // }, [products, events]);

  // Display products for a single shop
  useEffect(() => {
    const shopProducts = async () => {
      try {
        if (eventData !== null) {
          // const data = events && events.find((i) => i._id === productID);
          // setProductData(data);
        } else {
          const { data } = await axios.get(
            `${API}/products/${currentSeller._id}/shop-products`
          );
          setProductData(data.products);
        }
      } catch (error) {
        console.log(error);
      }
    };
    shopProducts();
  }, []);

  // Find a single product
  const foundProduct = productData.find((product) => product._id === productID);

  return (
    <main className="single-product-page">
      <Header />

      <section className="single-product-container">
        {foundProduct ? (
          <h1 className="product-title"> {foundProduct.name} </h1>
        ) : (
          <h1 className="product-title"> Your Product </h1>
        )}

        {/* Single product details */}
        {productData && foundProduct && <ProductDetails data={foundProduct} />}

        <h2 className="related-prdoucts-title">Related Product</h2>
        {/* Related product details */}
        {!eventData && productData && <RelatedProducts data={productData} />}
      </section>

      <Footer />
    </main>
  );
};

export default SingleProduct;
