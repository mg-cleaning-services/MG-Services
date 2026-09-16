import FormSelect from "../ui/FormSelect";

export default function PropertyConditionFields({
  condition,
  notes,
  onConditionChange,
  onNotesChange,
}) {
  function updateCondition(field, value) {
    onConditionChange({
      ...condition,
      [field]: value,
    });
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <FormSelect
          label="Condition"
          value={condition.level}
          onChange={(value) => updateCondition("level", value)}
          options={[
            ["maintained", "Well Maintained"],
            ["needs-attention", "Needs Some Attention"],
            ["heavy", "Needs a Thorough Clean"],
          ]}
        />

        <FormSelect
          label="Last professional clean"
          value={condition.lastProfessionalClean}
          onChange={(value) => updateCondition("lastProfessionalClean", value)}
          options={[
            ["less-than-month", "Less Than a Month"],
            ["1-3-months", "1–3 Months"],
            ["3-6-months", "3–6 Months"],
            ["6-plus-months", "6+ Months"],
            ["never", "Never"],
            ["unsure", "Unsure"],
          ]}
        />
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Notes / cleaning priorities
        </label>

        <textarea
          rows={5}
          value={notes ?? ""}
          onChange={(event) => onNotesChange(event.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3"
        />
      </div>
    </>
  );
}
