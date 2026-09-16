const conditionOptions = [
  {
    value: "maintained",
    title: "Well maintained",
    description: "Cleaned regularly and mainly needs maintenance.",
  },
  {
    value: "needs-attention",
    title: "Needs some attention",
    description: "Some areas need more detailed cleaning.",
  },
  {
    value: "heavy",
    title: "Needs a thorough clean",
    description: "Significant buildup or several areas need attention.",
  },
];

export default function ScheduleStep({ value, onFieldChange }) {
  return (
    <div className="mt-10 rounded-2xl border border-gray-200 p-6">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
          Step 3
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-gray-900">
          When would you like your cleaning?
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Tell us your preferred date and a little about the current condition
          of the property. We'll confirm availability with you before the
          service is booked.
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Preferred date
          </label>

          <input
            type="date"
            value={value.preferredDate}
            onChange={(event) =>
              onFieldChange("preferredDate", event.target.value)
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Preferred time
          </label>

          <select
            value={value.preferredTime}
            onChange={(event) =>
              onFieldChange("preferredTime", event.target.value)
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-3"
          >
            <option value="">Select preferred time</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
            <option value="flexible">I'm flexible</option>
          </select>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-sm font-medium text-gray-700">
          How would you describe the current condition of the property?
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Don't worry if you're not sure. This just helps us understand the
          amount of work involved.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {conditionOptions.map((option) => {
            const selected = value.condition === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onFieldChange("condition", option.value)}
                className={`rounded-xl border p-4 text-left transition ${
                  selected
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
              >
                <p className="font-medium">{option.title}</p>

                <p
                  className={`mt-2 text-sm ${
                    selected ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          When was the property last professionally cleaned?
        </label>

        <select
          value={value.lastProfessionalClean}
          onChange={(event) =>
            onFieldChange("lastProfessionalClean", event.target.value)
          }
          className="w-full rounded-xl border border-gray-300 px-4 py-3 md:max-w-md"
        >
          <option value="">Select an option</option>
          <option value="less-than-month">Less than a month ago</option>
          <option value="1-3-months">1–3 months ago</option>
          <option value="3-6-months">3–6 months ago</option>
          <option value="6-plus-months">More than 6 months ago</option>
          <option value="never">Never professionally cleaned</option>
          <option value="unsure">I'm not sure</option>
        </select>
      </div>

      <div className="mt-8">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          What would you like us to focus on?
        </label>

        <p className="mb-3 text-sm text-gray-500">
          Tell us about any areas that need extra attention or anything else
          that would help us understand the job.
        </p>

        <textarea
          rows={5}
          value={value.focusAreas}
          onChange={(event) => onFieldChange("focusAreas", event.target.value)}
          placeholder="For example: the kitchen needs extra attention, there are stains on the carpet, the bathrooms haven't been deep cleaned recently..."
          className="w-full rounded-xl border border-gray-300 px-4 py-3"
        />
      </div>
    </div>
  );
}
