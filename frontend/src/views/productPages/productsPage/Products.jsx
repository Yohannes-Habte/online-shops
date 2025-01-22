import { useEffect } from "react";
import "./Products.scss";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../components/userLayout/header/Header";
import Footer from "../../../components/userLayout/footer/Footer";
import ProductCard from "../../../components/products/productCard/ProductCard";
import { fetchAllProductsForAllShops } from "../../../redux/actions/product";
import { clearProductErrors } from "../../../redux/reducers/productReducer";
import Loader from "../../../components/loader/Loader";

const Products = () => {
  const {
    loading,
    error,
    products = [],
  } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllProductsForAllShops());

    return () => {
      dispatch(clearProductErrors());
    };
  }, [dispatch]);

  console.log("Rendering Products Component. Products:", products);

  return (
    <main className="products-page">
      <Header />

      <section className="products-container">
        {error && (
          <p className="error-message" role="alert">
            {`Error: ${error}`}
          </p>
        )}

        <h1 className="products-title">Our Products</h1>

        {loading && (
          <Loader isLoading={loading} message="Loading products..." size={80} />
        )}

        <div className="products-wrapper">
          {!loading &&
            Array.isArray(products) &&
            products.map((product) => (
              <ProductCard product={product} key={product._id} />
            ))}
        </div>

        {!loading && Array.isArray(products) && products.length === 0 && (
          <h2 className="no-products-message">No products found!</h2>
        )}

        {!loading && !Array.isArray(products) && (
          <h2 className="error-message">
            Unexpected data format for products!
          </h2>
        )}
      </section>

      <Footer />
    </main>
  );
};

export default Products;
