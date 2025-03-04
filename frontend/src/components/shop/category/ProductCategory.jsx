import "./ProductCategory.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaTag, FaRegEdit } from "react-icons/fa"; // Importing React Icons
import { API } from "../../../utils/security/secreteKey";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ProductCategory = () => {
  const { currentSeller } = useSelector((state) => state.seller);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API}/categories`);
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]); // Default to empty array on error
      }
    };

    fetchCategories();
  }, []);

  // Add or update a category
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCategory = {
      categoryName,
      categoryDescription,
      shopId: currentSeller?._id,
    };

    const updateCategory = {
      categoryName,
      categoryDescription,
    };

    try {
      if (editId) {
        // Update category
        await axios.put(`${API}/categories/${editId}`, updateCategory, {
          withCredentials: true,
        });
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === editId ? { ...cat, ...updateCategory } : cat
          )
        );
        setEditId(null);
      } else {
        // Add new category
        const response = await axios.post(
          `${API}/categories/create`,
          newCategory,
          { withCredentials: true }
        );
        setCategories((prev) => [...prev, response.data.category]);
      }

      setCategoryName("");
      setCategoryDescription("");
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  // Delete a category
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!isConfirmed) return;

    try {
      await axios.delete(`${API}/categories/${id}`, {
        withCredentials: true,
      });
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (error) {
      const errorMessage = error.response.data.message;
      toast.error(errorMessage);
    }
  };

  // Edit a category
  const handleEdit = (category) => {
    setEditId(category?._id);
    setCategoryName(category?.categoryName);
    setCategoryDescription(category?.categoryDescription);
  };

  return (
    <div className="container">
      <h1>Product Categories</h1>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Category Name:</label>
          <div className="input-wrapper">
            <FaTag className="icon" />
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label>Category Description:</label>
          <div className="input-wrapper">
            <FaRegEdit className="icon" />
            <input
              type="text"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              placeholder="Enter category description"
              required
            />
          </div>
        </div>

        <button type="submit">{editId ? "Update" : "Add"} Category</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(categories) &&
            categories.map((category) => (
              <tr key={category?._id}>
                <td>{category?.categoryName}</td>
                <td>{category?.categoryDescription}</td>
                <td>
                  <button className="edit" onClick={() => handleEdit(category)}>
                    Edit
                  </button>
                  <button
                    className="delete"
                    onClick={() => handleDelete(category?._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductCategory;
