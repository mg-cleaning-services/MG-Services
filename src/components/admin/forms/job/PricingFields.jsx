import FormInput from "../ui/FormInput";

export default function PricingFields({ value, onChange }) {
  function updateField(field, fieldValue) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  return (
    <div className="grid max-w-2xl gap-4 md:grid-cols-2">
      <FormInput
        type="number"
        label="Agreed price"
        value={value.agreedPrice ?? ""}
        onChange={(fieldValue) => updateField("agreedPrice", fieldValue)}
      />

      <FormInput
        type="number"
        label="Final price"
        value={value.finalPrice ?? ""}
        onChange={(fieldValue) => updateField("finalPrice", fieldValue)}
      />
    </div>
  );
}
