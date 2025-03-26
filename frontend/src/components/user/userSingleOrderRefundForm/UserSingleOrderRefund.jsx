import {
  Package,
  Palette,
  Ruler,
  Hash,
  DollarSign,
  FileText,
} from "lucide-react";
import "./UserSingleOrderRefundForm.scss";
import { useState } from "react";
import { API } from "../../../utils/security/secreteKey";
import axios from "axios";
import { toast } from "react-toastify";

const refundRequestInitialState = {
  productTitle: "",
  productColor: "",
  productSize: "",
  quantity: "",
  productPrice: "",
  refundReason: "",
  refundAmount: "",
};

const UserSingleOrderRefundForm = ({ orderInfos, setOrderInfos }) => {
  const [refundForm, setRefundForm] = useState(refundRequestInitialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle refund request change
  const handleRefundChange = (e) => {
    const { name, value } = e.target;
    setRefundForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateRefundForm = () => {
    const refundFormErrors = {};

    if (!refundForm.productTitle.trim())
      refundFormErrors.productTitle = "Product title is required.";

    if (!refundForm.productColor.trim())
      refundFormErrors.productColor = "Product color is required.";

    if (!refundForm.productSize.trim())
      refundFormErrors.productSize = "Product size is required.";

    if (
      !refundForm.quantity ||
      isNaN(refundForm.quantity) ||
      refundForm.quantity <= 0
    ) {
      refundFormErrors.quantity = "Please provide a valid quantity.";
    }

    if (
      !refundForm.productPrice ||
      isNaN(refundForm.productPrice) ||
      refundForm.productPrice <= 0
    ) {
      refundFormErrors.productPrice = "Please provide a valid product price.";
    }

    if (!refundForm.refundReason.trim())
      refundFormErrors.refundReason = "Please provide a reason for the refund.";

    if (
      !refundForm.refundAmount ||
      isNaN(refundForm.refundAmount) ||
      refundForm.refundAmount <= 0
    ) {
      refundFormErrors.refundAmount = "Please provide a valid refund amount.";
    }

    setErrors(refundFormErrors);

    return Object.keys(refundFormErrors).length === 0;
  };

  // ==================================================================
  // Request refund handler
  // ==================================================================

  const refundHandler = async () => {
    if (!validateRefundForm()) {
      return toast.error("Please correct the errors in the form.");
    }

    const isConfirmed = window.confirm(
      "Are you sure you want to request a refund?"
    );
    if (!isConfirmed) return;

    try {
      setLoading(true);
      const refundRequest = {
        orderStatus: "Refund Requested",
        productTitle: refundForm.productTitle,
        productColor: refundForm.productColor,
        productSize: refundForm.productSize,
        quantity: refundForm.quantity,
        productPrice: refundForm.productPrice,
        refundReason: refundForm.refundReason,
        refundAmount: refundForm.refundAmount,
      };

      const { data } = await axios.put(
        `${API}/orders/${orderInfos._id}/refund/request`,
        refundRequest,
        { withCredentials: true }
      );

      toast.success(data.message);

      setOrderInfos((prev) => ({
        ...prev,
        orderStatus: "Refund Requested",
      }));
      setRefundForm(refundRequestInitialState);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="user-order-refund-request-form-container">
      <h2 className="user-order-refund-request-form-title">Request Refund</h2>
      <p className="user-order-refund-request-rules">
        You may request a refund for a single product per submission. To ensure
        a smooth process, provide accurate details, including the product title,
        color, size, quantity, price, refund amount, and reason. Please note
        that any discounts applied at the time of purchase will be deducted from
        the refund amount, and transportation costs are non-refundable.
        Double-check all information before submitting your request.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          refundHandler();
        }}
        className="user-order-refund-request-form"
      >
        <div className="user-order-refund-request-form-inputs">
          {/* Product Title */}
          <div className="input-container">
            <label className="input-label">Product Title</label>
            <div className="input-with-icon">
              <Package className="input-icon" size={20} />
              <input
                type="text"
                name="productTitle"
                value={refundForm.productTitle}
                onChange={handleRefundChange}
                placeholder="Enter product title"
                className="input-field"
              />
            </div>
            {errors.productTitle && (
              <p className="error-msg">{errors.productTitle}</p>
            )}
          </div>

          {/* Product Color */}
          <div className="input-container">
            <label className="input-label">Product Color</label>
            <div className="input-with-icon">
              <Palette className="input-icon" size={20} />
              <input
                type="text"
                name="productColor"
                value={refundForm.productColor}
                onChange={handleRefundChange}
                placeholder="Enter product color"
                className="input-field"
              />
            </div>
            {errors.productColor && (
              <p className="error-msg">{errors.productColor}</p>
            )}
          </div>

          {/* Product Size */}
          <div className="input-container">
            <label className="input-label">Product Size</label>
            <div className="input-with-icon">
              <Ruler className="input-icon" size={20} />
              <input
                type="text"
                name="productSize"
                value={refundForm.productSize}
                onChange={handleRefundChange}
                placeholder="Enter product size"
                className="input-field"
              />
            </div>
            {errors.productSize && (
              <p className="error-msg">{errors.productSize}</p>
            )}
          </div>

          {/* Quantity */}
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

          {/* Product Price */}
          <div className="input-container">
            <label className="input-label">Product Price</label>
            <div className="input-with-icon">
              <Hash className="input-icon" size={20} />
              <input
                type="number"
                name="productPrice"
                value={refundForm.productPrice}
                onChange={handleRefundChange}
                placeholder="Enter Price"
                className="input-field"
              />
            </div>
            {errors.productPrice && (
              <p className="error-msg">{errors.productPrice}</p>
            )}
          </div>

          {/* Refund Amount */}
          <div className="input-container">
            <label className="input-label">Refund Amount ($)</label>
            <div className="input-with-icon">
              <DollarSign className="input-icon" size={20} />
              <input
                type="number"
                name="refundAmount"
                value={refundForm.refundAmount}
                onChange={handleRefundChange}
                placeholder="Enter initial refund amount (Price * Quantity)"
                className="input-field"
              />
            </div>
            {errors.refundAmount && (
              <p className="error-msg">{errors.refundAmount}</p>
            )}
          </div>
        </div>

        {/* Refund Reason (textarea) */}
        <div className="textarea-container">
          <label className="input-label">Refund Reason</label>
          <div className="textarea-input-with-icon">
            <FileText className="input-icon" size={20} />
            <textarea
              name="refundReason"
              rows={5}
              value={refundForm.refundReason}
              onChange={handleRefundChange}
              placeholder="Please provide a detailed refund reason, including your order details for the specific product, such as Order ID, Order date, Product Name, Brand, Category, Subcategory, Color, Size, Quantity, Price, Total. Clearly explain the reason for your refund request to ensure smooth processing."
              className="input-field"
            />
          </div>
          {errors.refundReason && (
            <p className="error-msg">{errors.refundReason}</p>
          )}
        </div>

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
