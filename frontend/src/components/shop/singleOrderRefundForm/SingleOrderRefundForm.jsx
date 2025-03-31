import { useEffect, useState } from "react";
import "./SingleOrderRefundForm.scss";
import {
  MessageCircle,
  CheckCircle,
  Calendar,
  DollarSign,
  Tag,
  Box,
} from "lucide-react";
import axios from "axios";
import { API } from "../../../utils/security/secreteKey";
import { toast } from "react-toastify";

const SingleOrderRefundForm = ({ order, selectedRefundRequestId }) => {
  const [refundForm, setRefundForm] = useState({
    refundRequestIdLinked: selectedRefundRequestId || "",
    isProductReturned: null,
    returnedDate: "",
    condition: "",
    comments: "",
    refundAmount: "",
    processedDate: "",
    refundStatus: "",
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (selectedRefundRequestId) {
      setRefundForm((prev) => ({
        ...prev,
        refundRequestIdLinked: selectedRefundRequestId,
      }));
    }
  }, [selectedRefundRequestId]);

  const sellerId = order.orderedItems[0].shop._id;

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    let formattedValue = value;
    if (type === "number" && name === "refundAmount") {
      formattedValue = value ? parseFloat(value).toFixed(2) : "0.00";
    } else if (type === "radio") {
      formattedValue = value === "true";
    }

    setRefundForm((prev) => ({ ...prev, [name]: formattedValue }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const formErrors = {};
    if (!refundForm.refundRequestIdLinked.trim())
      formErrors.refundRequestIdLinked = "Refund request ID is required.";
    if (refundForm.isProductReturned === null)
      formErrors.isProductReturned =
        "Please select if the product is returned.";
    if (refundForm.isProductReturned && !refundForm.returnedDate)
      formErrors.returnedDate = "Return date is required.";
    if (!refundForm.condition.trim())
      formErrors.condition = "Product condition is required.";
    if (!refundForm.refundStatus.trim())
      formErrors.refundStatus = "Refund status is required.";
    if (!refundForm.comments.trim())
      formErrors.comments = "Receiver comment is required.";

    if (!refundForm.refundAmount.trim()) {
      formErrors.refundAmount = "Refund amount is required.";
    } else if (isNaN(refundForm.refundAmount)) {
      formErrors.refundAmount = "Refund amount must be a number.";
    } else if (refundForm.refundAmount <= 0) {
      formErrors.refundAmount = "Refund amount must be greater than 0.";
    }

    if (!refundForm.processedDate)
      formErrors.processedDate = "Processed date is required.";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // Reset form state
  const resetForm = () => {
    setRefundForm({
      refundRequestIdLinked: "",
      isProductReturned: null,
      returnedDate: "",
      condition: "",
      comments: "",
      refundAmount: "",
      processedDate: "",
      refundStatus: "",
    });
    setErrors({});
  };

  const handleRefundSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm())
      return toast.error("Please correct the errors before submitting.");

    setIsProcessing(true);

    try {
      const refundData = {
        refundRequestIdLinked: refundForm.refundRequestIdLinked,
        isProductReturned: refundForm.isProductReturned,
        returnedDate: refundForm.returnedDate,
        condition: refundForm.condition,
        comments: refundForm.comments,
        refundAmount: refundForm.refundAmount,
        processedDate: refundForm.processedDate,
        refundStatus: refundForm.refundStatus,
        processedBy: sellerId,
      };
      const { data } = await axios.put(
        `${API}/orders/${order._id}/refund/completed`,
        refundData,
        { withCredentials: true }
      );
      toast.success(data.message);
      resetForm();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error processing refund request."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="shop-order-refund-form-container">
      <h2 className="shop-order-refund-form-title">Refund Order</h2>
      <form onSubmit={handleRefundSubmit} className="shop-order-refund-form">
        <div className="shop-order-refund-request-form-inputs">
          {/* Refund Request ID */}
          <div className="input-container">
            <label className="input-label">Refund Request Id</label>
            <div className="input-with-icon">
              <Tag className="input-icon" size={20} />
              <input
                type="text"
                name="refundRequestIdLinked"
                value={refundForm.refundRequestIdLinked}
                onChange={handleChange}
                placeholder="Enter refund request ID"
                className="input-field"
              />
            </div>
            {errors.refundRequestIdLinked && (
              <p className="error-msg">{errors.refundRequestIdLinked}</p>
            )}
          </div>

          {/* Is Product Returned */}
          <div className="input-container radio-container">
            <label className="input-label">Is Product Returned?</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="isProductReturned"
                  value="true"
                  checked={refundForm.isProductReturned === true}
                  onChange={handleChange}
                  className="radio-input"
                />
                Yes
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="isProductReturned"
                  value="false"
                  checked={refundForm.isProductReturned === false}
                  onChange={handleChange}
                  className="radio-input"
                />
                No
              </label>
            </div>
            {errors.isProductReturned && (
              <p className="error-msg">{errors.isProductReturned}</p>
            )}
          </div>

          {/* Return Date */}
          {refundForm.isProductReturned && (
            <div className="input-container">
              <label className="input-label">Return Date</label>
              <div className="input-with-icon">
                <Calendar className="input-icon" size={20} />
                <input
                  type="date"
                  name="returnedDate"
                  value={refundForm.returnedDate}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              {errors.returnedDate && (
                <p className="error-msg">{errors.returnedDate}</p>
              )}
            </div>
          )}

          {/* Product Condition */}
          <div className="input-container">
            <label className="input-label">Select Product Condition</label>
            <div className="input-with-icon">
              <Box className="input-icon" size={20} />
              <select
                name="condition"
                value={refundForm.condition}
                onChange={handleChange}
                className="input-field"
              >
                <option value="" disabled>
                  Select Product Condition
                </option>
                <option value="New">New</option>
                <option value="Used">Used</option>
                <option value="Damaged">Damaged</option>
              </select>
            </div>
            {errors.condition && (
              <p className="error-msg">{errors.condition}</p>
            )}
          </div>

          {/* Processed Date */}
          <div className="input-container">
            <label className="input-label">Processed Date</label>
            <div className="input-with-icon">
              <Calendar className="input-icon" size={20} />
              <input
                type="date"
                name="processedDate"
                value={refundForm.processedDate}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            {errors.processedDate && (
              <p className="error-msg">{errors.processedDate}</p>
            )}
          </div>

          {/* Refund Status */}
          <div className="input-container">
            <label className="input-label">Refund Status</label>
            <div className="input-with-icon">
              <CheckCircle className="input-icon" size={20} />
              <select
                name="refundStatus"
                value={refundForm.refundStatus}
                onChange={handleChange}
                className="input-field"
              >
                <option value="" disabled>
                  Select Refund Status
                </option>
                {refundForm.isProductReturned === false ? (
                  <option value="Pending">Pending</option>
                ) : refundForm.isProductReturned === true &&
                  refundForm.condition === "New" ? (
                  <option value="Accepted">Accepted</option>
                ) : (
                  <>
                    <option value="Processing">Processing</option>
                    <option value="Rejected">Rejected</option>
                  </>
                )}
              </select>
            </div>
            {errors.refundStatus && (
              <p className="error-msg">{errors.refundStatus}</p>
            )}
          </div>

          {/* Refund Amount */}
          <div className="input-container">
            <label className="input-label">Refund Amount</label>
            <div className="input-with-icon">
              <DollarSign className="input-icon" size={20} />
              <input
                type="number"
                name="refundAmount"
                value={refundForm.refundAmount}
                onChange={handleChange}
                placeholder="Enter refund amount"
                className="input-field"
              />
            </div>
            {errors.refundAmount && (
              <p className="error-msg">{errors.refundAmount}</p>
            )}
          </div>
        </div>

        {/* Comments */}
        <div className="textarea-container">
          <label className="input-label">Other Reason</label>
          <div className="textarea-input-with-icon">
            <MessageCircle className="input-icon" size={20} />
            <textarea
              name="comments"
              value={refundForm.comments}
              rows={4}
              onChange={handleChange}
              className="input-field"
              placeholder="Describe the reason"
            ></textarea>
          </div>
          {errors.comments && <p className="error-msg">{errors.comments}</p>}
        </div>

        <button
          type="submit"
          className="shop-order-refund-form-btn"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Process Refund"}
        </button>
      </form>
    </section>
  );
};

export default SingleOrderRefundForm;
