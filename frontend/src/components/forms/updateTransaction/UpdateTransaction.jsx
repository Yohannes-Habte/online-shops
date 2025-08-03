import { useEffect, useState } from "react";
import "./UpdateTransaction.scss";
import { toast } from "react-toastify";
import axios from "axios";
import { API } from "../../../utils/security/secreteKey";
import {
  DateField,
  InputField,
  SelectField,
  TextAreaField,
} from "../formFields/FormFields";

import {
  FaExchangeAlt,
  FaShoppingCart,
  FaMoneyCheckAlt,
  FaUndo,
  FaBoxOpen,
  FaPiggyBank,
  FaBalanceScale,
  FaStickyNote,
  FaDollarSign,
  FaCreditCard,
  FaBuilding,
  FaCalendarAlt,
  FaUserCheck,
  FaFlag,
  FaTimesCircle,
} from "react-icons/fa";

const transactionOptions = ["Payout", "Refund", "Withdrawal", "Adjustment"];

const transactionStatusOptions = ["Processing", "Completed", "Cancelled"];

const adjustmentReasons = [
  "Order Reconciliation",
  "Manual Financial Adjustment",
  "Promotional Credit Issuance",
  "Operational Correction",
];

const initialState = {
  transactionType: "",
  order: "",
  platformFees: "",
  refundRequest: "",
  returnedItem: "",
  withdrawal: "",
  adjustmentReason: "",
  adjustmentNotes: "",
  amount: "",
  currency: "",
  method: "",
  paymentProvider: "",
  transactionStatus: "",
  cancelledReason: "",
  processedDate: new Date().toISOString().slice(0, 10),
  processedBy: "",
};

const UpdateTransaction = ({
  setOpenUpdateTransaction,
  order,
  transactionId,
  currentTransactionType,
  currentTransactionStatus,
}) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const calculateShopCommission = (grandTotal) =>
    parseFloat((grandTotal * 0.01).toFixed(2));

  useEffect(() => {
    if (transactionId) {
      setFormData((prev) => ({
        ...prev,
        shop: order?.orderedItem?.shop?._id,
        order: order._id,
        amount: order?.grandTotal || "",
        platformFees: calculateShopCommission(order?.grandTotal || 0),
        refundRequest: order?.refundRequest?._id || "",
        returnedItem: order?.returnedItem?._id || "",
        currency: order?.payment?.currency || "",
        method: order?.payment?.method || "",
        paymentProvider: order?.payment?.provider || "",
        processedBy: order?.customer?._id || "",
        processedDate: new Date().toISOString().slice(0, 10),
      }));
    }
  }, [order, transactionId, currentTransactionType, currentTransactionStatus]);

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
        if (!formData.returnedItem)
          newErrors.returnedItem = "Returned item ID is required";
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

    const transactionPayload = {
      shop: order?.orderedItems[0]?.shop?._id,
      transactionType: formData.transactionType,
      order: formData.order,
      platformFees: formData.platformFees,
      refundRequest: formData.refundRequest,
      returnedItem: formData.returnedItem,
      withdrawal: formData.withdrawal,
      adjustmentReason: formData.adjustmentReason,
      adjustmentNotes: formData.adjustmentNotes,
      amount: order?.grandTotal || formData.amount,
      currency: formData.currency,
      method: formData.method,
      paymentProvider: formData.paymentProvider,
      transactionStatus: formData.transactionStatus,
      cancelledReason: formData.cancelledReason,
      processedDate: formData.processedDate,
      processedBy: formData.processedBy,
    };

    try {
      // If an existing transaction is being updated, include its ID
      if (transactionId) {
        const res = await axios.put(
          `${API}/transactions/${transactionId}`,
          transactionPayload,
          { withCredentials: true }
        );

        if (res.status === 200) {
          toast.success("Transaction updated successfully!");
        }
      }
      setOpenUpdateTransaction(false);
    } catch (error) {
      toast.error("Error: " + error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className="shop-transaction-form-modal">
      <section className="shop-transaction-form-container">
        <span
          onClick={() => setOpenUpdateTransaction(false)}
          className="close-transaction-form-modal"
        >
          X
        </span>
        <h2 className="shop-transaction-form-title">Create New Transaction</h2>
        <form className="shop-transaction-form" onSubmit={handleSubmit}>
          {/* Transaction Type */}
          <SelectField
            label="Transaction Type"
            name="transactionType"
            value={formData.transactionType}
            options={transactionOptions}
            onChange={handleChange}
            errors={errors}
            ariaLabel={"Transaction Type"}
            icon={<FaExchangeAlt />}
          />

          {formData.transactionType === "Withdrawal" && (
            <InputField
              label="Withdrawal ID"
              name="withdrawal"
              value={formData.withdrawal}
              onChange={handleChange}
              errors={errors}
              placeholder="Withdrawal ID"
              readOnly={true}
              icon={<FaPiggyBank />}
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
                  onChange={handleChange}
                  errors={errors}
                  placeholder="Order ID"
                  readOnly={true}
                  icon={<FaShoppingCart />}
                />
                <InputField
                  label="Platform Fees"
                  name="platformFees"
                  type="number"
                  value={formData.platformFees}
                  onChange={handleChange}
                  errors={errors}
                  placeholder="Platform Fees"
                  readOnly={true}
                  icon={<FaMoneyCheckAlt />}
                />
              </>
            )}

            {formData.transactionType === "Refund" && (
              <>
                <InputField
                  label="Refund Request ID"
                  name="refundRequest"
                  value={formData.refundRequest}
                  onChange={handleChange}
                  errors={errors}
                  placeholder="Refund Request ID"
                  readOnly={true}
                  icon={<FaUndo />}
                />

                <InputField
                  label="Returned Item ID"
                  name="returnedItem"
                  value={formData.returnedItem}
                  onChange={handleChange}
                  errors={errors}
                  placeholder="Returned Item ID"
                  readOnly={true}
                  icon={<FaBoxOpen />}
                />

                <InputField
                  label="Withdrawal ID"
                  name="withdrawal"
                  value={formData.withdrawal}
                  onChange={handleChange}
                  errors={errors}
                  placeholder="Withdrawal ID"
                  readOnly={true}
                  icon={<FaPiggyBank />}
                />
              </>
            )}

            {formData.transactionType === "Adjustment" && (
              <>
                <SelectField
                  label="Adjustment Reason"
                  name="adjustmentReason"
                  value={formData.adjustmentReason}
                  options={adjustmentReasons}
                  onChange={handleChange}
                  errors={errors}
                  ariaLabel={"Adjustment Reason"}
                  icon={<FaBalanceScale />}
                />

                <InputField
                  label="Adjustment Notes"
                  name="adjustmentNotes"
                  value={formData.adjustmentNotes}
                  errors={errors}
                  onChange={handleChange}
                  placeholder="Adjustment Notes"
                  ariaLabel={"Adjustment Notes"}
                  icon={<FaStickyNote />}
                />
              </>
            )}

            {/* Common Fields */}
            <InputField
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              errors={errors}
              onChange={handleChange}
              placeholder="Transaction Amount"
              icon={<FaDollarSign />}
            />
            <InputField
              label="Currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              errors={errors}
              placeholder="Currency"
              readOnly={true}
              icon={<FaDollarSign />}
            />
            <InputField
              label="Payment Method"
              name="method"
              value={formData.method}
              onChange={handleChange}
              errors={errors}
              placeholder="Payment Method"
              readOnly={true}
              icon={<FaCreditCard />}
            />
            <InputField
              label="Payment Provider"
              name="paymentProvider"
              value={formData.paymentProvider}
              onChange={handleChange}
              errors={errors}
              placeholder="Payment Provider"
              readOnly={true}
              icon={<FaBuilding />}
            />

            <DateField
              label="Processed Date"
              name="processedDate"
              value={formData.processedDate}
              onChange={handleChange}
              errors={errors}
              ariaLabel={"Processed Date"}
              readOnly={true}
              icon={<FaCalendarAlt />}
            />

            <InputField
              label="Processed By (User ID)"
              name="processedBy"
              value={formData.processedBy}
              onChange={handleChange}
              errors={errors}
              placeholder="Processed By (User ID)"
              readOnly={true}
              icon={<FaUserCheck />}
            />
          </div>

          {/* Status */}
          <SelectField
            label="Transaction Status"
            name="transactionStatus"
            value={formData.transactionStatus}
            options={transactionStatusOptions}
            onChange={handleChange}
            errors={errors}
            ariaLabel={"Transaction Status"}
            icon={<FaFlag />}
          />

          {formData.transactionStatus === "Cancelled" && (
            <TextAreaField
              label="Cancellation Reason"
              name="cancelledReason"
              value={formData.cancelledReason}
              errors={errors}
              onChange={handleChange}
              placeholder="Cancellation Reason"
              ariaLabel={"Cancellation Reason"}
              icon={<FaTimesCircle />}
            />
          )}

          <button type="submit" className="confirm-payment-submit-btn">
            Confirm Payment
          </button>
        </form>
      </section>
    </div>
  );
};

export default UpdateTransaction;
