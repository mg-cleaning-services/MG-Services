import FormInput from "../ui/FormInput";

export default function ServiceLocationFields({ value, onChange }) {
  function updateField(field, fieldValue) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  return (
    <>
      <p className="mb-5 text-sm text-gray-500">
        Enter the exact service address after confirming the job with the
        customer.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <FormInput
          label="Street address"
          value={value.address}
          onChange={(fieldValue) => updateField("address", fieldValue)}
        />

        <FormInput
          label="Unit / Apartment"
          value={value.unit}
          onChange={(fieldValue) => updateField("unit", fieldValue)}
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <FormInput
          label="Suburb"
          value={value.suburb}
          onChange={(fieldValue) => updateField("suburb", fieldValue)}
        />

        <FormInput
          label="Postcode"
          value={value.postcode}
          onChange={(fieldValue) => updateField("postcode", fieldValue)}
        />
      </div>
    </>
  );
}
