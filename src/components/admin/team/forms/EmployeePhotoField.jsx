export default function EmployeePhotoField({
  employeeName,
  photoPreview,
  onPhotoChange,
}) {
  const initials = getInitials(employeeName);

  return (
    <div className="rounded-2xl border border-[#1A1A1A]/10 bg-white p-6">
      <div>
        <h3 className="font-heading text-lg text-[#1A1A1A]">Employee Photo</h3>

        <p className="mt-1 text-sm text-[#1A1A1A]/50">
          Used on the public team profile and cleaner introduction card.
        </p>
      </div>

      <div className="mt-6 flex items-center gap-6">
        {photoPreview ? (
          <img
            src={photoPreview}
            alt="Employee preview"
            className="h-28 w-28 shrink-0 rounded-2xl object-cover"
          />
        ) : (
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-[#E8F5E9] text-2xl font-heading text-[#2E7D32]">
            {initials}
          </div>
        )}

        <div>
          <label
            htmlFor="employee-photo"
            className="inline-flex cursor-pointer rounded-xl bg-[#1B3D1E] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#143718]"
          >
            {photoPreview ? "Change Photo" : "Upload Photo"}
          </label>

          <input
            id="employee-photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onPhotoChange}
            className="hidden"
          />

          <p className="mt-3 text-xs leading-5 text-[#1A1A1A]/45">
            JPG, PNG or WebP. Maximum 5 MB.
          </p>
        </div>
      </div>
    </div>
  );
}

function getInitials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "MG"
  );
}
