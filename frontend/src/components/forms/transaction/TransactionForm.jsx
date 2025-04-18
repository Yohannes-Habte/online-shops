import { useEffect, useState } from "react";
import "./TransactionForm.scss";
import { toast } from "react-toastify";
import axios from "axios";
import { API } from "../../../utils/security/secreteKey";

const transactionOptions = ["Payout", "Refund", "Withdrawal", "Adjustment"];

const transactionStatusOptions = ["Processing", "Completed", "Cancelled"];

const adjustmentReasons = [
  "Order Reconciliation",
  "Manual Financial Adjustment",
  "Promotional Credit Issuance",
  "Operational Correction",
];

const initialState = {
  shop: "",
  transactionType: "",
  order: "",
  platformFees: "",
  refundRequest: "",
  withdrawal: "",
  adjustmentReason: "",
  adjustmentNotes: "",
  amount: "",
  currency: "",
  method: "",
  paymentProvider: "",
  transactionStatus: "Processing",
  cancelledReason: "",
  processedDate: new Date().toISOString().slice(0, 16),
  processedBy: "",
};

const TransactionForm = ({ setOpenTransaction, order }) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  console.log("TransactionForm order", order);

  const calculateShopCommission = (grandTotal) =>
    parseFloat((grandTotal * 0.01).toFixed(2));

  useEffect(() => {
    if (order) {
      setFormData((prev) => ({
        ...prev,
        shop: order?.orderedItems[0]?.shop?._id,
        order: order._id,
        amount: order?.grandTotal || "",
        platformFees: calculateShopCommission(order?.grandTotal),
        currency: order?.payment?.currency,
        method: order?.payment?.method,
        paymentProvider: order?.payment?.provider,
        processedBy: order?.customer?._id,
      }));
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.transactionType)
      newErrors.transactionType = "Transaction type is required";

    switch (formData.transactionType) {
      case "Payout":
        if (!formData.order)
          newErrors.order = "Order ID is required for Payout";
        if (formData.platformFees < 0)
          newErrors.platformFees = "Platform fees cannot be negative";
        break;
      case "Refund":
        if (!formData.refundRequest)
          newErrors.refundRequest = "Refund request ID is required";
        if (!formData.withdrawal)
          newErrors.withdrawal = "Withdrawal ID is required for Refund";
        break;
      case "Withdrawal":
        if (!formData.withdrawal)
          newErrors.withdrawal = "Withdrawal ID is required";
        break;
      case "Adjustment":
        if (!formData.adjustmentReason)
          newErrors.adjustmentReason = "Adjustment reason is required";
        if (!formData.adjustmentNotes)
          newErrors.adjustmentNotes = "Adjustment notes are required";
        break;
      default:
        break;
    }

    if (!formData.shop) newErrors.shop = "Shop is required";
    if (!formData.amount || Number(formData.amount) <= 0)
      newErrors.amount = "Enter a valid amount";
    if (!formData.currency) newErrors.currency = "Currency is required";
    if (!formData.method) newErrors.method = "Payment method is required";
    if (!formData.paymentProvider)
      newErrors.paymentProvider = "Payment provider is required";
    if (!formData.transactionStatus)
      newErrors.transactionStatus = "Transaction status is required";
    if (!formData.processedDate)
      newErrors.processedDate = "Processed date is required";
    if (!formData.processedBy)
      newErrors.processedBy = "Processed by (User ID) is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    try {
      const newTransaction = {
        shop: order?.orderedItems[0]?.shop?._id,
        transactionType: formData.transactionType,
        order: formData.order,
        platformFees: formData.platformFees,
        refundRequest: formData.refundRequest,
        withdrawal: formData.withdrawal,
        adjustmentReason: formData.adjustmentReason,
        adjustmentNotes: formData.adjustmentNotes,
        amount: formData.amount,
        currency: formData.currency,
        method: formData.method,
        paymentProvider: formData.paymentProvider,
        transactionStatus: formData.transactionStatus,
        cancelledReason: formData.cancelledReason,
        processedDate: formData.processedDate,
        processedBy: formData.processedBy,
      };
      const res = await axios.post(
        `${API}/transactions/create`,
        newTransaction,
        {
          withCredentials: true,
        }
      );
      if (res.status === 201) {
        toast.success("Transaction successfully created!");
        setFormData(initialState);
      }
      setOpenTransaction(false);
    } catch (error) {
      toast.error("Error: " + error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="shop-transaction-form-modal">
      <section className="shop-transaction-form-container">
        <span
          onClick={() => setOpenTransaction(false)}
          className="close-transaction-form-modal"
        >
          X
        </span>
        <h2 className="shop-transaction-form-title">Create New Transaction</h2>
        <form className="shop-transaction-form" onSubmit={handleSubmit}>
          {/* Transaction Type */}
          <div className="input-container">
            <label htmlFor="transactionType" className="input-label">
              Transaction Type
            </label>
            <select
              name="transactionType"
              value={formData.transactionType}
              onChange={handleChange}
              className={`input-field ${
                errors.transactionType ? "form-input-error" : ""
              }`}
            >
              <option value="">Select Type</option>
              {transactionOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.transactionType && (
              <p className="error-message">{errors.transactionType}</p>
            )}
          </div>

          {formData.transactionType === "Withdrawal" && (
            <InputField
              label="Withdrawal ID"
              name="withdrawal"
              value={formData.withdrawal}
              error={errors.withdrawal}
              handleChange={handleChange}
            />
          )}

          <div className="inputs-wrapper">
            {/* Conditional Fields */}
            {formData.transactionType === "Payout" && (
              <>
                <InputField
                  label="Order ID"
                  name="order"
                  value={formData.order}
                  error={errors.order}
                  handleChange={handleChange}
                />
                <InputField
                  label="Platform Fees"
                  name="platformFees"
                  type="number"
                  value={formData.platformFees}
                  error={errors.platformFees}
                  handleChange={handleChange}
                />
              </>
            )}

            {formData.transactionType === "Refund" && (
              <>
                <InputField
                  label="Refund Request ID"
                  name="refundRequest"
                  value={formData.refundRequest}
                  error={errors.refundRequest}
                  handleChange={handleChange}
                />
                <InputField
                  label="Withdrawal ID"
                  name="withdrawal"
                  value={formData.withdrawal}
                  error={errors.withdrawal}
                  handleChange={handleChange}
                />
              </>
            )}

            {formData.transactionType === "Adjustment" && (
              <>
                <div className="input-container">
                  <label htmlFor="adjustmentReason" className="input-label">
                    Adjustment Reason
                  </label>
                  <select
                    name="adjustmentReason"
                    value={formData.adjustmentReason}
                    onChange={handleChange}
                    className={`input-field ${
                      errors.adjustmentReason ? "form-input-error" : ""
                    }`}
                  >
                    <option value="">Select Reason</option>
                    {adjustmentReasons.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                  {errors.adjustmentReason && (
                    <p className="error-message">{errors.adjustmentReason}</p>
                  )}
                </div>
                <InputField
                  label="Adjustment Notes"
                  name="adjustmentNotes"
                  value={formData.adjustmentNotes}
                  error={errors.adjustmentNotes}
                  handleChange={handleChange}
                />
              </>
            )}

            {/* Common Fields */}
            <InputField
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              error={errors.amount}
              handleChange={handleChange}
            />
            <InputField
              label="Currency"
              name="currency"
              value={formData.currency}
              error={errors.currency}
              handleChange={handleChange}
            />
            <InputField
              label="Payment Method"
              name="method"
              value={formData.method}
              error={errors.method}
              handleChange={handleChange}
            />
            <InputField
              label="Payment Provider"
              name="paymentProvider"
              value={formData.paymentProvider}
              error={errors.paymentProvider}
              handleChange={handleChange}
            />

            <InputField
              label="Processed Date"
              name="processedDate"
              type="datetime-local"
              value={formData.processedDate}
              error={errors.processedDate}
              handleChange={handleChange}
            />
            <InputField
              label="Processed By (User ID)"
              name="processedBy"
              value={formData.processedBy}
              error={errors.processedBy}
              handleChange={handleChange}
            />
          </div>

          {/* Status */}
          <div className="input-container">
            <label htmlFor="transactionStatus" className="input-label">
              Transaction Status
            </label>
            <select
              name="transactionStatus"
              value={formData.transactionStatus}
              onChange={handleChange}
              className={`input-field ${
                errors.transactionStatus ? "form-input-error" : ""
              }`}
            >
              <option value="">Select Status</option>
              {transactionStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.transactionStatus && (
              <p className="error-message">{errors.transactionStatus}</p>
            )}
          </div>

          {formData.transactionStatus === "Cancelled" && (
            <div className="input-container">
              <label htmlFor="cancelledReason" className="input-label">
                Cancellation Reason
              </label>
              <textarea
                name="cancelledReason"
                rows="4"
                cols={30}
                value={formData.cancelledReason}
                onChange={handleChange}
                placeholder="Cancellation Reason"
                className={`input-field ${
                  errors.cancelledReason ? "form-input-error" : ""
                }`}
              ></textarea>
              {errors.cancelledReason && (
                <p className="error-message">{errors.cancelledReason}</p>
              )}
            </div>
          )}

          <button type="submit" className="submit-btn">
            Submit Transaction
          </button>
        </form>
      </section>
    </div>
  );
};

// 🔧 Reusable Input Field Component
const InputField = ({
  label,
  name,
  type = "text",
  value,
  handleChange,
  error,
}) => (
  <div className="input-container">
    <label htmlFor={name} className="input-label">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={handleChange}
      placeholder={`Enter ${label}`}
      className={`input-field ${error ? "form-input-error" : ""}`}
    />
    {error && <p className="error-message">{error}</p>}
  </div>
);

export default TransactionForm;
