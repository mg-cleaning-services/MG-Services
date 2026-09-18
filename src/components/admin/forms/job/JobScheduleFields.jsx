import FormInput from "../ui/FormInput";

export default function JobScheduleFields({ value, onChange }) {
  function updateField(field, fieldValue) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        type="time"
        label="End time"
        value={value.endTime}
        onChange={(fieldValue) => updateField("endTime", fieldValue)}
      />

      <FormInput
        type="number"
        label="Estimated labour hours"
        value={value.estimatedLabourHours ?? ""}
        onChange={(fieldValue) =>
          updateField("estimatedLabourHours", fieldValue)
        }
      />
    </div>
  );
}
