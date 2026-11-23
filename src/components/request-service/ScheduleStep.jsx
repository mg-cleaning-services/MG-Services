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
    <div>
      {/* STEP HEADER */}
      <div className="max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
          Schedule
        </p>

        <h2 className="font-heading text-2xl leading-tight text-ink md:text-3xl">
          When would you like your cleaning?
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-ink/60 md:text-base">
          Tell us your preferred date and a little about the current condition
          of the property. We'll confirm availability with you before the
          service is booked.
        </p>
      </div>

      {/* PREFERRED SCHEDULE */}
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-ink/70">
            Preferred date
          </label>

          <input
            type="date"
            value={value.preferredDate}
            onChange={(event) =>
              onFieldChange("preferredDate", event.target.value)
            }
            className="w-full rounded-xl border border-brand/10 bg-surface px-4 py-3.5 text-sm text-ink outline-none transition-all duration-300 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/5"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink/70">
            Preferred time
          </label>

          <select
            value={value.preferredTime}
            onChange={(event) =>
              onFieldChange("preferredTime", event.target.value)
            }
            className="w-full rounded-xl border border-brand/10 bg-surface px-4 py-3.5 text-sm text-ink outline-none transition-all duration-300 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/5"
          >
            <option value="">Select preferred time</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
            <option value="flexible">I'm flexible</option>
          </select>
        </div>
      </div>

      {/* PROPERTY CONDITION */}
      <div className="mt-8 border-t border-brand/10 pt-7">
        <p className="text-sm font-semibold text-ink">
          How would you describe the current condition of the property?
        </p>

        <p className="mt-1 text-sm leading-relaxed text-ink/50">
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
                className={`relative rounded-2xl border p-5 text-left transition-all duration-300 ${
                  selected
                    ? "border-brand bg-brand-soft"
                    : "border-brand/10 bg-surface hover:border-brand/30"
                }`}
              >
                <p
                  className={`font-semibold ${
                    selected ? "text-brand" : "text-ink"
                  }`}
                >
                  {option.title}
                </p>

                <p className="mt-2 text-sm leading-relaxed text-ink/50">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* LAST PROFESSIONAL CLEAN */}
      <div className="mt-8">
        <label className="mb-2 block text-sm font-medium text-ink/70">
          When was the property last professionally cleaned?
        </label>

        <select
          value={value.lastProfessionalClean}
          onChange={(event) =>
            onFieldChange("lastProfessionalClean", event.target.value)
          }
          className="w-full rounded-xl border border-brand/10 bg-surface px-4 py-3.5 text-sm text-ink outline-none transition-all duration-300 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/5 md:max-w-md"
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

      {/* FOCUS AREAS */}
      <div className="mt-8">
        <label className="mb-2 block text-sm font-medium text-ink/70">
          What would you like us to focus on?
        </label>

        <p className="mb-3 text-sm leading-relaxed text-ink/50">
          Tell us about any areas that need extra attention or anything else
          that would help us understand the job.
        </p>

        <textarea
          rows={5}
          value={value.focusAreas}
          onChange={(event) => onFieldChange("focusAreas", event.target.value)}
          placeholder="For example: the kitchen needs extra attention, there are stains on the carpet, the bathrooms haven't been deep cleaned recently..."
          className="w-full resize-y rounded-xl border border-brand/10 bg-surface px-4 py-3.5 text-sm text-ink outline-none transition-all duration-300 placeholder:text-ink/30 focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/5"
        />
      </div>
    </div>
  );
}
