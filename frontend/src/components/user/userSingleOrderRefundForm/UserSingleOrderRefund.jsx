import {
  Package,
  Palette,
  Ruler,
  Hash,
  Calendar,
  FileText,
  MessageSquareText,
  Banknote,
  Mail,
  User,
} from "lucide-react";

import "./UserSingleOrderRefundForm.scss";
import { useEffect, useState } from "react";
import { API } from "../../../utils/security/secreteKey";
import axios from "axios";
import { toast } from "react-toastify";

const refundRequestInitialState = {
  item: "",
  color: "",
  size: "",
  quantity: "",
  requestedDate: new Date().toISOString().split("T")[0],
  reason: "",
  otherReason: "",
  refundAmount: "",
  currency: "USD",
  method: "",
  bankDetails: {
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    bankBranch: "",
    bankAddress: "",
    bankCity: "",
    bankState: "",
    bankZipCode: "",
    bankCountry: "",
    swiftCode: "",
    IBAN: "",
    BIC: "",
    regionalCodes: {},
  },
  email: "",
  cryptoDetails: {
    network: "",
    token: "",
    walletAddress: "",
    tagOrMemo: "",
  },
  chequeRecipient: "",
  notes: "",
};

const UserSingleOrderRefundForm = ({
  orderInfos,
  setOrderInfos,
  selectedProduct,
}) => {
  const [refundForm, setRefundForm] = useState(refundRequestInitialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      setRefundForm((prev) => ({
        ...prev,
        item: selectedProduct._id,
        color: selectedProduct.productColor,
        size: selectedProduct.size,
        quantity: selectedProduct.quantity,
        requestedDate: new Date().toISOString().split("T")[0],
      }));
    }
  }, [selectedProduct]);

  const handleRefundChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("bankDetails.")) {
      const field = name.split(".")[1];
      setRefundForm((prev) => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [field]: value,
        },
      }));
    } else {
      setRefundForm((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateRefundForm = () => {
    const refundFormErrors = {};
    const requiredBankFields = [
      "accountHolderName",
      "accountNumber",
      "bankName",
      "bankBranch",
      "bankAddress",
      "bankCity",
      "bankState",
      "bankZipCode",
      "bankCountry",
    ];

    if (!refundForm.item) refundFormErrors.item = "Product is required.";
    if (!refundForm.color) refundFormErrors.color = "Color is required.";
    if (!refundForm.size) refundFormErrors.size = "Size is required.";
    if (
      !refundForm.quantity ||
      isNaN(refundForm.quantity) ||
      refundForm.quantity <= 0
    ) {
      refundFormErrors.quantity = "Valid quantity is required.";
    }
    if (!refundForm.requestedDate)
      refundFormErrors.requestedDate = "Date is required.";
    if (!refundForm.reason)
      refundFormErrors.reason = "Refund reason is required.";
    if (refundForm.reason === "Other" && !refundForm.otherReason.trim()) {
      refundFormErrors.otherReason = "Please describe your reason.";
    }

    if (!refundForm.method) refundFormErrors.method = "Select refund method.";

    if (refundForm.method === "Bank Transfer") {
      requiredBankFields.forEach((field) => {
        if (!refundForm.bankDetails[field]) {
          refundFormErrors[`bankDetails.${field}`] = `${field} is required.`;
        }
      });
    }

    if (["PayPal", "Stripe"].includes(refundForm.method) && !refundForm.email) {
      refundFormErrors.email = "Email is required for PayPal or Stripe.";
    }

    if (refundForm.method === "Cheque" && !refundForm.chequeRecipient) {
      refundFormErrors.chequeRecipient =
        "Recipient name is required for cheque.";
    }

    setErrors(refundFormErrors);
    return Object.keys(refundFormErrors).length === 0;
  };

  const refundRequestHandler = async (e) => {
    e.preventDefault();

    if (!validateRefundForm()) {
      return toast.error("Please correct the form errors.");
    }

    const isConfirmed = window.confirm(
      "Are you sure you want to submit the refund request?"
    );
    if (!isConfirmed) return;

    try {
      setLoading(true);
      const payload = {
        order: orderInfos._id,
        product: refundForm.item,
        productColor: refundForm.color,
        productSize: refundForm.size,
        productQuantity: refundForm.quantity,
        requestedDate: refundForm.requestedDate,
        requestRefundReason: refundForm.reason,
        otherReason: refundForm.otherReason,
        requestedRefundAmount: refundForm.refundAmount,
        currency: refundForm.currency,
        method: refundForm.method,
        bankDetails:
          refundForm.method === "Bank Transfer"
            ? refundForm.bankDetails
            : undefined,
        email: ["PayPal", "Stripe"].includes(refundForm.method)
          ? refundForm.email
          : undefined,
        chequeRecipient:
          refundForm.method === "Cheque"
            ? refundForm.chequeRecipient
            : undefined,
        notes: refundForm.notes,
      };

      const { data } = await axios.put(
        `${API}/orders/${orderInfos._id}/refund/request`,
        payload,
        { withCredentials: true }
      );

      toast.success(data.message);
      setOrderInfos((prev) => ({ ...prev, orderStatus: "Refund Requested" }));
      setRefundForm(refundRequestInitialState);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="user-order-refund-request-form-container">
      <h2 className="user-order-refund-request-form-title">Request Refund</h2>
      <form
        onSubmit={refundRequestHandler}
        className="user-order-refund-request-form"
      >
        <div className="user-order-refund-request-form-inputs">
          {/* Product, Color, Size, Quantity, Requested Date */}
          <div className="input-container">
            <label className="input-label">Product</label>
            <div className="input-with-icon">
              <Package className="input-icon" size={20} />
              <input
                type="text"
                name="item"
                value={refundForm.item}
                onChange={handleRefundChange}
                placeholder="Enter product"
                className="input-field"
              />
            </div>
            {errors.item && <p className="error-msg">{errors.item}</p>}
          </div>

          <div className="input-container">
            <label className="input-label">Color</label>
            <div className="input-with-icon">
              <Palette className="input-icon" size={20} />
              <input
                type="text"
                name="color"
                value={refundForm.color}
                onChange={handleRefundChange}
                placeholder="Enter color"
                className="input-field"
              />
            </div>
            {errors.color && <p className="error-msg">{errors.color}</p>}
          </div>

          <div className="input-container">
            <label className="input-label">Size</label>
            <div className="input-with-icon">
              <Ruler className="input-icon" size={20} />
              <input
                type="text"
                name="size"
                value={refundForm.size}
                onChange={handleRefundChange}
                placeholder="Enter size"
                className="input-field"
              />
            </div>
            {errors.size && <p className="error-msg">{errors.size}</p>}
          </div>

          <div className="input-container">
            <label className="input-label">Quantity</label>
            <div className="input-with-icon">
              <Hash className="input-icon" size={20} />
              <input
                type="number"
                name="quantity"
                value={refundForm.quantity}
                onChange={handleRefundChange}
                placeholder="Enter quantity"
                className="input-field"
              />
            </div>
            {errors.quantity && <p className="error-msg">{errors.quantity}</p>}
          </div>

          <div className="input-container">
            <label className="input-label">Requested Date</label>
            <div className="input-with-icon">
              <Calendar className="input-icon" size={20} />
              <input
                type="date"
                name="requestedDate"
                value={refundForm.requestedDate}
                onChange={handleRefundChange}
                className="input-field"
              />
            </div>
            {errors.requestedDate && (
              <p className="error-msg">{errors.requestedDate}</p>
            )}
          </div>

          {/* Reason */}
          <div className="input-container">
            <label className="input-label">Reason for Refund</label>
            <select
              name="reason"
              value={refundForm.reason}
              onChange={handleRefundChange}
              className="input-field"
            >
              <option value="">Select Reason</option>
              <option value="Damaged or Faulty Product">
                Damaged or Faulty Product
              </option>
              <option value="Incorrect Item Received">
                Incorrect Item Received
              </option>
              <option value="Size or Fit Issue">Size or Fit Issue</option>
              <option value="Product Not as Described">
                Product Not as Described
              </option>
              <option value="Changed My Mind">Changed My Mind</option>
              <option value="Other">Other</option>
            </select>
            {errors.reason && <p className="error-msg">{errors.reason}</p>}
          </div>
        </div>

        {/* Other Reason */}
        {refundForm.reason === "Other" && (
          <div className="textarea-container">
            <label className="input-label">Other Reason</label>
            <div className="textarea-input-with-icon">
              <MessageSquareText className="input-icon" size={20} />
              <textarea
                name="otherReason"
                value={refundForm.otherReason}
                rows={4}
                onChange={handleRefundChange}
                placeholder="Describe the reason"
                className="input-field"
              />
              {errors.otherReason && (
                <p className="error-msg">{errors.otherReason}</p>
              )}
            </div>
          </div>
        )}

        <div className="input-container">
          <label className="input-label">Refund Method</label>
          <select
            name="method"
            value={refundForm.method}
            onChange={handleRefundChange}
            className="input-field"
          >
            <option value="">Select Refund Method</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="PayPal">PayPal</option>
            <option value="Stripe">Stripe</option>
            <option value="Crypto">Crypto</option>
            <option value="Cheque">Cheque</option>
          </select>
          {errors.method && <p className="error-msg">{errors.method}</p>}
        </div>

        {refundForm.method === "Bank Transfer" && (
          <div className="bank-details-section">
            <h3>Bank Details</h3>
            {Object.entries(refundForm.bankDetails).map(([key, val]) => (
              <div key={key} className="input-container">
                <label className="input-label">{key}</label>
                <input
                  type="text"
                  name={`bankDetails.${key}`}
                  value={val}
                  onChange={handleRefundChange}
                  className="input-field"
                  placeholder={`Enter ${key}`}
                />
                {errors[`bankDetails.${key}`] && (
                  <p className="error-msg">{errors[`bankDetails.${key}`]}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {["PayPal", "Stripe"].includes(refundForm.method) && (
          <div className="input-container">
            <label className="input-label">Email</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                name="email"
                value={refundForm.email}
                onChange={handleRefundChange}
                className="input-field"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <p className="error-msg">{errors.email}</p>}
          </div>
        )}

        {refundForm.method === "Cheque" && (
          <div className="input-container">
            <label className="input-label">Cheque Recipient</label>
            <div className="input-with-icon">
              <User className="input-icon" size={20} />
              <input
                type="text"
                name="chequeRecipient"
                value={refundForm.chequeRecipient}
                onChange={handleRefundChange}
                className="input-field"
                placeholder="Enter recipient's full name"
              />
            </div>
            {errors.chequeRecipient && (
              <p className="error-msg">{errors.chequeRecipient}</p>
            )}
          </div>
        )}

        <button
          className="user-order-refund-request-form-btn"
          type="submit"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Refund Request"}
        </button>
      </form>
    </section>
  );
};

export default UserSingleOrderRefundForm;
