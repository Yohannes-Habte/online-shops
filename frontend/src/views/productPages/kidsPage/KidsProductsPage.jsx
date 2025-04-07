import { useDispatch, useSelector } from "react-redux";
import "./KidsProductsPage.scss";
import { useEffect } from "react";
import { fetchCustomerCategoryProducts } from "../../../redux/actions/product";
import { clearProductErrors } from "../../../redux/reducers/productReducer";
import ProductCard from "../../../components/products/productCard/ProductCard";
import Header from "../../../components/layouts/header/Header";
import Footer from "../../../components/layouts/footer/Footer";

const KidsProductsPage = () => {
  const dispatch = useDispatch();
  const { loading, kidsProducts } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchCustomerCategoryProducts("Ladies"));
    return () => {
      dispatch(clearProductErrors());
    };
  }, [dispatch]);

  

  return (
    <main className="kids-products-page">
      <Header />
      <section className="kids-products-page-container">
        <h1 className="kids-products-page-title">Kids Products</h1>

        <div className="kids-products-wrapper">
          {loading && <p>Loading...</p>}

          {kidsProducts?.length > 0
            ? kidsProducts.map((product) => (
                <ProductCard product={product} key={product._id} />
              ))
            : !loading && <p>No kids products available.</p>}
        </div>
      </section>

     <Footer /> 
    </main>
  );
};

export default KidsProductsPage;
