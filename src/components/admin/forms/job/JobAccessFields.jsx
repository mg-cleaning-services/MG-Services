export default function JobAccessFields({ value, onChange }) {
  function updateField(field, fieldValue) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  return (
    <>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Access instructions
        </label>

        <textarea
          rows={4}
          value={value.instructions}
          onChange={(event) => updateField("instructions", event.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3"
        />
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Parking information
        </label>

        <textarea
          rows={3}
          value={value.parking}
          onChange={(event) => updateField("parking", event.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3"
        />
      </div>

      <label className="mt-4 flex items-center gap-3">
        <input
          type="checkbox"
          checked={value.contactOnArrival}
          onChange={(event) =>
            updateField("contactOnArrival", event.target.checked)
          }
        />

        <span className="text-sm text-gray-700">
          Contact customer on arrival
        </span>
      </label>
    </>
  );
}
