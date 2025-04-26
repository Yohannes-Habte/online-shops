import { useEffect, useState } from "react";
import "./RefundRequestForm.scss";
import axios from "axios";
import { API } from "../../../utils/security/secreteKey";
import { toast } from "react-toastify";
import { handleError } from "../../../utils/errorHandler/ErrorMessage";
import BankInfo from "../bank/BankInfo";
import {
  InputField,
  SelectField,
  TextAreaField,
} from "../formFields/FormFields";
import {
  FaRegBuilding,
  FaCreditCard,
  FaUserAlt,
  FaMapMarkerAlt,
  FaRegEnvelope,
} from "react-icons/fa";

const refundRequestReasonOptions = [
  "Damaged or Faulty Product",
  "Incorrect Item Received",
  "Size or Fit Issue",
  "Product Not as Described",
  "Changed My Mind",
  "Other",
];

const refundMethodOptions = [
  "Bank Transfer",
  "PayPal",
  "Stripe",
  "Crypto",
  "Cheque",
];

const refundRequestInitialState = {
  order: "",
  product: "",
  productColor: "",
  productSize: "",
  productQuantity: "",
  requestedDate: "",
  requestRefundReason: "",
  otherReason: "",
  currency: "",
  method: "",
  bankDetails: {
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    bankBranch: "",
    bankAddress: "",
    houseNumber: "",
    bankZipCode: "",
    bankCity: "",
    bankState: "",
    bankCountry: "",
    swiftCode: "",
    IBAN: "",
    regionalCodes: { codeType: "", codeValue: "" },
  },
  email: "",
  chequeRecipient: "",
  cryptoDetails: {
    network: "",
    token: "",
    walletAddress: "",
  },
  notes: "",
  processedBy: "",
};
const RefundRequestForm = ({ orderInfos, setOrderInfos, selectedProduct }) => {
  const [refundForm, setRefundForm] = useState(refundRequestInitialState);
  const [errors, setErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const {
    bankDetails: {
      accountHolderName,
      accountNumber,
      bankName,
      bankBranch,
      bankAddress,
      houseNumber,
      bankZipCode,
      bankCity,
      bankState,
      bankCountry,
      swiftCode,
      IBAN,
      regionalCodes,
    },
  } = refundForm;

  // const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;

  useEffect(() => {
    if (selectedProduct) {
      setRefundForm((prev) => ({
        ...prev,
        order: orderInfos?._id,
        product: selectedProduct?._id,
        productColor: selectedProduct?.productColor,
        productSize: selectedProduct?.size,
        productQuantity: selectedProduct?.quantity,
        currency: orderInfos?.payment?.currency || "",
        requestedDate: new Date().toISOString().split("T")[0],
        processedBy: orderInfos?.customer?._id,
      }));
    }
  }, [selectedProduct]);

  const handleRefundChange = (e) => {
    const { name, value } = e.target;

    // Update form and handle errors
    setRefundForm((prev) => {
      const updatedForm = { ...prev };

      if (name.startsWith("bankDetails.regionalCodes.")) {
        const codeKey = name.split(".")[2];
        updatedForm.bankDetails = {
          ...prev.bankDetails,
          regionalCodes: {
            ...prev.bankDetails.regionalCodes,
            [codeKey]: value,
          },
        };
        setErrors((prev) => {
          const updatedErrors = { ...prev };
          delete updatedErrors[`bankDetails.regionalCodes.${codeKey}`];
          return updatedErrors;
        });
      } else if (name.startsWith("bankDetails.")) {
        const field = name.split(".")[1];
        updatedForm.bankDetails = {
          ...prev.bankDetails,
          [field]: value,
        };
        setErrors((prev) => {
          const updatedErrors = { ...prev };
          delete updatedErrors[`bankDetails.${field}`];
          return updatedErrors;
        });
      } else if (name.startsWith("cryptoDetails.")) {
        const field = name.split(".")[1];
        updatedForm.cryptoDetails = {
          ...prev.cryptoDetails,
          [field]: value,
        };
        setErrors((prev) => {
          const updatedErrors = { ...prev };
          delete updatedErrors[`cryptoDetails.${field}`];
          return updatedErrors;
        });
      } else {
        updatedForm[name] = value;
        if (errors[name]) {
          setErrors((prev) => {
            const updatedErrors = { ...prev };
            delete updatedErrors[name];
            return updatedErrors;
          });
        }
      }

      return updatedForm;
    });
  };

  const validateRefundForm = () => {
    const refundFormErrors = {};

    const requiredCryptoFields = ["network", "token", "walletAddress"];

    if (!refundForm.requestRefundReason) {
      refundFormErrors.requestRefundReason = "Refund reason is required";
    }
    if (refundForm.requestRefundReason === "Other" && !refundForm.otherReason) {
      refundFormErrors.otherReason = "Please specify the reason";
    }

    if (!refundForm.currency) {
      refundFormErrors.currency = "Currency is required";
    }

    if (!refundForm.method) {
      refundFormErrors.method = "Refund method is required";
    }

    if (refundForm.method === "Bank Transfer") {
      if (!accountHolderName)
        refundFormErrors["bankDetails.accountHolderName"] =
          "Account holder name is required.";
      if (!accountNumber)
        refundFormErrors["bankDetails.accountNumber"] =
          "Account number is required.";
      if (!bankName)
        refundFormErrors["bankDetails.bankName"] = "Bank name is required.";
      if (!bankBranch)
        refundFormErrors["bankDetails.bankBranch"] = "Bank branch is required.";
      if (!bankAddress)
        refundFormErrors["bankDetails.bankAddress"] =
          "Bank address is required.";
      if (!houseNumber)
        refundFormErrors["bankDetails.houseNumber"] =
          "House number is required.";
      if (!bankZipCode)
        refundFormErrors["bankDetails.bankZipCode"] =
          "Bank ZIP code is required.";
      if (!bankCity)
        refundFormErrors["bankDetails.bankCity"] = "Bank city is required.";
      if (!bankState)
        refundFormErrors["bankDetails.bankState"] = "Bank state is required.";
      if (!bankCountry)
        refundFormErrors["bankDetails.bankCountry"] =
          "Bank country is required.";
      if (!swiftCode)
        refundFormErrors["bankDetails.swiftCode"] =
          "SWIFT / BIC code is required.";
      if (!IBAN) refundFormErrors["bankDetails.IBAN"] = "IBAN is required.";

      Object.entries(regionalCodes).forEach(([key, value]) => {
        if (!value) {
          refundFormErrors[`regionalCodes.${key}`] = `${key} is required.`;
        }
      });
    }

    if (refundForm.method === "Stripe" || refundForm.method === "PayPal") {
      if (!refundForm.email) {
        refundFormErrors.email = "Email is required";
      }
    }

    if (refundForm.method === "Cheque") {
      if (!refundForm.chequeRecipient) {
        refundFormErrors.chequeRecipient = "Cheque recipient is required";
      }
    }

    if (refundForm.method === "Crypto") {
      requiredCryptoFields.forEach((field) => {
        if (!refundForm.cryptoDetails[field]) {
          refundFormErrors[`cryptoDetails.${field}`] = `${field} is required`;
        }
      });
    }

    if (!refundForm.notes) {
      refundFormErrors.notes = "Notes are required";
    }

    setErrors(refundFormErrors);
    return Object.keys(refundFormErrors).length === 0;
  };

  const resetRefundForm = () => {
    setRefundForm(refundRequestInitialState);
    setErrors({});
    setFormLoading(false);
    setFormSuccess(false);
  };

  const handleRefundSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormSuccess(false);

    const isValid = validateRefundForm();
    if (!isValid) {
      setFormLoading(false);
      return;
    }

    const requestDetails = {
      order: orderInfos._id,
      product: selectedProduct._id,
      productColor: selectedProduct.productColor,
      productSize: selectedProduct.size,
      productQuantity: selectedProduct.quantity,
      requestedDate: new Date().toISOString().split("T")[0],
      requestRefundReason: refundForm.requestRefundReason,
      otherReason: refundForm.otherReason,
      currency: refundForm.currency,
      method: refundForm.method,
      bankDetails:
        refundForm.method === "Bank Transfer" ? refundForm.bankDetails : null,
      email:
        refundForm.method === "Stripe" || refundForm.method === "PayPal"
          ? refundForm.email
          : null,
      chequeRecipient:
        refundForm.method === "Cheque" ? refundForm.chequeRecipient : null,
      cryptoDetails:
        refundForm.method === "Crypto" ? refundForm.cryptoDetails : null,
      notes: refundForm.notes,
      processedBy: orderInfos.customer._id,
    };

    // Log to check the details being sent
    console.log("Request Details: ", requestDetails);

    try {
      const response = await axios.post(
        `${API}/refunds/request`,
        requestDetails,
        { withCredentials: true }
      );

      if (response.status === 201 && response.data.success) {
        setFormLoading(false);
        setFormSuccess(true);
        toast.success(response.data.message);
        setOrderInfos((prev) => ({ ...prev, orderStatus: "Refund Requested" }));
        resetRefundForm();
      }
    } catch (error) {
      setFormLoading(false);
      setFormSuccess(false);
      console.error("Error submitting refund request:", error);
      const errorMessage = handleError(error);
      toast.error(errorMessage || "Refund request submission failed");
    }
  };

  return (
    <section className="refund-request-form-container">
      <h2 className="refund-request-form-title">Refund Request</h2>
      {formSuccess && (
        <p className="refund-request-success-message">
          Your refund request has been submitted successfully. We will get back
          to you shortly.
        </p>
      )}
      <form onSubmit={handleRefundSubmit} className="refund-request-form">
        {/* Request refund reason*/}
        <SelectField
          label="Refund Reason"
          name="requestRefundReason"
          value={refundForm.requestRefundReason}
          onChange={handleRefundChange}
          errors={errors}
          options={refundRequestReasonOptions}
          icon={<FaRegBuilding />} // Refund reason icon
        />

        {/* Other reason */}
        {refundForm.requestRefundReason === "Other" && (
          <TextAreaField
            label="Other Reason"
            name="otherReason"
            value={refundForm.otherReason}
            onChange={handleRefundChange}
            errors={errors}
            placeholder="Please specify the reason ..."
            icon={<FaCreditCard />}
          />
        )}

        <div className="refund-request-form-group-wrapper">
          <InputField
            label="Product Color"
            name="productColor"
            value={refundForm.productColor}
            readOnly
            errors={{}}
            placeholder="Enter product color"
            icon={<FaUserAlt />}
          />
          <InputField
            label="Product Size"
            name="productSize"
            value={refundForm.productSize}
            readOnly
            errors={{}}
            placeholder="Enter product size"
            icon={<FaMapMarkerAlt />}
          />
          <InputField
            label="Product Quantity"
            name="productQuantity"
            value={refundForm.productQuantity}
            readOnly
            type="number"
            placeholder="Enter product quantity"
            errors={{}}
            icon={<FaMapMarkerAlt />}
          />
          <InputField
            label="Requested Date"
            name="requestedDate"
            value={refundForm.requestedDate}
            readOnly
            type="date"
            errors={{}}
            icon={<FaRegEnvelope />}
          />
        </div>

        {/* Refund method */}
        <SelectField
          label="Refund Method"
          name="method"
          value={refundForm.method}
          onChange={handleRefundChange}
          errors={errors}
          options={refundMethodOptions}
          icon={<FaCreditCard />}
        />

        {/* Bank Details */}
        {refundForm.method === "Bank Transfer" && (
          <BankInfo
            accountHolderName={accountHolderName}
            accountNumber={accountNumber}
            bankName={bankName}
            bankBranch={bankBranch}
            bankAddress={bankAddress}
            houseNumber={houseNumber}
            bankZipCode={bankZipCode}
            bankCity={bankCity}
            bankState={bankState}
            bankCountry={bankCountry}
            swiftCode={swiftCode}
            IBAN={IBAN}
            regionalCodes={regionalCodes}
            handleRefundChange={handleRefundChange}
            errors={errors}
          />
        )}

        {/* Email */}
        {(refundForm.method === "Stripe" || refundForm.method === "PayPal") && (
          <InputField
            label="Email"
            name="email"
            value={refundForm.email}
            onChange={handleRefundChange}
            errors={errors}
            type="email"
            icon={<FaRegEnvelope />}
            placeholder="Enter your email address"
          />
        )}

        {/* Cheque */}
        {refundForm.method === "Cheque" && (
          <InputField
            label="Cheque Recipient"
            name="chequeRecipient"
            value={refundForm.chequeRecipient}
            onChange={handleRefundChange}
            errors={errors}
            icon={<FaUserAlt />}
            placeholder="Enter cheque recipient name"
          />
        )}

        {/* Crypto details */}
        {refundForm.method === "Crypto" && (
          <section className="crypto-details-section-wrapper">
            <h4 className="legend-refund-form-subtitle">Crypto Details</h4>
            {Object.entries(refundForm.cryptoDetails).map(([key, value]) => {
              const inputName = `cryptoDetails.${key}`;
              return (
                <InputField
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  name={inputName}
                  value={value}
                  onChange={handleRefundChange}
                  errors={errors}
                  icon={<FaCreditCard />}
                  placeholder={`Enter ${key}`}
                />
              );
            })}
          </section>
        )}

        {/* Notes */}
        <TextAreaField
          label="Notes"
          name="notes"
          value={refundForm.notes}
          onChange={handleRefundChange}
          errors={errors}
          icon={<FaRegEnvelope />}
          placeholder="Enter any additional notes or comments..."
        />

        <button className="refund-request-submit-btn" disabled={formLoading}>
          {formLoading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </section>
  );
};

export default RefundRequestForm;
