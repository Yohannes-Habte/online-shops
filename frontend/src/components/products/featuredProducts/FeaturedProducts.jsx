import axios from 'axios';
import './FeaturedProducts.scss';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '../productCard/ProductCard';
import { API } from '../../../utils/security/secreteKey';

const FeaturedProducts = () => {
  // Global state variables
  const { products } = useSelector((state) => state.product);
  const { currentSeller } = useSelector((state) => state.seller);

  // Local state variables
  const [data, setData] = useState([]);

  // Display products
  // useEffect(() => {
  //   const productsData = products ? [...products] : [];
  //   const sortedData = productsData?.sort((a, b) => b.sold_out - a.sold_out);
  //   const firstFive = sortedData && sortedData.slice(0, 5);
  //   setData(firstFive);
  // }, [products]);

  useEffect(() => {
    const bestdealtProducts = async () => {
      try {
        // dispatch(productsShopFetchStart());
        const { data } = await axios.get(
          `${API}/products/${currentSeller._id}/shop-products`
        );
        // dispatch(productsShopFetchSuccess(data));
        setData(data.products);
      } catch (error) {
        console.log(error);
        // dispatch(productsShopFetchFailure(error.response.data.message));
      }
    };
    bestdealtProducts();
  }, []);
  return (
    <div>
      <div className={`featured-products-container`}>
        <h1 className="featured-products-title">Featured Products</h1>

        <div className="featured-products">
          {data && data.length !== 0 && (
            <>
              {data &&
                data.map((product, index) => (
                  <ProductCard product={product} key={index} />
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
