import FormInput from "../ui/FormInput";

export default function PricingFields({ value, onChange }) {
  function updateField(field, fieldValue) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  return (
    <div className="max-w-sm">
      <FormInput
        type="number"
        label="Final agreed price"
        value={value.finalPrice ?? ""}
        onChange={(fieldValue) => updateField("finalPrice", fieldValue)}
      />
    </div>
  );
}
