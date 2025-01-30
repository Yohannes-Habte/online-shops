import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/userLayout/header/Header";
import Footer from "../../../components/userLayout/footer/Footer";
import ProductCard from "../../../components/products/productCard/ProductCard";
import { fetchAllProductsForAllShops } from "../../../redux/actions/product";
import { clearProductErrors } from "../../../redux/reducers/productReducer";
import Loader from "../../../components/loader/Loader";
import axios from "axios";
import "./Products.scss";
import { API } from "../../../utils/security/secreteKey";

const Products = () => {
  const {
    loading,
    error,
    products = [],
    currentPage,
    totalPages,
  } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State for query parameters
  const [query, setQuery] = useState({
    title: "",
    shopName: "",
    categoryName: "",
    subcategoryName: "",
    brandName: "",
    customerCategory: "",
    page: 1, // Start from page 1
  });

  // State for dropdown options
  const [dropdownOptions, setDropdownOptions] = useState({
    shopNames: [],
    categoryNames: [],
    subcategoryNames: [],
    brandNames: [],
  });

  // Fetch dropdown options from the backend
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [shopsRes, categoriesRes, subcategoriesRes, brandsRes] =
          await Promise.all([
            axios.get(`${API}/shops`),
            axios.get(`${API}/categories`),
            axios.get(`${API}/subcategories`),
            axios.get(`${API}/brands`),
          ]);

        setDropdownOptions({
          shopNames: shopsRes.data.shops || [],
          categoryNames: categoriesRes.data.categories || [],
          subcategoryNames: subcategoriesRes.data.subcategories || [],
          brandNames: brandsRes.data.brands || [],
        });
      } catch (err) {
        console.error("Error fetching dropdown options:", err);
      }
    };

    fetchDropdownData();
  }, []);

  // Fetch products only on Search button click
  const handleSearch = () => {
    const queryString = new URLSearchParams(query).toString();
    navigate(`/products?${queryString}`);
    dispatch(fetchAllProductsForAllShops(query)); // Fetch products only on search
  };

  // Reset the search form
  const handleReset = () => {
    const resetQuery = {
      title: "",
      shopName: "",
      categoryName: "",
      subcategoryName: "",
      brandName: "",
      customerCategory: "",
      page: 1, // Reset to page 1
    };

    setQuery(resetQuery);
    navigate(`/products`);
    dispatch(fetchAllProductsForAllShops(resetQuery)); // Reset the product list
  };

  // Handle input changes without fetching products
  const handleInputChange = (e) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      [e.target.name]: e.target.value,
    }));
  };

  // Fetch all products on initial load only
  useEffect(() => {
    dispatch(fetchAllProductsForAllShops(query));

    // Cleanup function to clear product errors on component unmount
    return () => {
      dispatch(clearProductErrors());
    };
  }, []); // Runs only once on mount

  // Handle "See More Products" click (pagination)
  const handleSeeMore = () => {
    const nextPage = query.page + 1;
    const updatedQuery = { ...query, page: nextPage };

    setQuery(updatedQuery);
    dispatch(fetchAllProductsForAllShops(updatedQuery));
  };

  return (
    <main className="products-page">
      <Header />

      <section className="products-container">
        {error && (
          <p className="error-message" role="alert">
            {`Error: ${error}`}
          </p>
        )}

        <h1 className="products-title">Search Products</h1>

        {/* Search bar */}
        <div className="search-bar-container">
          <div className="select-container">
            <select
              name="shopName"
              value={query.shopName}
              onChange={handleInputChange}
            >
              <option value="">Select Shop</option>
              {dropdownOptions.shopNames.map((shop) => (
                <option key={shop._id} value={shop.name}>
                  {shop.name}
                </option>
              ))}
            </select>
          </div>

          <div className="select-container">
            <select
              name="categoryName"
              value={query.categoryName}
              onChange={handleInputChange}
            >
              <option value="">Select Category</option>
              {dropdownOptions.categoryNames.map((category) => (
                <option key={category._id} value={category.categoryName}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="select-container">
            <select
              name="subcategoryName"
              value={query.subcategoryName}
              onChange={handleInputChange}
            >
              <option value="">Select Subcategory</option>
              {dropdownOptions.subcategoryNames.map((subcategory) => (
                <option
                  key={subcategory._id}
                  value={subcategory.subcategoryName}
                >
                  {subcategory.subcategoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="select-container">
            <select
              name="brandName"
              value={query.brandName}
              onChange={handleInputChange}
            >
              <option value="">Select Brand</option>
              {dropdownOptions.brandNames.map((brand) => (
                <option key={brand._id} value={brand.brandName}>
                  {brand.brandName}
                </option>
              ))}
            </select>
          </div>

          <div className="select-container">
            <select
              name="customerCategory"
              value={query.customerCategory}
              onChange={handleInputChange}
            >
              <option value="">All Categories</option>
              <option value="Ladies">Ladies</option>
              <option value="Gents">Gents</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div className="button-container">
            <button onClick={handleSearch}>Search</button>
            <button onClick={handleReset} type="button" className="reset-btn">
              Reset
            </button>
          </div>
        </div>

        {loading && (
          <Loader isLoading={loading} message="Loading products..." size={80} />
        )}

        {/* Products list */}
        <article className="products-wrapper">
          {!loading && Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <ProductCard product={product} key={product._id} />
            ))
          ) : (
            <h2 className="no-products-message">
              {Object.values(query).some((value) => value)
                ? "No products found related to your query."
                : "No products available."}
            </h2>
          )}
        </article>

        {/* Show "See More Products" button */}
        {currentPage < totalPages ? (
          <div className="see-more-container">
            <button
              onClick={handleSeeMore}
              className="see-more-btn"
              disabled={loading}
            >
              {loading ? "Loading..." : "See More Products"}
            </button>
          </div>
        ) : (
          <div className="see-more-container">
            <button className="see-more-btn" disabled>
              No further products available
            </button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
};

export default Products;
