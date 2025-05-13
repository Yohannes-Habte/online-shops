import { useEffect, useState } from "react";
import "./UpdateOrderCancellation.scss";
import axios from "axios";
import { API } from "../../../utils/security/secreteKey";
import {
  DateField,
  SelectField,
  TextAreaField,
} from "../formFields/FormFields";
import { FaClipboardCheck, FaRegCommentDots } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";

const cancellationStatusOptions = ["Pending", "Approved", "Rejected"];

const initialState = {
  cancellationStatus: "",
  reviewerNotes: "",
  reviewedDate: new Date().toISOString().slice(0, 10),
  reviewer: "",
};

const UpdateOrderCancellation = ({ order, setShowCancellationReason }) => {
  const [cancellationData, setCancellationData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order) {
      setCancellationData((prevData) => ({
        ...prevData,
        orderId: order._id,
        reviewedDate: new Date().toISOString().slice(0, 10),
        reviewer: order.orderedItems[0].shop._id,
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

    if (!cancellationData.cancellationStatus) {
      newErrors.cancellationStatus = "Cancellation status is required.";
    }

    if (!cancellationData.reviewedDate) {
      newErrors.reviewedDate = "Reviewed date is required.";
    }

    if (!cancellationData.reviewerNotes) {
      newErrors.reviewerNotes = "Reviewer notes are required.";
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
    const updateCancellationData = {
      orderId: order._id,
      cancellationStatus: cancellationData.cancellationStatus,
      reviewerNotes: cancellationData.reviewerNotes,
      reviewedDate: cancellationData.reviewedDate,
      reviewer: order.orderedItems[0].shop._id,
    };

    try {
      const response = await axios.put(
        `${API}/cancellations/update`,
        updateCancellationData,
        { withCredentials: true }
      );

      if (response.status === 200 && response.data.success) {
        alert("Cancellation status updated successfully.");
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
            label="Cancellation Status"
            name="cancellationStatus"
            options={cancellationStatusOptions}
            value={cancellationData.cancellationStatus}
            onChange={handleChange}
            errors={errors}
            ariaLabel="Cancellation Status"
            icon={<FaClipboardCheck />}
          />

          <DateField
            label="Reviewed Date"
            name="reviewedDate"
            value={cancellationData.reviewedDate}
            onChange={handleChange}
            errors={errors}
            ariaLabel="Reviewed Date"
            icon={<MdDateRange />}
          />

          <TextAreaField
            label="Reviewer Notes"
            name="reviewerNotes"
            value={cancellationData.reviewerNotes}
            onChange={handleChange}
            errors={errors}
            ariaLabel="Reviewer Notes"
            placeholder={"Enter your notes here..."}
            icon={<FaRegCommentDots />}
          />

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

export default UpdateOrderCancellation;
