export default function PropertyStep({ value, onFieldChange }) {
  return (
    <div>
      {/* STEP HEADER */}
      <div className="max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#2E7D32]">
          Property Details
        </p>

        <h2 className="font-heading text-2xl leading-tight text-[#1A1A1A] md:text-3xl">
          Tell us about your property
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]/60 md:text-base">
          This helps us understand the size of the job and prepare a more
          accurate recommendation.
        </p>
      </div>

      {/* PROPERTY FIELDS */}
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <SelectField
          label="Property type"
          value={value.propertyType}
          onChange={(newValue) => onFieldChange("propertyType", newValue)}
          options={[
            { value: "", label: "Select property type" },
            { value: "apartment", label: "Apartment" },
            { value: "house", label: "House" },
            { value: "townhouse", label: "Townhouse" },
            { value: "unit", label: "Unit" },
            { value: "other", label: "Other" },
          ]}
        />

        <SelectField
          label="Floors"
          value={value.floors}
          onChange={(newValue) => onFieldChange("floors", newValue)}
          options={[
            { value: "", label: "Select floors" },
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4+", label: "4+" },
          ]}
        />

        <SelectField
          label="Bedrooms"
          value={value.bedrooms}
          onChange={(newValue) => onFieldChange("bedrooms", newValue)}
          options={[
            { value: "", label: "Select bedrooms" },
            { value: "0", label: "0" },
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
            { value: "5+", label: "5+" },
          ]}
        />

        <SelectField
          label="Bathrooms"
          value={value.bathrooms}
          onChange={(newValue) => onFieldChange("bathrooms", newValue)}
          options={[
            { value: "", label: "Select bathrooms" },
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
            { value: "5+", label: "5+" },
          ]}
        />

        <SelectField
          label="Kitchens"
          value={value.kitchens}
          onChange={(newValue) => onFieldChange("kitchens", newValue)}
          options={[
            { value: "", label: "Select kitchens" },
            { value: "0", label: "0" },
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3+", label: "3+" },
          ]}
        />

        <SelectField
          label="Balconies"
          value={value.balconies}
          onChange={(newValue) => onFieldChange("balconies", newValue)}
          options={[
            { value: "", label: "Select balconies" },
            { value: "0", label: "0" },
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3+", label: "3+" },
          ]}
        />

        <SelectField
          label="Laundry rooms"
          value={value.laundries}
          onChange={(newValue) => onFieldChange("laundries", newValue)}
          options={[
            { value: "", label: "Select laundry rooms" },
            { value: "0", label: "0" },
            { value: "1", label: "1" },
            { value: "2+", label: "2+" },
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

      {/* PETS */}
      <div className="mt-8 border-t border-[#2E7D32]/10 pt-7">
        <p className="text-sm font-semibold text-[#1A1A1A]">
          Are there pets at the property?
        </p>

        <p className="mt-1 text-sm text-[#1A1A1A]/50">
          This helps our team prepare before arriving.
        </p>

        <div className="mt-4 flex gap-3">
          {[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ].map((option) => {
            const selected = value.pets === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onFieldChange("pets", option.value)}
                className={`min-w-24 rounded-xl border px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                  selected
                    ? "border-[#2E7D32] bg-[#E8F5E9] text-[#2E7D32]"
                    : "border-[#2E7D32]/10 bg-white text-[#1A1A1A]/60 hover:border-[#2E7D32]/30"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#1A1A1A]/70">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-[#2E7D32]/10 bg-[#F9FAF9] px-4 py-3.5 text-sm text-[#1A1A1A] outline-none transition-all duration-300 focus:border-[#2E7D32] focus:bg-white focus:ring-4 focus:ring-[#2E7D32]/5"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#1A1A1A]/70">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#2E7D32]/10 bg-[#F9FAF9] px-4 py-3.5 text-sm text-[#1A1A1A] outline-none transition-all duration-300 placeholder:text-[#1A1A1A]/30 focus:border-[#2E7D32] focus:bg-white focus:ring-4 focus:ring-[#2E7D32]/5"
      />
    </div>
  );
}
