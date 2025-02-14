import { useEffect, useMemo } from "react";
import "./WomenProducts.scss";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../productCard/ProductCard";
import {
  fetchAllProductsForAllShops,
  fetchCustomerCategoryProducts,
} from "../../../redux/actions/product";
import { clearProductErrors } from "../../../redux/reducers/productReducer";
import { useNavigate } from "react-router-dom";

const WomenProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, womenProducts } = useSelector((state) => state.product);


  useEffect(() => {
    dispatch(fetchCustomerCategoryProducts("Ladies"));
    return () => {
      dispatch(clearProductErrors()); 
    };
  }, [dispatch]);

  const bestSellingWomenProducts = useMemo(() => {
    if (!Array.isArray(womenProducts) || womenProducts.length === 0) return [];

    return [...womenProducts]
      .filter((product) => product.soldOut > 0)
      .sort((a, b) => b.soldOut - a.soldOut) // Sort by soldOut (descending)
      .slice(0, 3);
  }, [womenProducts]);

  const handleWomenProductsOnClick = () => {
    navigate(`/products?customerCategory=Ladies`, { replace: true });
    dispatch(fetchAllProductsForAllShops({ customerCategory: "Ladies" }));
  };

  return (
    <section className="women-products-container">
      <h2 className="women-products-Title">Women Products</h2>

      <button className="show-all-women-products-btn" onClick={handleWomenProductsOnClick}>More Ladies Products</button>

      <div className="women-product-wrapper">
        {loading && <p>Loading...</p>}

        {bestSellingWomenProducts?.length > 0
          ? bestSellingWomenProducts.map((product) => (
              <ProductCard product={product} key={product._id} />
            ))
          : !loading && <p>No Women products available.</p>}
      </div>
    </section>
  );
};

export default WomenProducts;
