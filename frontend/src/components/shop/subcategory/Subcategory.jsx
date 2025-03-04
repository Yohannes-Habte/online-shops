import "./Subcategory.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaTag, FaRegEdit } from "react-icons/fa";
import { API } from "../../../utils/security/secreteKey";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Subcategory = () => {
  const { currentSeller } = useSelector((state) => state.seller);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [subcategoryDescription, setSubcategoryDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [editId, setEditId] = useState(null);

  console.log("subcategories", subcategories);

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

  // Fetch subcategories
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(`${API}/subcategories`);
        setSubcategories(response.data.subcategories || []);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setSubcategories([]); // Default to empty array on error
      }
    };

    fetchSubcategories();
  }, []);

  // Add or update a subcategory
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newSubcategory = {
      subcategoryName,
      subcategoryDescription,
      category: categoryId,
      shopId: currentSeller?._id,
    };

    const updateSubcategory = {
      subcategoryName,
      subcategoryDescription,
    };

    try {
      let response;
      if (editId) {
        // Update subcategory
        response = await axios.put(
          `${API}/subcategories/${editId}`,
          updateSubcategory,
          {
            withCredentials: true,
          }
        );
        setSubcategories((prev) =>
          prev.map((sub) =>
            sub._id === editId ? { ...sub, ...updateSubcategory } : sub
          )
        );
        setEditId(null);
      } else {
        // Add new subcategory
        response = await axios.post(
          `${API}/subcategories/create`,
          newSubcategory,
          { withCredentials: true }
        );
        setSubcategories((prev) => [...prev, response.data.subcategory]);
      }

      setSubcategoryName("");
      setSubcategoryDescription("");
      setCategoryId("");

      toast.success(response.data.message);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    }
  };

  // Delete a subcategory
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the ${subcategoryName} subcategory?`
    );
    if (!isConfirmed) return;
    try {
      await axios.delete(`${API}/subcategories/${id}`, {
        withCredentials: true,
      });
      setSubcategories((prev) => prev.filter((sub) => sub._id !== id));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    }
  };

  // Edit a subcategory
  const handleEdit = (subcategory) => {
    setEditId(subcategory?._id);
    setSubcategoryName(subcategory?.subcategoryName);
    setSubcategoryDescription(subcategory?.subcategoryDescription);
    setCategoryId(subcategory?.category?._id);
  };

  return (
    <div className="container">
      <h1>Subcategories</h1>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Subcategory Name:</label>
          <div className="input-wrapper">
            <FaTag className="icon" />
            <input
              type="text"
              value={subcategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
              placeholder="Enter subcategory name"
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label>Subcategory Description:</label>
          <div className="input-wrapper">
            <FaRegEdit className="icon" />
            <input
              type="text"
              value={subcategoryDescription}
              onChange={(e) => setSubcategoryDescription(e.target.value)}
              placeholder="Enter subcategory description"
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label>Select Category:</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select Category</option>

            {categories &&
              categories.length > 0 &&
              categories.map((category) => {
                return (
                  <option key={category?._id} value={category?._id}>
                    {category?.categoryName}
                  </option>
                );
              })}
          </select>
        </div>

        <button type="submit">{editId ? "Update" : "Add"} Subcategory</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(subcategories) &&
            subcategories.map((subcategory) => (
              <tr key={subcategory?._id}>
                <td>{subcategory?.category?.categoryName}</td>
                <td>{subcategory?.subcategoryName}</td>
                <td>{subcategory?.subcategoryDescription}</td>

                <td>
                  <button
                    className="edit"
                    onClick={() => handleEdit(subcategory)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete"
                    onClick={() => handleDelete(subcategory?._id)}
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

export default Subcategory;
