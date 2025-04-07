import { useDispatch, useSelector } from "react-redux";
import "./WomenProductsPage.scss";
import { useEffect } from "react";
import { fetchCustomerCategoryProducts } from "../../../redux/actions/product";
import { clearProductErrors } from "../../../redux/reducers/productReducer";
import ProductCard from "../../../components/products/productCard/ProductCard";
import Header from "../../../components/layouts/header/Header";
import Footer from "../../../components/layouts/footer/Footer";

const WomenProductsPage = () => {
  const dispatch = useDispatch();
  const { loading, womenProducts } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchCustomerCategoryProducts("Ladies"));
    return () => {
      dispatch(clearProductErrors());
    };
  }, [dispatch]);
  return (
    <main className="women-products-page">
      <Header />
      <section className="women-products-page-container">
        <h1 className="women-products-page-title">Women Products</h1>

        <div className="women-products-wrapper">
          {loading && <p>Loading...</p>}

          {womenProducts?.length > 0
            ? womenProducts.map((product) => (
                <ProductCard product={product} key={product._id} />
              ))
            : !loading && <p>No Women products available.</p>}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default WomenProductsPage;
