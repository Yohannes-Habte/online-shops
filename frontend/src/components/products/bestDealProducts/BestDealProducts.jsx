import React, { useEffect, useState } from 'react';
import './BestDealProducts.scss';
import { useSelector } from 'react-redux';
import ProductCard from '../productCard/ProductCard';
import axios from 'axios';
import { API } from '../../../utils/security/secreteKey';

const BestDealProducts = () => {
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
    <section className={`best-deals-container`}>
      <h2 className="subTitle">Best Deals</h2>

      <div className="product-wrapper">
        {data && data.length !== 0 && (
          <>
            {data &&
              data.map((product, index) => (
                <ProductCard product={product} key={index} isShop={true} />
              ))}
          </>
        )}
      </div>
    </section>
  );
};
export default BestDealProducts;
