export default function PropertyStep({ value, onFieldChange }) {
  return (
    <div className="mt-10 rounded-2xl border border-gray-200 p-6">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
          Step 2
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-gray-900">
          Tell us about your property
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          This helps us understand the size of the job and prepare a more
          accurate recommendation.
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <SelectField
          label="Property type"
          value={value.propertyType}
          onChange={(newValue) => onFieldChange("propertyType", newValue)}
          placeholder="Select property type"
          options={[
            ["apartment", "Apartment"],
            ["house", "House"],
            ["townhouse", "Townhouse"],
            ["office", "Office"],
            ["other", "Other"],
          ]}
        />

        <SelectField
          label="Floors"
          value={value.floors}
          onChange={(newValue) => onFieldChange("floors", newValue)}
          placeholder="Select floors"
          options={[
            ["1", "1 floor"],
            ["2", "2 floors"],
            ["3", "3 floors"],
            ["4+", "4+ floors"],
          ]}
        />

        <SelectField
          label="Bedrooms"
          value={value.bedrooms}
          onChange={(newValue) => onFieldChange("bedrooms", newValue)}
          placeholder="Select bedrooms"
          options={[
            ["0", "Studio / 0"],
            ["1", "1 bedroom"],
            ["2", "2 bedrooms"],
            ["3", "3 bedrooms"],
            ["4", "4 bedrooms"],
            ["5+", "5+ bedrooms"],
          ]}
        />

        <SelectField
          label="Bathrooms"
          value={value.bathrooms}
          onChange={(newValue) => onFieldChange("bathrooms", newValue)}
          placeholder="Select bathrooms"
          options={[
            ["1", "1 bathroom"],
            ["2", "2 bathrooms"],
            ["3", "3 bathrooms"],
            ["4", "4 bathrooms"],
            ["5+", "5+ bathrooms"],
          ]}
        />

        <SelectField
          label="Kitchens"
          value={value.kitchens}
          onChange={(newValue) => onFieldChange("kitchens", newValue)}
          placeholder="Select kitchens"
          options={[
            ["0", "0"],
            ["1", "1 kitchen"],
            ["2", "2 kitchens"],
            ["3+", "3+ kitchens"],
          ]}
        />

        <SelectField
          label="Balconies"
          value={value.balconies}
          onChange={(newValue) => onFieldChange("balconies", newValue)}
          placeholder="Select balconies"
          options={[
            ["0", "No balcony"],
            ["1", "1 balcony"],
            ["2", "2 balconies"],
            ["3+", "3+ balconies"],
          ]}
        />

        <SelectField
          label="Laundry rooms"
          value={value.laundries}
          onChange={(newValue) => onFieldChange("laundries", newValue)}
          placeholder="Select laundry rooms"
          options={[
            ["0", "0"],
            ["1", "1 laundry"],
            ["2+", "2+ laundries"],
          ]}
        />

        <TextField
          label="Suburb"
          value={value.suburb}
          onChange={(newValue) => onFieldChange("suburb", newValue)}
          placeholder="e.g. South Yarra"
        />

        <TextField
          label="Postcode"
          value={value.postcode}
          onChange={(newValue) => onFieldChange("postcode", newValue)}
          placeholder="e.g. 3141"
        />
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-gray-700">
          Are there pets at the property?
        </p>

        <div className="flex gap-3">
          {["yes", "no"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onFieldChange("pets", option)}
              className={`rounded-xl border px-5 py-2.5 capitalize transition ${
                value.pets === option
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, placeholder, options }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
      >
        <option value="">{placeholder}</option>

        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
      />
    </div>
  );
}
