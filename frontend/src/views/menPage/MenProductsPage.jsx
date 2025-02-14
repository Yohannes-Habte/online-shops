import { useEffect } from "react";
import "./MenProductsPage.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerCategoryProducts } from "../../redux/actions/product";
import { clearProductErrors } from "../../redux/reducers/productReducer";
import ProductCard from "../../components/products/productCard/ProductCard";
import Header from "../../components/layouts/header/Header";
import Footer from "../../components/layouts/footer/Footer";

const MenProductsPage = () => {
    const dispatch = useDispatch();
    const { loading, menProducts } = useSelector((state) => state.product);
  
    useEffect(() => {
      dispatch(fetchCustomerCategoryProducts("Gents"));
      return () => {
        dispatch(clearProductErrors());
      };
    }, [dispatch]);

  return (
    <main className="men-products-page">
      <Header />
      <section className="men-products-page-container">
        <h1 className="men-products-page-title">Men Products</h1>

        <div className="men-products-wrapper">
          {loading && <p>Loading...</p>}

          {menProducts?.length > 0
            ? menProducts.map((product) => (
                <ProductCard product={product} key={product._id} />
              ))
            : !loading && <p>No Men products available.</p>}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default MenProductsPage;
