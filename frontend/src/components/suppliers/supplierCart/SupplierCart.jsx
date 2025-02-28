import "./SupplierCart.scss";

const SupplierCart = ({ supplier }) => {
  return (
    <section className="supplier-cart-container">
      <h2 className="supplier-name">{supplier.supplierName} Supplier</h2>
      {supplier.supplierDescription && <p className="description">{supplier.supplierDescription}</p>}
      <p className="email">📧 {supplier.supplierEmail || "No email provided"}</p>
      <p className="phone">📞 {supplier.supplierPhone || "No phone number"}</p>
      <p className="address">📍 {supplier.supplierAddress || "No address provided"}</p>
      <p className="country">🌍 {supplier.country || "Country not specified"}</p>
    </section>
  );
};

export default SupplierCart;
