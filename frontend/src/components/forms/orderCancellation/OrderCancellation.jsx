import { useEffect, useState } from "react";
import "./OrderCancellation.scss";
import axios from "axios";
import { API } from "../../../utils/security/secreteKey";
import { SelectField, TextAreaField } from "../formFields/FormFields";
import { FaClipboardCheck, FaRegCommentDots } from "react-icons/fa";

const reasonEnum = [
  "Ordered by mistake",
  "Found a better price elsewhere",
  "Item arrived late",
  "Item not as described",
  "Item was damaged or defective",
  "Changed my mind",
  "Duplicate order",
  "Received the wrong item",
  "Billing or payment issue",
  "Other",
];

const initialState = {
  reason: "",
  otherReason: "",
};

const OrderCancellation = ({ order, setShowCancellationReason }) => {
  const [cancellationData, setCancellationData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order) {
      setCancellationData((prevData) => ({
        ...prevData,
        orderId: order._id,
        requestedBy: order.customer._id,
      }));
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCancellationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!cancellationData.reason) {
      newErrors.reason = "Cancellation reason is required.";
    } else if (
      cancellationData.reason === "Other" &&
      !cancellationData.otherReason
    ) {
      newErrors.otherReason = "Please specify the reason.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setCancellationData(initialState);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    // Prepare the cancellation data for submission
    const newCancellationData = {
      orderId: order._id,
      requestedBy: order.customer._id,
      reason: cancellationData.reason,
      otherReason:
        cancellationData.reason === "Other" ? cancellationData.otherReason : "",
      cancellationStatus: cancellationData.cancellationStatus,
    };

    try {
      const response = await axios.post(
        `${API}/cancellations/create`,
        newCancellationData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 201 && response.data.success) {
        alert("Cancellation request submitted successfully.");
        resetForm();
      } else {
        alert("Failed to submit/update cancellation request.");
      }
    } catch (error) {
      console.error(
        "Error submitting or updating cancellation request:",
        error
      );
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-cancellation-form-modal">
      <section className="order-cancellation-form-popup">
        <span
          onClick={() => setShowCancellationReason(false)}
          className="close-cancellation-modal"
        >
          X
        </span>
        <h2 className="order-cancellation-form-title">Order Cancellation</h2>
        <form className="order-cancellation-form" onSubmit={handleSubmit}>
          <SelectField
            label="Cancellation Reason"
            name="reason"
            options={reasonEnum}
            value={cancellationData.reason}
            onChange={handleChange}
            errors={errors}
            ariaLabel="Cancellation Reason"
            icon={<FaClipboardCheck />}
          />

          {cancellationData.reason === "Other" && (
            <TextAreaField
              label="Specify Reason"
              name="otherReason"
              value={cancellationData.otherReason}
              onChange={handleChange}
              errors={errors}
              ariaLabel="Specify Reason"
              placeholder={"Enter your reason here..."}
              icon={<FaRegCommentDots />}
            />
          )}

          <button
            type="submit"
            className="order-cancellation-form-btn"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Cancellation Request"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default OrderCancellation;
