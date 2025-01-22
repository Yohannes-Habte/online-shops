import "./Supplier.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaTruck,
  FaPencilAlt,
  FaTrashAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaCheckCircle,
  FaEdit,
} from "react-icons/fa";
import { API } from "../../../utils/security/secreteKey";
import { useSelector } from "react-redux";

const Supplier = () => {
  const { currentSeller } = useSelector((state) => state.seller);
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    supplierName: "",
    supplierDescription: "",
    supplierEmail: "",
    supplierPhone: "",
    supplierAddress: "",
    country: "",
    isActive: true,
  });
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch suppliers
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/suppliers`);
      setSuppliers(response.data.suppliers || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setLoading(false);
      setSuppliers([]);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Create new supplier
  const handleCreateSupplier = async (e) => {
    e.preventDefault();
    try {
      const createNewSupplier = {
        ...newSupplier,
        shopId: currentSeller?._id,
      };
      const response = await axios.post(
        `${API}/suppliers/create`,
        createNewSupplier,
        { withCredentials: true }
      );

      setSuppliers([...suppliers, response.data.supplier]);
      setNewSupplier({
        supplierName: "",
        supplierDescription: "",
        supplierEmail: "",
        supplierPhone: "",
        supplierAddress: "",
        country: "",
        isActive: true,
      });
    } catch (error) {
      console.error("Error creating supplier:", error);
    }
  };

  // Edit an existing supplier
  const handleEditSupplier = async (id, updatedSupplier) => {
    try {
      const response = await axios.put(
        `${API}/suppliers/${id}`,
        updatedSupplier
      );
      setSuppliers(
        suppliers.map((supplier) =>
          supplier._id === id ? response.data.supplier : supplier
        )
      );
      setEditingSupplier(null);
    } catch (error) {
      console.error("Error updating supplier:", error);
    }
  };

  // Delete supplier
  const handleDeleteSupplier = async (id) => {
    try {
      await axios.delete(`${API}/suppliers/${id}`);
      setSuppliers(suppliers.filter((supplier) => supplier._id !== id));
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  // Toggle supplier active status
  const handleToggleActiveStatus = async (id, isActive) => {
    try {
      const response = await axios.put(`${API}/suppliers/${id}`, {
        isActive: !isActive,
      });
      setSuppliers(
        suppliers.map((supplier) =>
          supplier._id === id ? response.data.supplier : supplier
        )
      );
    } catch (error) {
      console.error("Error toggling active status:", error);
    }
  };

  useEffect(() => {
    // Update form when an existing supplier is being edited
    if (editingSupplier) {
      setNewSupplier({
        supplierName: editingSupplier.supplierName,
        supplierDescription: editingSupplier.supplierDescription,
        supplierEmail: editingSupplier.supplierEmail,
        supplierPhone: editingSupplier.supplierPhone,
        supplierAddress: editingSupplier.supplierAddress,
        country: editingSupplier.country,
        isActive: editingSupplier.isActive,
      });
    }
  }, [editingSupplier]);

  return (
    <div className="supplier">
      <h1>Suppliers</h1>

      {/* Add new supplier form */}
      <div className="supplier-form">
        <h2>{editingSupplier ? "Edit Supplier" : "Add New Supplier"}</h2>
        <form
          onSubmit={
            editingSupplier
              ? () => handleEditSupplier(editingSupplier._id, newSupplier)
              : handleCreateSupplier
          }
        >
          <div className="form-group">
            <FaUser className="icon" />
            <input
              type="text"
              placeholder="Supplier Name"
              value={newSupplier.supplierName}
              onChange={(e) =>
                setNewSupplier({ ...newSupplier, supplierName: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <FaEdit className="icon" />
            <textarea
              placeholder="Supplier Description"
              value={newSupplier.supplierDescription}
              onChange={(e) =>
                setNewSupplier({
                  ...newSupplier,
                  supplierDescription: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Supplier Email"
              value={newSupplier.supplierEmail}
              onChange={(e) =>
                setNewSupplier({
                  ...newSupplier,
                  supplierEmail: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <FaPhone className="icon" />
            <input
              type="tel"
              placeholder="Supplier Phone"
              value={newSupplier.supplierPhone}
              onChange={(e) =>
                setNewSupplier({
                  ...newSupplier,
                  supplierPhone: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <FaMapMarkerAlt className="icon" />
            <input
              type="text"
              placeholder="Supplier Address"
              value={newSupplier.supplierAddress}
              onChange={(e) =>
                setNewSupplier({
                  ...newSupplier,
                  supplierAddress: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <FaGlobe className="icon" />
            <input
              type="text"
              placeholder="Country"
              value={newSupplier.country}
              onChange={(e) =>
                setNewSupplier({ ...newSupplier, country: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>
              <FaCheckCircle className="icon" />
              Active:
              <input
                type="checkbox"
                checked={newSupplier.isActive}
                onChange={() =>
                  setNewSupplier({
                    ...newSupplier,
                    isActive: !newSupplier.isActive,
                  })
                }
              />
            </label>
          </div>

          <button type="submit">
            {editingSupplier ? "Update Supplier" : "Create Supplier"}
          </button>
        </form>
      </div>

      {/* Supplier list */}
      <div className="supplier-list">
        {loading ? (
          <p>Loading suppliers...</p>
        ) : (
          <ul>
            {suppliers.map((supplier) => (
              <li key={supplier._id}>
                <div className="supplier-info">
                  <h3>{supplier.supplierName}</h3>
                  <p>{supplier.supplierDescription}</p>
                  <p>Email: {supplier.supplierEmail}</p>
                  <p>Phone: {supplier.supplierPhone}</p>
                  <p>Address: {supplier.supplierAddress}</p>
                  <p>Country: {supplier.country}</p>
                  <p>Status: {supplier.isActive ? "Active" : "Inactive"}</p>
                </div>
                <div className="supplier-actions">
                  <button onClick={() => setEditingSupplier(supplier)}>
                    Edit <FaPencilAlt />
                  </button>
                  <button onClick={() => handleDeleteSupplier(supplier._id)}>
                    Delete <FaTrashAlt />
                  </button>
                  <button
                    onClick={() =>
                      handleToggleActiveStatus(supplier._id, supplier.isActive)
                    }
                  >
                    {supplier.isActive ? "Deactivate" : "Activate"} <FaTruck />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Supplier;
