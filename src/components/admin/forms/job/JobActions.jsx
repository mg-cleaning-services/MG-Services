export default function JobActions({
  status,
  saving,
  onCancel,
  onComplete,
  onSave,
}) {
  return (
    <div className="mt-10 flex flex-wrap justify-between gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl border border-red-300 px-5 py-3 font-medium text-red-700"
      >
        Cancel Job
      </button>

      <div className="flex flex-wrap gap-3">
        {status === "assigned" && (
          <button
            type="button"
            onClick={onComplete}
            className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700"
          >
            Mark Completed
          </button>
        )}

        <button
          type="button"
          disabled={saving}
          onClick={onSave}
          className="rounded-xl bg-gray-900 px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Job"}
        </button>
      </div>
    </div>
  );
}
