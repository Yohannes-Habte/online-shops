import {
  FaUser,
  FaRegCreditCard,
  FaBuilding,
  FaHome,
  FaMapMarkedAlt,
  FaCity,
  FaGlobe,
  FaLock,
  FaRegIdCard,
  FaWarehouse,
} from "react-icons/fa";
import "./BankInfo.scss";
import { InputField } from "../formFields/FormFields ";

const BankInfo = ({
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
  handleRefundChange,
  errors,
}) => {
  const fields = [
    {
      label: "Account Holder Name",
      name: "bankDetails.accountHolderName",
      value: accountHolderName,
      placeholder: "Enter account holder name",
      icon: <FaUser />,
    },
    {
      label: "Account Number",
      name: "bankDetails.accountNumber",
      value: accountNumber,
      placeholder: "Enter account number",
      icon: <FaRegCreditCard />,
    },
    {
      label: "Bank Name",
      name: "bankDetails.bankName",
      value: bankName,
      placeholder: "Enter bank name",
      icon: <FaBuilding />,
    },
    {
      label: "Bank Branch",
      name: "bankDetails.bankBranch",
      value: bankBranch,
      icon: <FaBuilding />,
      placeholder: "Enter bank branch",
    },
    {
      label: "Bank Address",
      name: "bankDetails.bankAddress",
      value: bankAddress,
      icon: <FaHome />,
      placeholder: "Enter bank address",
    },
    {
      label: "House Number",
      name: "bankDetails.houseNumber",
      value: houseNumber,
      icon: <FaHome />,
      placeholder: "Enter house number",
    },
    {
      label: "Bank ZIP Code",
      name: "bankDetails.bankZipCode",
      value: bankZipCode,
      icon: <FaMapMarkedAlt />,
      placeholder: "Enter bank ZIP code",
    },
    {
      label: "Bank City",
      name: "bankDetails.bankCity",
      value: bankCity,
      icon: <FaCity />,
      placeholder: "Enter bank city",
    },
    {
      label: "Bank State",
      name: "bankDetails.bankState",
      value: bankState,
      icon: <FaCity />,
      placeholder: "Enter bank state",
    },
    {
      label: "Bank Country",
      name: "bankDetails.bankCountry",
      value: bankCountry,
      icon: <FaGlobe />,
      placeholder: "Enter bank country",
    },
    {
      label: "SWIFT Code / BIC",
      name: "bankDetails.swiftCode",
      value: swiftCode,
      icon: <FaLock />,
      placeholder: "Enter SWIFT / BIC code",
    },
    {
      label: "IBAN",
      name: "bankDetails.IBAN",
      value: IBAN,
      icon: <FaRegIdCard />,
      placeholder: "Enter IBAN",
    },
  ];

  return (
    <section className="refund-request-fieldset">
      <h4 className="bank-info-subtitle">Bank Details</h4>
      <div className="refund-request-form-group-wrapper">
        {fields.map(({ label, name, value, icon, placeholder }) => (
          <InputField
            key={name}
            label={label}
            name={name}
            value={value}
            onChange={handleRefundChange}
            errors={errors}
            placeholder={placeholder}
            icon={icon} // Pass icon prop to InputField component
          />
        ))}

        {Object.entries(regionalCodes).map(([key, value]) => {
          const inputName = `bankDetails.regionalCodes.${key}`;
          return (
            <InputField
              key={key}
              label={key}
              name={inputName}
              value={value}
              onChange={handleRefundChange}
              errors={errors}
              placeholder={`Enter ${key}`}
              icon={<FaWarehouse />} // Use a generic icon for regional codes
            />
          );
        })}
      </div>
    </section>
  );
};

export default BankInfo;
