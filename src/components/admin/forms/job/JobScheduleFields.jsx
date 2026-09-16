import FormInput from "../ui/FormInput";

export default function JobScheduleFields({ value, onChange }) {
  function updateField(field, fieldValue) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <FormInput
        type="date"
        label="Date"
        value={value.date}
        onChange={(fieldValue) => updateField("date", fieldValue)}
      />

      <FormInput
        type="time"
        label="Start time"
        value={value.startTime}
        onChange={(fieldValue) => updateField("startTime", fieldValue)}
      />

      <FormInput
        type="number"
        label="Estimated hours"
        value={value.estimatedHours}
        onChange={(fieldValue) => updateField("estimatedHours", fieldValue)}
      />
    </div>
  );
}
