import { useEffect } from "react";
import "./AllSuppliers.scss";
import { toast } from "react-toastify";
import useFetchSuppliers from "../../hooks/useFetchSuppliers";
import SupplierCart from "./SupplierCart";

const AllSuppliers = () => {
  const { data, loading, error } = useFetchSuppliers("suppliers");

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <section className="all-suppliers-container">
      <h1 className="title">All Suppliers</h1>

      {loading ? (
        <p className="loading-message">Loading suppliers...</p>
      ) : data?.suppliers.length > 0 ? (
        <div className="suppliers-list">
          {data?.suppliers
            .filter((supplier) => supplier.isActive) // Display only active suppliers
            .map((supplier) => (
              <SupplierCart key={supplier._id} supplier={supplier} />
            ))}
        </div>
      ) : (
        <p className="no-suppliers-message">No active suppliers found.</p>
      )}
    </section>
  );
};

export default AllSuppliers;
