import { useEffect, useState } from "react";
import "./WithdrawalForm.scss";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { FaWallet, FaBitcoin } from "react-icons/fa6";

import {
  FaAddressCard,
  FaLocationDot,
  FaRegCreditCard,
  FaSwift,
  FaUser,
} from "react-icons/fa6";

import { BsBank2 } from "react-icons/bs";
import { MdEmail, MdNotes } from "react-icons/md";
import { HiUserGroup, HiCurrencyDollar } from "react-icons/hi2";
import { API } from "../../../utils/security/secreteKey";

// Reusable Input Field
const TextInput = ({
  label,
  name,
  type = "text",
  icon,
  value,
  onChange,
  error,
}) => (
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
    {error && (
      <div id={`${name}-error`} className="error-text">
        {error}
      </div>
    )}
  </div>
);

const initialState = {
  shop: "",
  withdrawalPurpose: "",
  order: "",
  product: "",
  refundTransactionId: "",
  supplier: "",
  amount: "",
  currency: "",
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
  processedDate: "",
  processedBy: "",
};

const withdrawalPurposes = [
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

const currencyOptions = ["USD", "EUR", "GBP", "INR", "JPY", "AUD"];

const WithdrawalForm = ({ order, productId, refundTransactionId }) => {
  // Global state variables

  const { currentSeller } = useSelector((state) => state.seller);

  // Local state variables

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}/suppliers`, {
          withCredentials: true,
        });
        setSuppliers(response.data.suppliers);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      product: productId,
      refundTransactionId: refundTransactionId,
      order: order._id,
    }));
  }, [productId, refundTransactionId]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitized = value.trimStart(); // Prevent leading spaces
    setFormData((prev) => ({ ...prev, [name]: sanitized }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    const {
      withdrawalPurpose,
      order,
      product,
      refundTransactionId,
      supplier,
      amount,
      currency,
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
      notes,
    } = formData;

    // Withdrawal Purpose validations
    if (!withdrawalPurpose)
      newErrors.withdrawalPurpose = "Withdrawal purpose is required";

    if (withdrawalPurpose === "Customer Reimbursement") {
      if (!order) newErrors.order = "Order ID is required";
      if (!product) newErrors.product = "Product ID is required";
      if (!refundTransactionId)
        newErrors.refundTransactionId = "Refund transaction ID is required";
    }
    if (withdrawalPurpose === "Product Procurement") {
      if (!supplier) newErrors.supplier = "Supplier ID is required";
    }

    // Withdrawal Amount validations
    if (!amount) newErrors.amount = "Amount is required";
    else if (isNaN(amount) || Number(amount) <= 0)
      newErrors.amount = "Enter a valid amount";
    else if (amount < 50 || amount > 1000000)
      newErrors.amount = "Amount must be between 50 and 1,000,000";
    else if (!/^\d+(\.\d{1,2})?$/.test(amount))
      newErrors.amount = "Amount must have at most 2 decimal places";

    // Currency validations
    if (!currency) newErrors.currency = "Currency is required";
    else if (!["USD", "EUR", "GBP", "INR", "JPY", "AUD"].includes(currency))
      newErrors.currency = "Invalid currency selected";
    else if (currency.length !== 3)
      newErrors.currency = "Currency code must be 3 characters long";
    else if (!/^[A-Z]{3}$/.test(currency))
      newErrors.currency = "Currency code must be uppercase letters only";

    // Withdrawal Method validations
    if (!method) newErrors.method = "Select a withdrawal method";

    if (method === "Bank Transfer") {
      if (!accountHolderName)
        newErrors.accountHolderName = "Account holder name is required";
      if (!accountNumber || !/^\d{6,20}$/.test(accountNumber))
        newErrors.accountNumber = "Invalid account number";
      if (!bankName) newErrors.bankName = "Bank name is required";
      if (!bankCountry) newErrors.bankCountry = "Bank country is required";
      if (!bankSwiftCode || !/^[A-Z]{6}[A-Z0-9]{2,5}$/.test(bankSwiftCode))
        newErrors.bankSwiftCode = "Invalid SWIFT code";
      if (!bankAddress) newErrors.bankAddress = "Bank address is required";
    }

    // Validate email for PayPal and Stripe
    if (["PayPal", "Stripe"].includes(method)) {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        newErrors.email = "Valid email required";
    }

    // Validate crypto wallet address and currency for Crypto
    if (method === "Crypto") {
      if (!cryptoWalletAddress)
        newErrors.cryptoWalletAddress = "Wallet address is required";
      if (!cryptoCurrency)
        newErrors.cryptoCurrency = "Select a crypto currency";
    }

    // Validate cheque recipient for Cheque
    if (method === "Cheque") {
      if (!chequeRecipient)
        newErrors.chequeRecipient = "Recipient name required";
    }

    // Additional Notes validations
    if (!notes) newErrors.notes = "Additional notes are required";
    else if (notes.length < 10 || notes.length > 500)
      newErrors.notes = "Notes must be between 10 and 500 characters long";
    else if (!/^[A-Za-z0-9\s.,!?]+$/.test(notes))
      newErrors.notes =
        "Notes must contain only letters, numbers, and punctuation";

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
      const createWithdraw = {
        withdrawalPurpose: formData.withdrawalPurpose,
        order: order._id,
        shop: order.orderedItems[0].shop._id,
        product: productId,
        refundTransactionId: refundTransactionId,
        supplier: order.orderedItems[0].supplier._id,
        amount: Number(formData.amount),
        currency: formData.currency,
        method: formData.method,
        accountHolderName: formData.accountHolderName,
        bankName: formData.bankName,
        bankCountry: formData.bankCountry,
        bankAddress: formData.bankAddress,
        bankSwiftCode: formData.bankSwiftCode,
        accountNumber: formData.accountNumber,
        routingNumber: formData.routingNumber,
        email: formData.email,
        cryptoWalletAddress: formData.cryptoWalletAddress,
        cryptoCurrency: formData.cryptoCurrency,
        chequeRecipient: formData.chequeRecipient,
        notes: formData.notes,
        processedDate: new Date().toISOString(),
        processedBy: currentSeller._id,
      };
      const { data } = await axios.post(
        `${API}/withdrawals/create`,
        createWithdraw,
        {
          withCredentials: true,
        }
      );
      if (data.success) {
        toast.success(data.message);
      }
      setSuccess(true);
      handleReset();
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setLoading(false);
    }
  };

  const { withdrawalPurpose, supplier, amount, currency, method } = formData;

  return (
    <section className="withdrawal-method-container">
      <h3 className="withdrawal-method-title">
        Disbursement from Tim Boutique
      </h3>

      <form className="withdraw-method-form" onSubmit={handleSubmit} noValidate>
        {success && (
          <div className="success-msg">
            ✅ Withdrawal info submitted successfully!
          </div>
        )}

        <div
          className={`input-container ${
            errors.withdrawalPurpose ? "has-error" : ""
          }`}
        >
          <label htmlFor="withdrawalPurpose">Withdrawal Purpose</label>
          <select
            id="withdrawalPurpose"
            name="withdrawalPurpose"
            value={withdrawalPurpose}
            onChange={handleChange}
            aria-invalid={!!errors.withdrawalPurpose}
          >
            <option value="" disabled>
              -- Select Purpose --
            </option>
            {withdrawalPurposes.map((purpose) => (
              <option key={purpose} value={purpose}>
                {purpose}
              </option>
            ))}
          </select>
          {errors.withdrawalPurpose && (
            <span className="error-text">{errors.withdrawalPurpose}</span>
          )}
        </div>

        {withdrawalPurpose === "Customer Reimbursement" && (
          <>
            <TextInput
              label="Order ID"
              name="order"
              type="text"
              icon={<FaRegCreditCard />}
              value={formData.order}
              onChange={handleChange}
              error={errors.order}
            />

            <TextInput
              label="Product ID"
              name="product"
              type="text"
              icon={<FaRegCreditCard />}
              value={formData.product}
              onChange={handleChange}
              error={errors.product}
            />

            <TextInput
              label="Refund Transaction ID"
              name="refundTransactionId"
              type="text"
              icon={<FaRegCreditCard />}
              value={formData.refundTransactionId}
              onChange={handleChange}
              error={errors.refundTransactionId}
            />
          </>
        )}

        {withdrawalPurpose === "Product Procurement" && (
          <div
            className={`input-container ${errors.supplier ? "has-error" : ""}`}
          >
            <label htmlFor="supplier">Supplier</label>
            <select
              id="supplier"
              name="supplier"
              value={supplier}
              onChange={handleChange}
              aria-invalid={!!errors.supplier}
            >
              <option value="" disabled>
                -- Select Supplier --
              </option>
              {suppliers.map((supplier) => (
                <option key={supplier._id} value={supplier}>
                  {supplier.supplierName}
                </option>
              ))}
            </select>
            {errors.supplier && (
              <span className="error-text">{errors.supplier}</span>
            )}
          </div>
        )}

        {withdrawalPurpose !== "" && (
          <TextInput
            label="Amount"
            name="amount"
            type="number"
            icon={<HiCurrencyDollar />}
            value={formData.amount}
            onChange={handleChange}
            error={errors.amount}
          />
        )}

        {withdrawalPurpose !== "" && amount !== "" && (
          <div
            className={`input-container ${errors.currency ? "has-error" : ""}`}
          >
            <label htmlFor="currency">Currency</label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              aria-invalid={!!errors.currency}
            >
              <option value="">-- Select Currency --</option>
              {currencyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.currency && (
              <span className="error-text">{errors.currency}</span>
            )}
          </div>
        )}

        {/* Method  */}
        {withdrawalPurpose !== "" && amount !== "" && currency !== "" && (
          <div
            className={`input-container ${errors.method ? "has-error" : ""}`}
          >
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
            {errors.method && (
              <span className="error-text">{errors.method}</span>
            )}
          </div>
        )}

        {/* Withdraw Method Fields */}
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
              type="text"
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
            icon={<MdEmail />}
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
            <div
              className={`input-container ${
                errors.cryptoCurrency ? "has-error" : ""
              }`}
            >
              <label htmlFor="cryptoCurrency">Crypto Currency</label>
              <span>
                {" "}
                <FaWallet />{" "}
              </span>
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
              </select>
              {errors.cryptoCurrency && (
                <span className="error-text">{errors.cryptoCurrency}</span>
              )}
            </div>
          </>
        )}

        {method === "Cheque" && (
          <TextInput
            label="Cheque Recipient"
            name="chequeRecipient"
            icon={<HiUserGroup />}
            value={formData.chequeRecipient}
            onChange={handleChange}
            error={errors.chequeRecipient}
          />
        )}

        <div className={`input-container ${errors.notes ? "has-error" : ""}`}>
          <label htmlFor="notes">Additional Notes</label>
          <span>
            {" "}
            <MdNotes />{" "}
          </span>
          <textarea
            id="notes"
            name="notes"
            rows="4"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Enter any important notes"
          />
          {errors.notes && <span className="error-text">{errors.notes}</span>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bank-info-submit-btn"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </section>
  );
};

export default WithdrawalForm;
