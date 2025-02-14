import "./KidsProducts.scss";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../productCard/ProductCard";
import { fetchAllProductsForAllShops, fetchCustomerCategoryProducts } from "../../../redux/actions/product";
import { clearProductErrors } from "../../../redux/reducers/productReducer";
import { useNavigate } from "react-router-dom";

const KidsProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, kidsProducts } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(fetchCustomerCategoryProducts("Kids"));

    return () => {
      dispatch(clearProductErrors());
    };
  }, [dispatch]);

  const handleWomenProductsOnClick = () => {
    navigate(`/products?customerCategory=Kids`, { replace: true });
    dispatch(fetchAllProductsForAllShops({ customerCategory: "Kids" }));
  };

  return (
    <section className="kids-products-container">
      <h2 className="kids-product-title">Kids Products</h2>

      <button className="show-all-kids-products-btn" onClick={handleWomenProductsOnClick}>More Kids Products</button>

      <div className="kids-products-wrapper">
        {loading && <p>Loading...</p>}
      
        {kidsProducts?.length > 0
          ? kidsProducts.map((product) => (
              <ProductCard product={product} key={product._id} />
            ))
          : !loading && <p>No Kids products available.</p>}
      </div>
    </section>
  );
};

export default KidsProducts;
