import FormInput from "../ui/FormInput";

export default function JobServiceLocationFields({ value, onChange }) {
  function updateField(field, fieldValue) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  return (
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
  );
}
