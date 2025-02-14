import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllProductsForAllShops } from "../../../redux/actions/product"; // Make sure this action exists
import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../../utils/security/secreteKey";
import "./DrpDown.scss";

const DropDown = ({ setDropDown }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state for categories
  const [categories, setCategories] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API}/categories`);
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Handle category selection
  /**
   * Without replace: true, if the user selects a category, it will navigate to the new URL, and a new entry will be added to the browser’s history stack. This means the user could click the back button and go back to the previous state of the page.
   * With replace: true, when the category is selected, the URL will be updated, but the previous page in the browser history will be replaced by this new URL. This makes it so that when the user clicks the back button, they will not be taken back to the previous URL; instead, they will stay on the current URL.
   */
  const handleCategoryClick = (categoryName) => {
    setDropDown(false);

    // Update the URL and fetch products for the selected category
    navigate(`/products?categoryName=${categoryName}`, { replace: true });
    dispatch(fetchAllProductsForAllShops({ categoryName }));
  };

  return (
    <dev className="categories-list-wrapper">
      {categories.length > 0 ? (
        categories.map((category) => (
          <p
            key={category._id}
            onClick={() => handleCategoryClick(category.categoryName)}
            className="category-item"
          >
            {category.categoryName}
          </p>
        ))
      ) : (
        <p className="no-categories">No categories available</p>
      )}
    </dev>
  );
};

export default DropDown;
