import { useState } from "react";
import "./WithdrawalForm.scss";
import axios from "axios";
import {
  DateField,
  InputField,
  SelectField,
  TextAreaField,
} from "../formFields/FormFields";
import { API } from "../../../utils/security/secreteKey";
import { handleError } from "../../../utils/errorHandler/ErrorMessage";
import {
  FaRegCalendarAlt,
  FaDollarSign,
  FaCreditCard,
  FaUser,
  FaTruck,
  FaFileInvoice,
} from "react-icons/fa";
import { MdOutlineNotes } from "react-icons/md";
import { AiOutlineFileSearch } from "react-icons/ai";

const withdrawalOptions = [
  "Product Procurement",
  "Customer Reimbursement",
  "Operating Expenses",
  "Marketing & Advertising",
  "Corporate Donations",
  "Profit Distribution",
  "Vendor Disbursement",
  "Tax Obligations",
  "Employee Payroll",
  "Loan Repayment",
  "Capital Investment",
  "Platform Fees",
  "Subscription Payments",
  "Commission Payout",
  "Legal & Compliance Fees",
  "Insurance Premiums",
];

const initialState = {
  withdrawalPurpose: "",
  supplier: "",
  refundRequest: "",
  returnRequest: "",
  amount: 0,
  currency: "",
  method: "",
  notes: "",
  processedDate: new Date().toISOString().slice(0, 10),
  processedBy: "",
};

const WithdrawalForm = ({
  order,
  refundRequest,
  returnRequest,
  amount,
  setOpenWithdrawalForm,
}) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useState(() => {
    if (order) {
      setFormData((prev) => ({
        ...prev,
        refundRequest: refundRequest,
        returnRequest: returnRequest,
        amount: amount,
        currency: order.payment.currency,
        method: order.payment.method,
        processedDate: new Date().toISOString().slice(0, 10),
        processedBy: order.orderedItems[0].shop._id,
      }));
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.withdrawalPurpose)
      newErrors.withdrawalPurpose = "Purpose is Required";

    if (
      formData.withdrawalPurpose === "Product Procurement" &&
      !formData.supplier
    ) {
      newErrors.supplier = "Supplier is required for Product Procurement";
    }

    if (formData.withdrawalPurpose === "Customer Reimbursement") {
      if (!formData.refundRequest)
        newErrors.refundRequest = "RefundRequest ID required";
      if (!formData.returnRequest)
        newErrors.returnRequest = "ReturnRequest ID required";
    }

    if (!formData.amount || formData.amount <= 0)
      newErrors.amount = "Amount must be > 0";

    if (!formData.currency) newErrors.currency = "Currency is required";

    if (!formData.method) newErrors.method = "Payment method required";

    if (!formData.notes) newErrors.notes = "Notes required";

    if (!formData.processedDate)
      newErrors.processedDate = "Processed date required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialState);
    setErrors({});
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormLoading(true);
    setSuccessMessage("");

    try {
      const newWithdrawal = {
        ...formData,
        order: order._id,
      };
      const response = await axios.post(
        `${API}/withdrawals/create`,
        newWithdrawal,
        {
          withCredentials: true,
        }
      );
      if (response.status === 201 && response.data.success) {
        setSuccessMessage("Withdrawal request submitted successfully!");
        resetForm();
      } else {
        setErrors({ form: "Failed to submit withdrawal request." });
      }
    } catch (error) {
      const {errorMessage} = handleError(error);
      setErrors({
        form: errorMessage || "Failed to submit withdrawal request.",
      });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="withdrawal-form-modal">
      <section className="shop-withdrawal-form-popup">
        <span
          onClick={() => setOpenWithdrawalForm(false)}
          className="close-withdrawal-popup"
        >
          X
        </span>
        <h2 className="shop-withdrawal-form-title">
          Withdrawal Facilitation Form
        </h2>

        <form onSubmit={handleSubmit} className="withdrawal-form">
          {errors.form && <div className="error-msg">{errors.form}</div>}
          {successMessage && (
            <div className="success-msg">{successMessage}</div>
          )}
          <div className="form-inputs-wrapper">
            <SelectField
              label="Withdrawal Purpose"
              name="withdrawalPurpose"
              value={formData.withdrawalPurpose}
              options={withdrawalOptions}
              onChange={handleChange}
              errors={errors}
              ariaLabel={"Select withdrawal purpose"}
              icon={<FaFileInvoice />}
            />

            {formData.withdrawalPurpose === "Product Procurement" && (
              <InputField
                label="Supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                errors={errors}
                ariaLabel={"Enter supplier name"}
                icon={<FaTruck />}
              />
            )}

            {formData.withdrawalPurpose === "Customer Reimbursement" && (
              <>
                <InputField
                  label="Refund Request ID"
                  name="refundRequest"
                  value={formData.refundRequest}
                  onChange={handleChange}
                  errors={errors}
                  ariaLabel={"Enter refund request ID"}
                  icon={<AiOutlineFileSearch />}
                />

                <InputField
                  label="Return Request ID"
                  name="returnRequest"
                  value={formData.returnRequest}
                  onChange={handleChange}
                  errors={errors}
                  ariaLabel={"Enter return request ID"}
                  icon={<AiOutlineFileSearch />}
                />
              </>
            )}

            <InputField
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              errors={errors}
              ariaLabel={"Enter amount"}
              icon={<FaDollarSign />}
            />

            <InputField
              label="Currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              errors={errors}
              ariaLabel={"Enter currency"}
              icon={<FaDollarSign />}
            />

            <InputField
              label="Payment Method"
              name="method"
              value={formData.method}
              onChange={handleChange}
              errors={errors}
              ariaLabel={"Enter payment method"}
              icon={<FaCreditCard />}
            />

            <DateField
              label="Processed Date"
              name="processedDate"
              value={formData.processedDate}
              onChange={handleChange}
              errors={errors}
              ariaLabel={"Enter processed date"}
              icon={<FaRegCalendarAlt />}
            />

            <InputField
              label="Processed By"
              name="processedBy"
              value={formData.processedBy}
              onChange={handleChange}
              errors={errors}
              ariaLabel={"Enter processed by shop ID"}
              icon={<FaUser />}
            />
          </div>
          <TextAreaField
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            errors={errors}
            ariaLabel={"Enter notes"}
            icon={<MdOutlineNotes />}
          />

          <button
            className="withdrawal-form-btn"
            type="submit"
            disabled={formLoading}
          >
            {formLoading ? "Submitting..." : "Submit Withdrawal"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default WithdrawalForm;
