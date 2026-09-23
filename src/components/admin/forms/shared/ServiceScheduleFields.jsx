import FormInput from "@/components/admin/forms/ui/FormInput";

export default function ServiceScheduleFields({
  value,
  onChange,
  description = "",
}) {
  const schedule = value || {};

  function updateField(field, fieldValue) {
    onChange({
      ...schedule,
      [field]: fieldValue,
    });
  }

  return (
    <div className="space-y-4">
      {description ? (
        <p className="text-sm text-slate-500">{description}</p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <FormInput
          label="Service date"
          type="date"
          value={schedule.serviceDate || ""}
          onChange={(value) => updateField("serviceDate", value)}
        />

        <FormInput
          label="Start time"
          type="time"
          value={schedule.startTime || ""}
          onChange={(value) => updateField("startTime", value)}
        />

        <FormInput
          label="End time"
          type="time"
          value={schedule.endTime || ""}
          onChange={(value) => updateField("endTime", value)}
        />
      </div>
    </div>
  );
}
