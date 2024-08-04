import React, { useEffect, useState } from 'react';
import './RelatedProducts.scss';
import { useSelector } from 'react-redux';
import ProductCard from '../productCard/ProductCard';

const RelatedProducts = ({ data }) => {
  // Global state variables
  const { currentSeller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.product);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // useEffect(() => {
  //   const infos =
  //     products &&
  //     products.filter((product) => product.category === product.category);
  //   setRelatedProducts(infos);
  // }, []);

  return (
    <section className="related-product-container">
      {data
        ? data.map((product) => {
            return <ProductCard product={product} key={product._id} />;
          })
        : null}
    </section>
  );
};

export default RelatedProducts;
