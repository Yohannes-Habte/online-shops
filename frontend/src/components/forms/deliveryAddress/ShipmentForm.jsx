import { useEffect, useState } from "react";
import "./ShipmentForm.scss";
import axios from "axios";
import { API } from "../../../utils/security/secreteKey";
import { toast } from "react-toastify";
import {
  DateField,
  InputField,
  RadioField,
  SelectField,
  TextAreaField,
} from "../formFields/FormFields";
import {
  FiTruck,
  FiLayers,
  FiPackage,
  FiTag,
  FiMail,
  FiPhone,
  FiGlobe,
  FiMapPin,
  FiTrendingUp,
  FiFileText,
} from "react-icons/fi";
import { handleError } from "../../../utils/errorHandler/ErrorMessage";

const providerTrackingTemplates = {
  UPS: "https://www.ups.com/track?loc=en_US&tracknum={{trackingNumber}}",
  FEDEX: "https://www.fedex.com/fedextrack/?tracknumbers={{trackingNumber}}",
  DHL: "https://www.dhl.com/track?trackingNumber={{trackingNumber}}",
  USPS: "https://tools.usps.com/go/TrackConfirmAction?tLabels={{trackingNumber}}",
  ROYAL_MAIL:
    "https://www.royalmail.com/track-your-item#/tracking-results/{{trackingNumber}}",
  DPD: "https://tracking.dpd.de/status/en_US/parcel/{{trackingNumber}}",
  GLS: "https://gls-group.com/DE/en/parcel-tracking?match={{trackingNumber}}",
  TNT: "https://www.tnt.com/express/en_gb/site/shipping-tools/tracking.html?searchType=con&cons={{trackingNumber}}",
  ARAMEX:
    "https://www.aramex.com/express/track.aspx?ShipmentNumber={{trackingNumber}}",
  CANADA_POST:
    "https://www.canadapost-postescanada.ca/track-reperage/en#/search?searchFor={{trackingNumber}}",
  AUSTRALIA_POST:
    "https://auspost.com.au/mypost/track/#/details/{{trackingNumber}}",
  JAPAN_POST:
    "https://trackings.post.japanpost.jp/services/srv/search/direct?reqCodeNo1={{trackingNumber}}&locale=en",
  SF_EXPRESS:
    "https://www.sf-express.com/cn/en/dynamic_function/waybill/#search/bill-number/{{trackingNumber}}",
  YAMATO: "https://toi.kuronekoyamato.co.jp/cgi-bin/tneko",
  POSTNL:
    "https://www.internationalparceltracking.com/Main.aspx#/track/{{trackingNumber}}/NL",
  CORREIOS: "https://www2.correios.com.br/sistemas/rastreamento/default.cfm",
  CHINA_POST: "https://track-chinapost.com/result.jsp?nu={{trackingNumber}}",
  LA_POSTE:
    "https://www.laposte.fr/outils/suivre-vos-envois?code={{trackingNumber}}",
  DEUTSCHE_POST:
    "https://www.deutschepost.de/sendung/simpleQuery.html?form.sendungsnummer={{trackingNumber}}",
  EMS: "https://www.ems.post/en/global-network/tracking",
  BLUE_DART:
    "https://www.bluedart.com/tracking?tracknumbers={{trackingNumber}}",
  "J&T_EXPRESS":
    "https://www.jtexpress.ph/index/query/gzquery.html?billcode={{trackingNumber}}",
  NINJA_VAN: "https://www.ninjavan.co/en-ph/tracking?id={{trackingNumber}}",
  LALAMOVE: "https://lalamove.com",
  GRABEXPRESS: "https://www.grab.com/ph/express/",
  GOJEK: "https://www.gojek.com/id-en/",
  ZTO: "https://www.zto.com/GuestService/Bill?txtBill={{trackingNumber}}",
  XPRESSBEES: "https://www.xpressbees.com/track?awb={{trackingNumber}}",
  DELHIVERY: "https://www.delhivery.com/tracking/{{trackingNumber}}",
  SHIPROCKET: "https://www.shiprocket.in/tracking/{{trackingNumber}}",
  CAINIAO:
    "https://global.cainiao.com/detail.htm?mailNoList={{trackingNumber}}",
};

// Constants
const providers = [
  "UPS",
  "FEDEX",
  "DHL",
  "USPS",
  "ROYAL_MAIL",
  "DPD",
  "GLS",
  "TNT",
  "ARAMEX",
  "CANADA_POST",
  "AUSTRALIA_POST",
  "JAPAN_POST",
  "SF_EXPRESS",
  "YAMATO",
  "POSTNL",
  "CORREIOS",
  "CHINA_POST",
  "LA_POSTE",
  "DEUTSCHE_POST",
  "EMS",
  "BLUE_DART",
  "J&T_EXPRESS",
  "NINJA_VAN",
  "LALAMOVE",
  "GRABEXPRESS",
  "GOJEK",
  "ZTO",
  "XPRESSBEES",
  "DELHIVERY",
  "SHIPROCKET",
  "CAINIAO",
];
const services = [
  "Standard",
  "Express",
  "Overnight",
  "TwoDay",
  "SameDay",
  "Economy",
  "Freight",
  "International",
  "NextDay",
  "Scheduled",
];
const shipmentStatuses = [
  "Pending",
  "AwaitingPickup",
  "PickedUp",
  "InTransit",
  "Delayed",
  "Delivered",
];
const continents = ["NA", "SA", "EU", "AS", "AF", "OC"];
const regions = ["US", "EU", "APAC", "LATAM", "AFRICA", "MENA"];

const initialFormState = {
  provider: "",
  serviceType: "",
  weightKg: "",
  insuranceSupported: "",
  additionalFees: 0,
  trackingNumber: "",
  trackingUrlTemplate: "",
  contact: { email: "", phone: "" },
  continent: "",
  region: "",
  shippingStatus: "",
  expectedDeliveryDate: "",
  actualDeliveryDate: "",
  notes: "",
};

const ShipmentForm = ({ setOpenShippedStatus, order }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [shippingLoading, setShippingLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const orderWeight = order?.orderedItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const {
    provider,
    serviceType,
    weightKg,
    insuranceSupported,
    additionalFees,
    trackingNumber,
    trackingUrlTemplate,
    contact,
    continent,
    region,
    shippingStatus,
    expectedDeliveryDate,
    actualDeliveryDate,
    notes,
  } = formData;

  useEffect(() => {
    if (order) {
      setFormData((prevData) => ({
        ...prevData,
        provider: order.tracking.carrier || "",
        weightKg: orderWeight,
        serviceType: order.shippingAddress.service,
        contact: {
          email: order.customer.email || "",
          phone: order.shippingAddress.phoneNumber || "",
        },
      }));
    }
  }, [order]);

  const getEstimatedDeliveryDate = () => {
    let deliveryDate = new Date();
    let addedDays = 0;

    // If today is Saturday (6) or Sunday (0), move to the next day until a Monday–Friday is reached.
    while (deliveryDate.getDay() === 0 || deliveryDate.getDay() === 6) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
    }

    // Count three working days (excluding weekends)
    while (addedDays < 3) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
      if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
        addedDays++;
      }
    }

    return deliveryDate.toISOString().split("T")[0]; // YYYY-MM-DD format
  };

  useEffect(() => {
    if (!expectedDeliveryDate) {
      const estimatedDate = getEstimatedDeliveryDate();
      setFormData((prev) => ({
        ...prev,
        expectedDeliveryDate: estimatedDate,
      }));
    }
  }, []);

  // Build final tracking URL
  const buildTrackingUrl = (template, trackingNum) => {
    if (!template || !trackingNum) return "";
    return template.replace("{{trackingNumber}}", trackingNum);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (name.startsWith("contact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        contact: { ...prev.contact, [field]: value },
      }));
    } else if (type === "radio") {
      const checkValue = value === "true" ? true : false;
      setFormData((prev) => ({ ...prev, [name]: checkValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      // 🆕 Auto-update tracking template when provider changes
      if (name === "provider") {
        const template = providerTrackingTemplates[value] || "";
        setFormData((prev) => ({
          ...prev,
          provider: value,
          trackingUrlTemplate: template,
        }));
      }
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!provider) newErrors.provider = "Provider is required.";
    if (!serviceType) newErrors.serviceType = "Service type is required.";
    if (!weightKg || isNaN(weightKg) || weightKg <= 0)
      newErrors.weightKg = "Valid weight is required.";
    if (insuranceSupported === "")
      newErrors.insuranceSupported = "Insurance is required.";
    if (insuranceSupported && (!additionalFees || isNaN(additionalFees)))
      newErrors.additionalFees = "Valid additional fees are required.";
    if (!contact.email)
      newErrors["contact.email"] = "Contact email is required.";
    if (!contact.phone)
      newErrors["contact.phone"] = "Contact phone is required.";
    if (!continent) newErrors.continent = "Continent is required.";
    if (!region) newErrors.region = "Region is required.";
    if (!shippingStatus)
      newErrors.shippingStatus = "Shipping status is required.";
    if (!expectedDeliveryDate)
      newErrors.expectedDeliveryDate = "Expected delivery date is required.";
    if (!notes) newErrors.notes = "Notes are required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setShippingLoading(false);
    setSuccess(false);
  };

  const generateTrackingNumber = () => {
    const randomSegment = () => {
      const array = new Uint32Array(2);
      window.crypto.getRandomValues(array);
      return Array.from(array, (num) => num.toString(36)).join("");
    };
    const timestamp = Date.now().toString(36);
    return `TRK-${timestamp}-${randomSegment()}`.toUpperCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setShippingLoading(false);
    setSuccess(false);

    const isValid = validateForm();
    if (!isValid) return;

    try {
      setShippingLoading(true);

      const usedTrackingNumber = trackingNumber || generateTrackingNumber();
      const finalTrackingUrl = buildTrackingUrl(
        trackingUrlTemplate,
        usedTrackingNumber
      );

      const deliveryAddressData = {
        order: order._id,
        provider,
        serviceType,
        weightKg: orderWeight,
        insuranceSupported,
        additionalFees: parseFloat(additionalFees),
        trackingNumber: usedTrackingNumber,
        trackingUrlTemplate, // Keep the raw template
        trackingUrl: finalTrackingUrl, // Final URL generated
        contact,
        deliveryAddress: order.shippingAddress,
        continent,
        region,
        shippingStatus,
        expectedDeliveryDate:
          expectedDeliveryDate || getEstimatedDeliveryDate(),
        actualDeliveryDate: actualDeliveryDate || null,
        notes,
      };

      const response = await axios.post(
        `${API}/shippings/create`,
        deliveryAddressData,
        { withCredentials: true }
      );

      if (response.status === 201 && response.data.success) {
        toast.success("Shipment created successfully!");
        setSuccess(true);
        resetForm();
        setOpenShippedStatus(false);
      } else {
        setErrors({ server: "Failed to create shipment." });
        setOpenShippedStatus(false);
      }
    } catch (error) {
      const { message } = handleError(error);
      setErrors({
        server: message || "An error occurred while creating shipment.",
      });
      toast.error(message || "An error occurred while creating shipment.");
      setOpenShippedStatus(false);
    } finally {
      setShippingLoading(false);
    }
  };

  return (
    <div className="customer-delivery-address-modal">
      <section className="customer-delivery-address-popup">
        {success && (
          <div className="success-message">Shipment created successfully!</div>
        )}
        <span
          className="close-customer-delivery-address-popup"
          onClick={() => {
            setOpenShippedStatus(false);
            resetForm();
          }}
        >
          X
        </span>
        <h2 className="customer-delivery-address-title">
          Customer Delivery Address
        </h2>

        <form
          onSubmit={handleSubmit}
          className="customer-delivery-address-form"
        >
          <div className="customer-delivery-address-inputs-wrapper">
            <SelectField
              label="Shipping Service Provider"
              name="provider"
              value={provider}
              onChange={handleChange}
              options={providers}
              errors={errors}
              icon={<FiTruck />}
            />
            <SelectField
              label="Service Type"
              name="serviceType"
              value={serviceType}
              onChange={handleChange}
              options={services}
              errors={errors}
              readOnly
              icon={<FiLayers />}
            />
            <InputField
              label="Weight (kg)"
              name="weightKg"
              type="number"
              value={weightKg}
              onChange={handleChange}
              errors={errors}
              readOnly
              icon={<FiPackage />}
              placeholder="Weight in kg"
            />
            <div className="form-radio-group-container">
              <label className="form-radio-title">Insurance Supported?</label>
              <div className="form-radio-group-options-with-icon">
                <span className="return-form-radio-icon">
                  <FiTag />
                </span>
                <div className="form-radio-group-options">
                  <RadioField
                    label="Yes"
                    name="insuranceSupported"
                    value="true"
                    checked={insuranceSupported === true}
                    onChange={handleChange}
                    errors={""}
                  />
                  <RadioField
                    label="No"
                    name="insuranceSupported"
                    value="false"
                    checked={insuranceSupported === false}
                    onChange={handleChange}
                    errors={""}
                  />
                </div>
              </div>
            </div>
            {insuranceSupported && (
              <InputField
                label="Additional Fees ($)"
                name="additionalFees"
                type="number"
                value={additionalFees}
                onChange={handleChange}
                errors={errors}
                icon={<FiTag />}
                placeholder="Additional fees in USD"
              />
            )}

            <InputField
              label="Contact Email"
              name="contact.email"
              value={contact.email}
              onChange={handleChange}
              errors={errors}
              icon={<FiMail />}
              placeholder="Contact email"
            />
            <InputField
              label="Contact Phone"
              name="contact.phone"
              value={contact.phone}
              onChange={handleChange}
              errors={errors}
              icon={<FiPhone />}
              placeholder="Contact phone"
            />
            <SelectField
              label="Continent"
              name="continent"
              value={continent}
              onChange={handleChange}
              errors={errors}
              options={continents}
              icon={<FiGlobe />}
            />
            <SelectField
              label="Region"
              name="region"
              value={region}
              onChange={handleChange}
              options={regions}
              errors={errors}
              icon={<FiMapPin />}
            />
            <SelectField
              label="Shipping Status"
              name="shippingStatus"
              value={shippingStatus}
              onChange={handleChange}
              options={shipmentStatuses}
              errors={errors}
              icon={<FiMapPin />}
            />
            <DateField
              label="Expected Delivery Date"
              name="expectedDeliveryDate"
              value={expectedDeliveryDate}
              onChange={handleChange}
              errors={errors}
              icon={<FiTrendingUp />}
              placeholder="Expected delivery date"
            />
          </div>

          <TextAreaField
            label="Notes"
            name="notes"
            value={notes}
            onChange={handleChange}
            errors={errors}
            icon={<FiFileText />}
            placeholder="Notes"
          />

          <button
            type="submit"
            disabled={shippingLoading}
            className="customer-delivery-address-btn"
          >
            {shippingLoading ? "Creating Shipment..." : "Submit"}
          </button>

          {errors.server && (
            <div className="server-error-message">{errors.server}</div>
          )}
        </form>
      </section>
    </div>
  );
};

export default ShipmentForm;
