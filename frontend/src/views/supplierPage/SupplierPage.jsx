import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import Footer from "../../components/layouts/footer/Footer";
import Header from "../../components/layouts/header/Header";
import "./SupplierPage.scss";
import axios from "axios";
import { toast } from "react-toastify";
import { API } from "../../utils/security/secreteKey";

const SupplierPage = () => {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Secure API Call
  const fetchSupplier = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${API}/suppliers/${id}`);
      if (response.data && response.data.supplier) {
        setSupplier(response.data.supplier);
      } else {
        setError("Supplier not found.");
      }
    } catch (err) {
      setError("Error fetching supplier details.");
      toast.error("Failed to fetch supplier details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSupplier();
  }, [fetchSupplier]);

  return (
    <main className="supplier-page">
      <Header />
      <section className="supplier-page-content">
        {loading ? (
          <p className="loading-message">Loading supplier details...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : supplier ? (
          <div className="supplier-card">
            <h1 className="supplier-title">{supplier?.supplierName} Supplier</h1>
            <p className="supplier-description">
              {supplier.supplierDescription || "No description available."}
            </p>

            <div className="supplier-info">
              <p>
                <strong>Email:</strong>{" "}
                {supplier?.supplierEmail || "Not provided"}
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                {supplier?.supplierPhone || "Not provided"}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {supplier?.supplierAddress || "Not provided"}
              </p>
              <p>
                <strong>Country:</strong> {supplier?.country || "Not specified"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {supplier?.isActive ? "🟢 Active" : "🔴 Inactive"}
              </p>
            </div>
          </div>
        ) : (
          <p className="no-data-message">Supplier not found.</p>
        )}
      </section>
      <Footer />
    </main>
  );
};

export default SupplierPage;
