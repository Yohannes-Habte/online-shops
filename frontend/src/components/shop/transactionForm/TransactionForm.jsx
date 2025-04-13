// TransactionForm.jsx
import { useState } from "react";
import "./TransactionForm.scss";

const initialState = {
  shop: "",
  order: "",
  amount: "",
  currency: "USD",
  method: "",
  paymentProvider: "",
  transactionType: "",
  platformFees: 0,
  transactionStatus: "Processing",
  failureReason: "",
  processedBy: "",
  processedAt: "",
};

const currencyOptions = ["USD", "EUR", "GBP", "INR", "JPY", "AUD"];
const methodOptions = ["Bank Transfer", "PayPal", "Stripe", "Crypto", "Cheque"];
const paymentProviderOptions = [
  "Bank Transfer",
  "PayPal",
  "Stripe",
  "Square",
  "Authorize.Net",
  "Razorpay",
  "Google Pay",
  "Apple Pay",
];
const transactionTypeOptions = ["Payout", "Refund", "Adjustment", "Withdrawal"];
const transactionStatusOptions = ["Processing", "Completed", "Failed", "Cancelled"];

const TransactionForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.shop) newErrors.shop = "Shop is required.";
    if (!formData.order) newErrors.order = "Order is required.";
    if (!formData.amount || isNaN(formData.amount)) newErrors.amount = "Valid amount is required.";
    if (!formData.method) newErrors.method = "Payment method is required.";
    if (!formData.paymentProvider) newErrors.paymentProvider = "Payment provider is required.";
    if (!formData.transactionType) newErrors.transactionType = "Transaction type is required.";
    if (!formData.processedBy) newErrors.processedBy = "Processed by (User ID) is required.";
    if (!formData.processedAt) newErrors.processedAt = "Processed date is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const finalData = {
      ...formData,
      amount: parseFloat(formData.amount),
      platformFees: parseFloat(formData.platformFees || 0),
      failureReason: formData.failureReason || null,
    };

    if (onSubmit) onSubmit(finalData);
    else console.log("Submitting transaction:", finalData);
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h2>Create Transaction</h2>

      <div className="form-group">
        <label>Shop ID</label>
        <input type="text" name="shop" value={formData.shop} onChange={handleChange} />
        {errors.shop && <span className="error">{errors.shop}</span>}
      </div>

      <div className="form-group">
        <label>Order ID</label>
        <input type="text" name="order" value={formData.order} onChange={handleChange} />
        {errors.order && <span className="error">{errors.order}</span>}
      </div>

      <div className="form-group">
        <label>Amount</label>
        <input type="number" name="amount" value={formData.amount} onChange={handleChange} />
        {errors.amount && <span className="error">{errors.amount}</span>}
      </div>

      <div className="form-group">
        <label>Currency</label>
        <select name="currency" value={formData.currency} onChange={handleChange}>
          {currencyOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Payment Method</label>
        <select name="method" value={formData.method} onChange={handleChange}>
          <option value="">Select method</option>
          {methodOptions.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        {errors.method && <span className="error">{errors.method}</span>}
      </div>

      <div className="form-group">
        <label>Payment Provider</label>
        <select name="paymentProvider" value={formData.paymentProvider} onChange={handleChange}>
          <option value="">Select provider</option>
          {paymentProviderOptions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        {errors.paymentProvider && <span className="error">{errors.paymentProvider}</span>}
      </div>

      <div className="form-group">
        <label>Transaction Type</label>
        <select name="transactionType" value={formData.transactionType} onChange={handleChange}>
          <option value="">Select type</option>
          {transactionTypeOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.transactionType && <span className="error">{errors.transactionType}</span>}
      </div>

      <div className="form-group">
        <label>Platform Fees</label>
        <input
          type="number"
          name="platformFees"
          value={formData.platformFees}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Status</label>
        <select name="transactionStatus" value={formData.transactionStatus} onChange={handleChange}>
          {transactionStatusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Failure Reason (if any)</label>
        <input
          type="text"
          name="failureReason"
          value={formData.failureReason}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Processed By (User ID)</label>
        <input type="text" name="processedBy" value={formData.processedBy} onChange={handleChange} />
        {errors.processedBy && <span className="error">{errors.processedBy}</span>}
      </div>

      <div className="form-group">
        <label>Processed At</label>
        <input
          type="datetime-local"
          name="processedAt"
          value={formData.processedAt}
          onChange={handleChange}
        />
        {errors.processedAt && <span className="error">{errors.processedAt}</span>}
      </div>

      <button type="submit" className="submit-btn">
        Submit Transaction
      </button>
    </form>
  );
};

export default TransactionForm;
