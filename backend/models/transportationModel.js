import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Sub-schema: Address

const addressSchema = new Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, trim: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

// Sub-schema: Delivery Service Option

const deliveryServiceSchema = new Schema(
  {
    serviceName: { type: String, required: true },
    serviceCode: { type: String, required: true, uppercase: true },
    estimatedDeliveryDays: { type: Number, min: 0 },
    isInternational: { type: Boolean, default: false },
    supportedContinents: {
      type: [String],
      enum: [
        "North America",
        "South America",
        "Europe",
        "Asia",
        "Africa",
        "Australia",
      ],
      default: [],
    },

    // When you select a continent, show me the countries that you provide service to
    supportedCountries: { type: [String], default: [] },
  },
  { _id: false }
);

// Main Schema: Transportation Provider

const transportationSchema = new Schema(
  {
    providerName: { type: String, required: true },

    providerCode: { type: String, required: true, unique: true },

    contactEmail: { type: String, required: true },

    contactPhone: { type: String, required: true },

    address: { type: addressSchema, required: true },

    trackingUrlTemplate: {
      type: String,
      required: true,
      // e.g., "https://track.example.com/track?number={{trackingNumber}}"
    },

    supportedRegion: {
      type: String,
      enum: ["US", "EU", "APAC", "LATAM", "AFRICA", "MENA"],
      required: true,
    },

    deliveryServices: { type: [deliveryServiceSchema], default: [] },

    active: { type: Boolean, default: true },

    notes: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Optional: Add plugins like mongoose-delete, mongoose-paginate, etc. here

const Transportation = model("Transportation", transportationSchema);

export default Transportation;
