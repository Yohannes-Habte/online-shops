import { useEffect, useMemo } from "react";
import "./MenProducts.scss";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../productCard/ProductCard";
import {
  fetchAllProductsForAllShops,
  fetchCustomerCategoryProducts,
} from "../../../redux/actions/product";
import { clearProductErrors } from "../../../redux/reducers/productReducer";
import { useNavigate } from "react-router-dom";

const MenProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, menProducts } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchCustomerCategoryProducts("Gents"));
    return () => {
      dispatch(clearProductErrors());
    };
  }, [dispatch]);

  const bestSellingMenProducts = useMemo(() => {
    if (!Array.isArray(menProducts) || menProducts.length === 0) return [];

    return [...menProducts]
      .filter((product) => product.soldOut > 0)
      .sort((a, b) => b.soldOut - a.soldOut) // Sort by soldOut (descending)
      .slice(0, 3);
  }, [menProducts]);

  const handleMenProductsOnClick = () => {
    navigate(`/products?customerCategory=Gents`, { replace: true });
    dispatch(fetchAllProductsForAllShops({ customerCategory: "Gents" }));
  };

  return (
    <section className="men-products-container">
      <h2 className="men-products-title">Men Products</h2>
      <button
        className="show-all-men-products-btn"
        onClick={handleMenProductsOnClick}
      >
        More Men Products
      </button>

      <div className="men-products-wrapper">
        {loading && <p>Loading...</p>}

        {error && <p>{error}</p>}

        {bestSellingMenProducts?.length > 0
          ? bestSellingMenProducts.map((product) => (
              <ProductCard product={product} key={product._id} />
            ))
          : !loading && <p>No Men products available.</p>}
      </div>
    </section>
  );
};

export default MenProducts;
