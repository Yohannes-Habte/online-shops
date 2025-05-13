import "./Shipping.scss";
import { Country, State, City } from "country-state-city";
import {
  InputField,
  LabeledSelectField,
  SelectField,
} from "../../forms/formFields/FormFields";

import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapIcon,
  HomeIcon,
  HashtagIcon,
  GlobeAltIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";



const Shipping = ({
  user,
  serviceEnum,
  formData,
  handleInputChange,
  errors,
  proceedToPayment,
  loading,
}) => {
  const {
    streetName,
    houseNumber,
    service,
    zipCode,
    country,
    state,
    city,
    phoneNumber,
  } = formData;

  return (
    <section className="shipping-address-wrapper">
      <h3 className="shopping-address-title">Shipping Address</h3>

      <form className="shipping-address-form">
        {/* Name */}

        <InputField
          name="name"
          value={user && user?.name}
          readOnly
          label="Full Name"
          placeholder="Full Name"
          errors={errors}
          icon={<UserIcon className="h-4 w-4 text-gray-500" />}
        />

        {/* Email */}
        <InputField
          name="email"
          value={user && user?.email}
          readOnly
          label="Email Address"
          placeholder="Email Address"
          errors={errors}
          icon={<EnvelopeIcon className="h-4 w-4 text-gray-500" />}
        />

        {/* Phone */}
        <InputField
          name="phoneNumber"
          value={phoneNumber}
          onChange={handleInputChange}
          label="Phone Number"
          placeholder="Phone Number"
          errors={errors}
          icon={<PhoneIcon className="h-4 w-4 text-gray-500" />}
        />

        {/* Street Name */}
        <InputField
          name="streetName"
          value={streetName}
          onChange={handleInputChange}
          label="Street Name"
          placeholder="Street Name"
          errors={errors}
          icon={<MapIcon className="h-4 w-4 text-gray-500" />}
        />

        {/* House Number */}
        <InputField
          name="houseNumber"
          value={houseNumber}
          onChange={handleInputChange}
          label="House Number"
          placeholder="House Number"
          errors={errors}
          icon={<HomeIcon className="h-4 w-4 text-gray-500" />}
        />

        {/* Zip Code */}
        <InputField
          name="zipCode"
          value={zipCode}
          onChange={handleInputChange}
          label="Zip Code"
          placeholder="Zip Code"
          errors={errors}
          icon={<HashtagIcon className="h-4 w-4 text-gray-500" />}
        />

        {/* Country */}
        <LabeledSelectField
          name="country"
          value={country}
          onChange={handleInputChange}
          label="Country"
          placeholder="Choose your country"
          errors={errors}
          options={Country.getAllCountries().map((c) => ({
            value: c.isoCode,
            label: c.name,
          }))}
          icon={<GlobeAltIcon className="h-4 w-4 text-gray-500" />}
        />

        {/* State */}
        <LabeledSelectField
          name="state"
          value={state}
          onChange={handleInputChange}
          label="State"
          placeholder="Choose your state"
          errors={errors}
          options={State.getStatesOfCountry(country).map((s) => ({
            value: s.isoCode,
            label: s.name,
          }))}
          icon={<MapPinIcon className="h-4 w-4 text-gray-500" />}
        />

        {/* City */}
        <LabeledSelectField
          name="city"
          value={city}
          onChange={handleInputChange}
          label="City"
          placeholder="Choose your city"
          errors={errors}
          options={City.getCitiesOfState(country, state).map((c) => ({
            value: c.isoCode,
            label: c.name,
          }))}
          icon={<BuildingOfficeIcon className="h-4 w-4 text-gray-500" />}
        />

        {/* Service type */}
        <SelectField
          name="service"
          value={service}
          onChange={handleInputChange}
          label="Service Type"
          placeholder="Choose your service type"
          errors={errors}
          options={serviceEnum}
          icon={<BriefcaseIcon className="h-4 w-4 text-gray-500" />}
        />
      </form>
      <button
        onClick={proceedToPayment}
        className="proceed-payment-btn"
        disabled={loading} // Disable button if loading
      >
        {loading ? "Processing..." : "Proceed to Payment"}
      </button>
    </section>
  );
};

export default Shipping;
