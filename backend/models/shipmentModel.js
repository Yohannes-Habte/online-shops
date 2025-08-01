import mongoose from "mongoose";
import { calculateBaseShippingPrice } from "../utils/shipmentPricing.js";
import { calculateInsuranceFee } from "../utils/insurancePricing.js";

const { Schema, model } = mongoose;

export const TRANSPORTATION_PROVIDERS = [
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

export const TRANSPORTATION_SERVICES = [
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

export const SHIPMENT_STATUSES = [
  "Pending",
  "AwaitingPickup",
  "PickedUp",
  "InTransit",
  "Delayed",
  "HeldAtCustoms",
  "OutForDelivery",
  "Delivered",
  "FailedDelivery",
  "ReturnedToSender",
];

export const CONTINENT_CODES = ["NA", "SA", "EU", "AS", "AF", "OC"];

export const BUSINESS_REGION_CODES = [
  "US",
  "EU",
  "APAC",
  "LATAM",
  "AFRICA",
  "MENA",
];

// Sub-schema: Contact Information
const contactSchema = new Schema(
  {
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { _id: false }
);

// Shipment Schema
const shipmentSchema = new Schema(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },

    provider: { type: String, enum: TRANSPORTATION_PROVIDERS, required: true },

    providerCode: { type: String, required: true, unique: true },

    serviceType: {
      type: String,
      enum: TRANSPORTATION_SERVICES,
      required: true,
    },

    weightKg: { type: Number, required: true },

    basePrice: { type: Number }, // Will be calculated automatically

    insuranceSupported: { type: Boolean, default: false },

    insuranceFee: { type: Number, default: 0 },

    trackingNumber: { type: String, required: true },

    trackingUrlTemplate: { type: String, required: true },

    trackingUrl: { type: String },

    contact: { type: contactSchema, required: true },

    deliveryAddress: { type: Object, default: {} },

    continent: { type: String, enum: CONTINENT_CODES, required: true },

    region: { type: String, enum: BUSINESS_REGION_CODES, required: true },

    shippingStatus: { type: String, enum: SHIPMENT_STATUSES, required: true },

    expectedDeliveryDate: { type: Date },

    actualDeliveryDate: { type: Date },

    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

// Calculate basePrice automatically before saving
shipmentSchema.pre("validate", function (next) {
  if (
    this.isNew ||
    this.isModified("weightKg") ||
    this.isModified("serviceType")
  ) {
    this.basePrice = calculateBaseShippingPrice(
      this.weightKg,
      this.serviceType
    );
  }
  next();
});

// Calculate insurance fee if insurance is supported
shipmentSchema.pre("validate", function (next) {
  if (this.insuranceSupported) {
    this.insuranceFee = calculateInsuranceFee(this.basePrice);
  }
  next();
});

const Shipment = model("Shipment", shipmentSchema);
export default Shipment;
