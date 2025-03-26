import { useState } from "react";
import "./SingleOrderRefundForm.scss";
import {
  Package,
  Palette,
  Ruler,
  Hash,
  DollarSign,
  FileText,
} from "lucide-react";
import axios from "axios";
import { API } from "../../../utils/security/secreteKey";
import { toast } from "react-toastify";

const initialState = {
  productTitle: "",
  productColor: "",
  productSize: "",
  quantity: "",
  productPrice: "",
  refundReason: "",
  refundAmount: "",
  userRefundId: "",
};
const SingleOrderRefundForm = ({ order }) => {
  const [refundForm, setRefundForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [processRefund, setProcessRefund] = useState(false);

  // Handle refund request change
  const handleRefundChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "refundAmount") {
      // Ensure the refund amount always has 2 decimal places
      formattedValue = parseFloat(value).toFixed(2);
    }

    setRefundForm((prev) => ({ ...prev, [name]: formattedValue }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateRefundForm = () => {
    const refundFormErrors = {};

    if (
      !refundForm.refundAmount ||
      isNaN(refundForm.refundAmount) ||
      parseFloat(refundForm.refundAmount) <= 0
    ) {
      refundFormErrors.refundAmount = "Please provide a valid refund amount.";
    }

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

  // Handle refund
  const handleShopOrderRefund = async (e) => {
    e.preventDefault();

    if (!validateRefundForm()) {
      return toast.error("Please correct the errors in the form.");
    }

    setProcessRefund(true);
    try {
      const newOrderRefund = {
        orderStatus: "Refunded",
        productTitle: refundForm.productTitle,
        productColor: refundForm.productColor,
        productSize: refundForm.productSize,
        quantity: refundForm.quantity,
        productPrice: refundForm.productPrice,
        refundReason: refundForm.refundReason,
        refundAmount: parseFloat(refundForm.refundAmount).toFixed(2), // Ensures proper decimal formatting
        userRefundId: refundForm.userRefundId,
      };
      const { data } = await axios.put(
        `${API}/orders/${order._id}/refund/completed`,
        newOrderRefund,
        {
          withCredentials: true,
        }
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error processing refund request"
      );
    } finally {
      setProcessRefund(false);
    }
  };

  return (
    <section className="shop-order-refund-form-container">
      <h2 className="shop-order-refund-form-title">Refund Order</h2>
      <form onSubmit={handleShopOrderRefund} className="shop-order-refund-form">
        {/* User Refund Request ID */}
        <div className="input-container">
          <label className="input-label">Refund Request ID</label>
          <div className="input-with-icon">
            <Package className="input-icon" size={20} />
            <input
              type="text"
              name="userRefundId"
              value={refundForm.userRefundId}
              onChange={handleRefundChange}
              placeholder="Enter refund request ID"
              className="input-field"
            />
          </div>
          {errors.userRefundId && (
            <p className="error-msg">{errors.userRefundId}</p>
          )}
        </div>
        <div className="shop-order-refund-form-inputs">
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
              placeholder="Enter reason for refund"
              className="input-field"
            />
          </div>
          {errors.refundReason && (
            <p className="error-msg">{errors.refundReason}</p>
          )}
        </div>

        <button type="submit" className="shop-order-refund-form-btn">
          {processRefund ? "Processing..." : "Process Refund"}
        </button>
      </form>
    </section>
  );
};

export default SingleOrderRefundForm;
