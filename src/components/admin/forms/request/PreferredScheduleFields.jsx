import FormInput from "../ui/FormInput";
import FormSelect from "../ui/FormSelect";

export default function PreferredScheduleFields({ value, onChange }) {
  function updateField(field, fieldValue) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormInput
        type="date"
        label="Preferred date"
        value={value.preferredDate}
        onChange={(fieldValue) => updateField("preferredDate", fieldValue)}
      />

      <FormSelect
        label="Preferred time"
        value={value.preferredTime}
        onChange={(fieldValue) => updateField("preferredTime", fieldValue)}
        options={[
          ["morning", "Morning"],
          ["afternoon", "Afternoon"],
          ["evening", "Evening"],
          ["flexible", "Flexible"],
        ]}
      />
    </div>
  );
}
