import FormInput from "../ui/FormInput";

export default function JobDetailsFields({ value, onChange }) {
  function updateField(field, fieldValue) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  return (
    <>
      <p className="mb-5 text-sm text-gray-500">
        Complete the details agreed with the customer before converting this
        request into a job.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <FormInput
          type="date"
          label="Confirmed date"
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

        <FormInput
          type="number"
          label="Final price"
          value={value.finalPrice}
          onChange={(fieldValue) => updateField("finalPrice", fieldValue)}
        />
      </div>
    </>
  );
}
