import { useState } from "react";
import "./BankAccountInfo.scss";
import {
  FaAddressCard,
  FaLocationDot,
  FaRegCreditCard,
  FaSwift,
  FaUser,
  FaBitcoin,
} from "react-icons/fa6";
import { BsBank2 } from "react-icons/bs";

const initialState = {
  method: "",
  accountHolderName: "",
  bankName: "",
  bankCountry: "",
  bankAddress: "",
  bankSwiftCode: "",
  accountNumber: "",
  routingNumber: "",
  email: "",
  cryptoWalletAddress: "",
  cryptoCurrency: "",
  chequeRecipient: "",
  notes: "",
};

const BankAccountInfo = () => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trimStart() }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    const {
      method,
      accountHolderName,
      bankName,
      bankCountry,
      bankAddress,
      bankSwiftCode,
      accountNumber,
      email,
      cryptoWalletAddress,
      cryptoCurrency,
      chequeRecipient,
    } = formData;

    if (!method) newErrors.method = "Withdrawal method is required";

    if (method === "Bank Transfer") {
      if (!accountHolderName) newErrors.accountHolderName = "Account holder name is required";
      if (!accountNumber || !/^\d{6,20}$/.test(accountNumber))
        newErrors.accountNumber = "Valid bank account number is required";
      if (!bankName) newErrors.bankName = "Bank name is required";
      if (!bankCountry) newErrors.bankCountry = "Bank country is required";
      if (!bankSwiftCode || !/^[A-Z]{6}[A-Z0-9]{2,5}$/.test(bankSwiftCode))
        newErrors.bankSwiftCode = "Invalid SWIFT code";
      if (!bankAddress) newErrors.bankAddress = "Bank address is required";
    }

    if (["PayPal", "Stripe"].includes(method)) {
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        newErrors.email = "Valid email is required";
      }
    }

    if (method === "Crypto") {
      if (!cryptoWalletAddress) newErrors.cryptoWalletAddress = "Wallet address is required";
      if (!cryptoCurrency) newErrors.cryptoCurrency = "Select a crypto currency";
    }

    if (method === "Cheque") {
      if (!chequeRecipient) newErrors.chequeRecipient = "Cheque recipient is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = () => {
    setFormData(initialState);
    setErrors({});
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSuccess(false);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      handleReset();
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setLoading(false);
    }
  };

  const { method } = formData;

  return (
    <form className="withdraw-method-form" onSubmit={handleSubmit} noValidate>
      {success && <div className="success-msg">Withdrawal info submitted!</div>}

      <div className={`input-container ${errors.method ? "has-error" : ""}`}>
        <label htmlFor="method">Withdraw Method</label>
        <select
          id="method"
          name="method"
          value={method}
          onChange={handleChange}
          aria-invalid={!!errors.method}
        >
          <option value="">-- Select Method --</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="PayPal">PayPal</option>
          <option value="Stripe">Stripe</option>
          <option value="Crypto">Crypto</option>
          <option value="Cheque">Cheque</option>
        </select>
        {errors.method && <span className="error-text">{errors.method}</span>}
      </div>

      {method === "Bank Transfer" && (
        <>
          <TextInput
            label="Account Holder Name"
            name="accountHolderName"
            icon={<FaUser />}
            value={formData.accountHolderName}
            onChange={handleChange}
            error={errors.accountHolderName}
          />
          <TextInput
            label="Account Number"
            name="accountNumber"
            type="number"
            icon={<FaRegCreditCard />}
            value={formData.accountNumber}
            onChange={handleChange}
            error={errors.accountNumber}
          />
          <TextInput
            label="Bank Name"
            name="bankName"
            icon={<BsBank2 />}
            value={formData.bankName}
            onChange={handleChange}
            error={errors.bankName}
          />
          <TextInput
            label="Bank Country"
            name="bankCountry"
            icon={<FaLocationDot />}
            value={formData.bankCountry}
            onChange={handleChange}
            error={errors.bankCountry}
          />
          <TextInput
            label="SWIFT Code"
            name="bankSwiftCode"
            icon={<FaSwift />}
            value={formData.bankSwiftCode}
            onChange={handleChange}
            error={errors.bankSwiftCode}
          />
          <TextInput
            label="Bank Address"
            name="bankAddress"
            icon={<FaAddressCard />}
            value={formData.bankAddress}
            onChange={handleChange}
            error={errors.bankAddress}
          />
        </>
      )}

      {(method === "PayPal" || method === "Stripe") && (
        <TextInput
          label="Email"
          name="email"
          type="email"
          icon={<FaUser />}
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
      )}

      {method === "Crypto" && (
        <>
          <TextInput
            label="Crypto Wallet Address"
            name="cryptoWalletAddress"
            icon={<FaBitcoin />}
            value={formData.cryptoWalletAddress}
            onChange={handleChange}
            error={errors.cryptoWalletAddress}
          />
          <div className={`input-container ${errors.cryptoCurrency ? "has-error" : ""}`}>
            <label htmlFor="cryptoCurrency">Crypto Currency</label>
            <select
              id="cryptoCurrency"
              name="cryptoCurrency"
              value={formData.cryptoCurrency}
              onChange={handleChange}
              aria-invalid={!!errors.cryptoCurrency}
            >
              <option value="">-- Select Currency --</option>
              <option value="Bitcoin">Bitcoin</option>
              <option value="Ethereum">Ethereum</option>
              <option value="USDT">USDT</option>
              <option value="Other">Other</option>
            </select>
            {errors.cryptoCurrency && <span className="error-text">{errors.cryptoCurrency}</span>}
          </div>
        </>
      )}

      {method === "Cheque" && (
        <TextInput
          label="Cheque Recipient"
          name="chequeRecipient"
          icon={<FaUser />}
          value={formData.chequeRecipient}
          onChange={handleChange}
          error={errors.chequeRecipient}
        />
      )}

      <div className="input-container">
        <label htmlFor="notes">Additional Notes (optional)</label>
        <textarea
          id="notes"
          name="notes"
          rows="3"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Enter any notes you'd like to include"
        />
      </div>

      <button type="submit" disabled={loading} className="bank-info-submit-btn">
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

// Reusable Input Component
const TextInput = ({ label, name, type = "text", icon, value, onChange, error }) => (
  <div className={`input-container ${error ? "has-error" : ""}`}>
    {icon && <span className="input-field-icon">{icon}</span>}
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      placeholder={`Enter ${label}`}
      aria-label={label}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
    />
    <label htmlFor={name}>{label}</label>
    {error && <div id={`${name}-error`} className="error-text">{error}</div>}
  </div>
);

export default BankAccountInfo;
