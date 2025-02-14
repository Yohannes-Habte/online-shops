import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "../../../components/products/productCard/ProductCard";
import { fetchAllProductsForAllShops } from "../../../redux/actions/product";
import { clearProductErrors } from "../../../redux/reducers/productReducer";
import Loader from "../../../components/loader/Loader";
import axios from "axios";
import "./Products.scss";
import { API } from "../../../utils/security/secreteKey";
import SearchForm from "../../../components/search/SearchForm";
import Header from "../../../components/layouts/header/Header";
import Footer from "../../../components/layouts/footer/Footer";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Get query parameters from URL

  // ===================================================================================================================================================================
  // This is an object that holds the values extracted directly from the URL when the component first mounts (or when the URL changes).
  // It's essentially the initial set of values used to set the local state.
  // ===================================================================================================================================================================
  const queryParams = {
    title: searchParams.get("title") || "",
    shopName: searchParams.get("shopName") || "",
    categoryName: searchParams.get("categoryName") || "",
    subcategoryName: searchParams.get("subcategoryName") || "",
    brandName: searchParams.get("brandName") || "",
    customerCategory: searchParams.get("customerCategory") || "",
    page: Number(searchParams.get("page")) || 1,
  };

  // ===================================================================================================================================================================
  // This is the local state (useState) that keeps track of the current filter settings and pagination throughout the user’s interaction with the UI.
  // query is what is used when you want to trigger an action to update the page or submit a search, because it reflects the most recent user choices (which could have changed after the page loaded).
  // ===================================================================================================================================================================

  const [query, setQuery] = useState(queryParams);

  // Get products from the redux store
  const {
    loading,
    error,
    products = [],
    currentPage,
    totalPages,
  } = useSelector((state) => state.product);

  console.log("Products:", products);

  // ===================================================================================================================================================================
  // This useEffect is used to set up the initial state (queryParams) when the component loads or when the URL changes (because searchParams changes).
  // It is also used here to populate the component's local state (query).
  // ===================================================================================================================================================================
  useEffect(() => {
    setQuery(queryParams); // Set state when URL changes
    dispatch(fetchAllProductsForAllShops(queryParams)); // Fetch products based on URL params

    // Cleanup to clear errors when component unmounts or when query params change
    return () => {
      dispatch(clearProductErrors());
    };
  }, [searchParams]); // Trigger on URL change (searchParams change)

  // Local state for dropdown options
  const [dropdownOptions, setDropdownOptions] = useState({
    shopNames: [],
    categoryNames: [],
    subcategoryNames: [],
    brandNames: [],
  });

  // ===================================================================================================================================================================
  // Fetch dropdown options on component mount
  // ===================================================================================================================================================================
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

  // ===================================================================================================================================================================
  // the query is used in handleSearch because it represents the current state of the search (filters and page), which could have been modified by the user.
  // It ensures that you're submitting the latest state of filters and pagination when the user clicks the "Search" button.
  // ===================================================================================================================================================================
  const handleSearch = () => {
    const queryString = new URLSearchParams(query).toString();
    navigate(`/products?${queryString}`);
    dispatch(fetchAllProductsForAllShops(query));
  };

  // ===================================================================================================================================================================
  // Reset search form
  // ===================================================================================================================================================================
  const handleReset = () => {
    const resetQuery = {
      title: "",
      shopName: "",
      categoryName: "",
      subcategoryName: "",
      brandName: "",
      customerCategory: "",
      page: 1,
    };

    setQuery(resetQuery);
    navigate(`/products`);
    dispatch(fetchAllProductsForAllShops(resetQuery)); // Reset the product list
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      [e.target.name]: e.target.value,
    }));
  };

  // ===================================================================================================================================================================
  // the query is used in handleSeeMore because it represents the current state of the search (filters and page), which could have been modified by the user.
  // It ensures that you're submitting the latest state of filters and pagination when the user clicks the "See More Products" button.
  // ===================================================================================================================================================================
  const handleSeeMore = () => {
    const nextPage = query.page + 1;
    const updatedQuery = { ...query, page: nextPage };

    setQuery(updatedQuery);
    dispatch(fetchAllProductsForAllShops(updatedQuery));
  };

  return (
    <main className="products-page">
      <Header />

      <section className="products-page-container">
        <h1 className="products-title">All Shops Products</h1>

        {/* Search bar form component */}
        <SearchForm
          query={query}
          products={products}
          dropdownOptions={dropdownOptions}
          handleInputChange={handleInputChange}
          handleSearch={handleSearch}
          handleReset={handleReset}
        />

        {loading && (
          <Loader isLoading={loading} message="Loading products..." size={80} />
        )}

        {!loading && error && <p className="error-msg">{error}</p>}

        {!loading &&
          !error &&
          Array.isArray(products) &&
          products.length > 0 && (
            <article className="products-wrapper">
              {products.map((product) => (
                <ProductCard product={product} key={product._id} />
              ))}
            </article>
          )}

        {!loading && !error && products.length === 0 && (
          <p className="no-products-msg">
            No products found related to your query. Please try again.
          </p>
        )}

        {/* "See More Products" Button */}
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
