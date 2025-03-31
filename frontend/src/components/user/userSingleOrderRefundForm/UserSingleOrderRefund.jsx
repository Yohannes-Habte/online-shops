import {
  Package,
  Palette,
  Ruler,
  Hash,
  Calendar,
  FileText,
  MessageSquareText,
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
};

const UserSingleOrderRefundForm = ({
  orderInfos,
  setOrderInfos,
  selectedProduct,
}) => {
  const [refundForm, setRefundForm] = useState({
    item: selectedProduct?._id || "",
    color: selectedProduct?.productColor || "",
    size: selectedProduct?.size || "",
    quantity: selectedProduct?.quantity || "",
    requestedDate: new Date().toISOString().split("T")[0],
    reason: "",
    otherReason: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Use effect to update the form when a new product is selected
  useEffect(() => {
    if (selectedProduct) {
      setRefundForm({
        item: selectedProduct?._id || "",
        color: selectedProduct?.productColor || "",
        size: selectedProduct?.size || "",
        quantity: selectedProduct?.quantity || "",
        requestedDate: new Date().toISOString().split("T")[0],
        reason: "",
        otherReason: "",
      });
    }
  }, [selectedProduct]);

  const handleRefundChange = (e) => {
    const { name, value } = e.target;
    setRefundForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateRefundForm = () => {
    const refundFormErrors = {};

    if (!refundForm.item.trim()) refundFormErrors.item = "Product is required.";
    if (!refundForm.color.trim()) refundFormErrors.color = "Color is required.";
    if (!refundForm.size.trim()) refundFormErrors.size = "Size is required.";

    if (
      !refundForm.quantity ||
      isNaN(refundForm.quantity) ||
      refundForm.quantity <= 0
    ) {
      refundFormErrors.quantity = "Please provide a valid quantity.";
    }

    if (!refundForm.requestedDate)
      refundFormErrors.requestedDate = "Please provide a valid date.";

    if (!refundForm.reason) refundFormErrors.reason = "Please select a reason.";
    if (refundForm.reason === "Other" && !refundForm.otherReason.trim()) {
      refundFormErrors.otherReason = "Please provide other reason.";
    }

    setErrors(refundFormErrors);
    return Object.keys(refundFormErrors).length === 0;
  };

  const refundRequestHandler = async (e) => {
    e.preventDefault();

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
        productId: refundForm.item,
        productColor: refundForm.color,
        productSize: refundForm.size,
        quantity: refundForm.quantity,
        requestedDate: refundForm.requestedDate,
        refundReason: refundForm.reason,
        otherReason: refundForm.otherReason,
        orderStatus: "Refund Requested",
      };

      const { data } = await axios.put(
        `${API}/orders/${orderInfos._id}/refund/request`,
        refundRequest,
        { withCredentials: true }
      );

      toast.success(data.message);
      setOrderInfos((prev) => ({ ...prev, orderStatus: "Refund Requested" }));
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
      <form
        onSubmit={refundRequestHandler}
        className="user-order-refund-request-form"
      >
        <div className="user-order-refund-request-form-inputs">
          {/* Product */}
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

          {/* Product Color */}
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

          {/* Product Size */}
          <div className="input-container">
            <label className="input-label">Color</label>
            <div className="input-with-icon">
              <Ruler className="input-icon" size={20} />
              <input
                type="text"
                name="size"
                value={refundForm.size}
                onChange={handleRefundChange}
                placeholder="Enter Size"
                className="input-field"
              />
            </div>
            {errors.size && <p className="error-msg">{errors.size}</p>}
          </div>

          {/* Product quantity */}
          <div className="input-container">
            <label className="input-label">Color</label>
            <div className="input-with-icon">
              <Hash className="input-icon" size={20} />
              <input
                type="text"
                name="quantity"
                value={refundForm.quantity}
                onChange={handleRefundChange}
                placeholder="Enter Quantity"
                className="input-field"
              />
            </div>
            {errors.quantity && <p className="error-msg">{errors.quantity}</p>}
          </div>

          {/* Requested Date */}
          <div className="input-container">
            <label className="input-label">Color</label>
            <div className="input-with-icon">
              <Calendar className="input-icon" size={20} />
              <input
                type="date"
                name="requestedDate"
                value={refundForm.requestedDate}
                onChange={handleRefundChange}
                placeholder="Enter Requested Date"
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
            <div className="input-with-icon">
              <FileText className="input-icon" size={20} />
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
            </div>
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
                cols={50}
                onChange={handleRefundChange}
                className="input-field"
                placeholder="Describe the reason"
              ></textarea>
              {errors.otherReason && (
                <p className="error-msg">{errors.otherReason}</p>
              )}
            </div>
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
