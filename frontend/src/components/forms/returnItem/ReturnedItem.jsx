import { useEffect, useState } from "react";
import "./ReturnedItem.scss";
import axios from "axios";
import { API } from "../../../utils/security/secreteKey";
import { FiCalendar, FiTag, FiDollarSign, FiRepeat } from "react-icons/fi";
import { FaRegCommentDots } from "react-icons/fa";
import { MdAssignmentReturn } from "react-icons/md";
import { Ban } from "lucide-react";
import {
  DateField,
  InputField,
  RadioField,
  SelectField,
  TextAreaField,
} from "../formFields/FormFields";

const productConditionOptions = ["New", "Used", "Damaged"];
const refundStatusOptions = ["Accepted", "Rejected"];

const initialState = {
  isProductReturned: "",
  condition: "",
  refundStatus: "",
  refundAmount: "",
  comments: "",
  processedDate: "",
  rejectedReason: "",
};

const ReturnedItemForm = ({
  order,
  refundRequest,
  product,
  refundRequestId,
  productColor,
  productSize,
  requestRefundReason,
  refundAmount,
  currency,
  method,
  returnedDate,
  processedBy,
  setOpenRefundForm,
}) => {
  const [returnForm, setReturnForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const formattedAmount = refundAmount?.toFixed(2) || "0.00";

    if (!returnForm.isProductReturned) {
      setReturnForm((prev) => ({
        ...prev,
        isProductReturned: returnForm.isProductReturned,
        condition: "",
        refundAmount: "0.00",
        processedDate: today,
      }));
      return;
    }

    if (returnForm.isProductReturned) {
      const { condition, refundStatus } = returnForm;

      if (condition === "New") {
        if (refundStatus === "Rejected") {
          setReturnForm((prev) => ({
            ...prev,
            refundAmount: formattedAmount,
            processedDate: today,
            refundStatus: "Rejected",
            rejectedReason: "Refund request declined due to time deadline.",
            comments: `Thank you for returning the product in excellent condition. However, it cannot be refunded due to time expiry date.`,
          }));
        } else {
          setReturnForm((prev) => ({
            ...prev,
            refundAmount: formattedAmount,
            processedDate: today,
            refundStatus: "Accepted",
            comments: `Thank you for returning the product in excellent condition. A refund of ${formattedAmount} ${currency} has been successfully processed.`,
          }));
        }
      }

      if (condition === "Used" || condition === "Damaged") {
        setReturnForm((prev) => ({
          ...prev,
          refundAmount: "0.00",
          processedDate: today,
          refundStatus: "Rejected",
          rejectedReason:
            "We are unable to process a refund due to the item's condition not meeting our return policy requirements.",
          comments: `We have received the returned item in ${condition.toLowerCase()} condition. Unfortunately, we are unable to issue a refund in this case. For further assistance, please contact our support team.`,
        }));
      }
    }
  }, [
    refundAmount,
    returnForm.isProductReturned,
    returnForm.condition,
    returnForm.refundStatus,
  ]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    let formattedValue = value;
    if (type === "number" && name === "refundAmount") {
      formattedValue = value ? parseFloat(value).toFixed(2) : "0.00";
    } else if (type === "radio") {
      formattedValue = value === "true";
    }

    setReturnForm((prev) => ({ ...prev, [name]: formattedValue }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (returnForm.isProductReturned === null) {
      newErrors.isProductReturned = "Product Returned status is required";
    }

    if (!returnForm.condition.trim()) {
      newErrors.condition = "Product returned condition is required.";
    }

    if (!returnForm.comments.trim()) {
      newErrors.comments = "Receiver comment is required.";
    }

    if (!returnForm.refundAmount.trim()) {
      newErrors.refundAmount = "Refund amount is required.";
    } else if (isNaN(returnForm.refundAmount)) {
      newErrors.refundAmount = "Refund amount must be a number.";
    } else if (returnForm.refundAmount <= 0) {
      newErrors.refundAmount = "Refund amount must be greater than 0.";
    }

    if (!returnForm.processedDate) {
      newErrors.processedDate = "Processed date is required.";
    }

    if (!returnForm.refundStatus) {
      newErrors.refundStatus = "Refund status is required.";
    }

    if (returnForm.refundStatus === "Rejected" && !returnForm.rejectedReason) {
      newErrors.rejectedReason = "Reason for rejection is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetReturnForm = () => {
    setReturnForm(initialState);
    setErrors({});
    setIsLoading(false);
    setIsSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const newReturnedItem = {
        ...returnForm,
        order,
        refundRequest,
        refundRequestId,
        returnedDate,
        refundAmount,
        processedBy,
        product,
        productColor,
        productSize,
        requestRefundReason,
        currency,
        method,
        rejectedReason:
          returnForm.refundStatus === "Rejected"
            ? returnForm.rejectedReason
            : null,
      };
      const response = await axios.post(
        `${API}/returns/create`,
        newReturnedItem,
        {
          withCredentials: true,
        }
      );
      if (response.status === 201 && response.data.success) {
        setIsSuccess(true);
        resetReturnForm();
      } else {
        setErrors({ server: "Failed to process the return request." });
      }
    } catch (error) {
      setErrors({ server: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="returned-item-form-modal-wrapper">
      <section className="returned-item-form-container">
        <span
          onClick={() => setOpenRefundForm(false)}
          className="close-return-item-form-modal"
        >
          X
        </span>
        <h2 className="returned-item-form-title">
          Return Merchandise Management
        </h2>

        {isSuccess && (
          <h3 className="returned-item-form-success">
            Returned item processed successfully.
          </h3>
        )}
        {errors.server && (
          <p className="form-error-message" role="alert">
            {errors.server}
          </p>
        )}

        <form onSubmit={handleSubmit} className="returned-item-form">
          <div className="form-radio-group-container">
            <label className="form-radio-title"> Is Product Returned?</label>
            <div className="form-radio-group-options-with-icon">
              <span className="return-form-radio-icon">
                <MdAssignmentReturn />
              </span>
              <div className="form-radio-group-options">
                <RadioField
                  label="Yes"
                  name="isProductReturned"
                  value="true"
                  checked={returnForm.isProductReturned === true}
                  onChange={handleChange}
                  errors={errors}
                />
                <RadioField
                  label="No"
                  name="isProductReturned"
                  value="false"
                  checked={returnForm.isProductReturned === false}
                  onChange={handleChange}
                  errors={errors}
                />
              </div>
            </div>
          </div>
          <div className="returned-item-form-fields-wrapper">
            <SelectField
              label="Product Condition"
              name="condition"
              value={returnForm.condition}
              onChange={handleChange}
              errors={errors}
              options={productConditionOptions}
              icon={<FiTag />}
            />

            <SelectField
              label="Refund Status"
              name="refundStatus"
              value={returnForm.refundStatus}
              onChange={handleChange}
              errors={errors}
              options={refundStatusOptions}
              icon={<FiRepeat />}
            />

            <InputField
              label="Refund Amount ($)"
              name="refundAmount"
              value={returnForm.refundAmount}
              onChange={handleChange}
              type="number"
              errors={errors}
              placeholder="0.00"
              icon={<FiDollarSign />}
            />

            <DateField
              label="Processed Date"
              name="processedDate"
              value={returnForm.processedDate}
              onChange={handleChange}
              errors={errors}
              icon={<FiCalendar />}
            />
          </div>

          {returnForm.refundStatus === "Rejected" && (
            <TextAreaField
              label="Reason for Rejection"
              name="rejectedReason"
              value={returnForm.rejectedReason}
              onChange={handleChange}
              errors={errors}
              placeholder="Enter reason for rejection"
              icon={<Ban />}
            />
          )}

          <TextAreaField
            label="Receiver Comments"
            name="comments"
            value={returnForm.comments}
            onChange={handleChange}
            errors={errors}
            placeholder="Enter any comments about the returned item"
            icon={<FaRegCommentDots />}
          />

          <button className="return-item-form-btn" disabled={isLoading}>
            {isLoading ? "Processing..." : "Update Return"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default ReturnedItemForm;
