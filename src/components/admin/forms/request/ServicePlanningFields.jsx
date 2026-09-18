export default function ServicePlanningFields({ value, onChange }) {
  function updateField(field, fieldValue) {
    onChange(field, fieldValue);
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-gray-700">
          Service date
        </span>

        <input
          type="date"
          value={value?.serviceDate || ""}
          onChange={(event) => updateField("serviceDate", event.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-gray-700">
          Start time
        </span>

        <input
          type="time"
          value={value?.startTime || ""}
          onChange={(event) => updateField("startTime", event.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-gray-700">
          End time
        </span>

        <input
          type="time"
          value={value?.endTime || ""}
          onChange={(event) => updateField("endTime", event.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500"
        />
      </label>
    </div>
  );
}
