import "./ProductBrand.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaTag, FaRegEdit } from "react-icons/fa";
import { API } from "../../../utils/security/secreteKey";
import { useSelector } from "react-redux";

const ProductBrand = () => {
  const { currentSeller } = useSelector((state) => state.seller);
  const [brands, setBrands] = useState([]);
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [category, setCategory] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${API}/brands`);
        setBrands(response.data.brands || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBrands();
  }, []);

  // Add or update a brand
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newBrand = {
      brandName,
      brandDescription,
      category,
      shopId: currentSeller?._id,
    };

    const updateBrand = {
      brandName,
      brandDescription,
    };

    try {
      if (editId) {
        // Update brand
        await axios.put(`${API}/brands/${editId}`, updateBrand, {
          withCredentials: true,
        });
        setBrands((prev) =>
          prev.map((b) => (b._id === editId ? { ...b, ...updateBrand } : b))
        );
        setEditId(null);
      } else {
        // Add new brand
        const response = await axios.post(`${API}/brands/create`, newBrand, {
          withCredentials: true,
        });
        setBrands((prev) => [...prev, response.data.brand]);
      }

      // Clear form
      setBrandName("");
      setBrandDescription("");
      setCategory("");
    } catch (error) {
      console.error("Error saving brand:", error);
    }
  };

  // Delete a brand
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/brands/${id}`, { withCredentials: true });
      setBrands((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  };

  // Edit a brand
  const handleEdit = (brand) => {
    setEditId(brand?._id);
    setBrandName(brand?.brandName);
    setBrandDescription(brand?.brandDescription);
    setCategory(brand?.category || "");
  };

  return (
    <div className="container">
      <h1>Product Brands</h1>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Brand Name:</label>
          <div className="input-wrapper">
            <FaTag className="icon" />
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Enter brand name"
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label>Brand Description:</label>
          <div className="input-wrapper">
            <FaRegEdit className="icon" />
            <input
              type="text"
              value={brandDescription}
              onChange={(e) => setBrandDescription(e.target.value)}
              placeholder="Enter brand description"
              required
            />
          </div>
        </div>

        <button type="submit">{editId ? "Update" : "Add"} Brand</button>
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
          {Array.isArray(brands) &&
            brands.map((brand) => (
              <tr key={brand?._id}>
                <td>{brand?.brandName}</td>
                <td>{brand?.brandDescription}</td>

                <td>
                  <button className="edit" onClick={() => handleEdit(brand)}>
                    Edit
                  </button>
                  <button
                    className="delete"
                    onClick={() => handleDelete(brand?._id)}
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

export default ProductBrand;
