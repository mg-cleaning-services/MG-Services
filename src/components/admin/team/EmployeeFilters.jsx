export default function EmployeeFilters({
  search,
  onSearchChange,
  role,
  onRoleChange,
  location,
  onLocationChange,
  roles,
  locations,
}) {
  return (
    <div className="mb-8 rounded-2xl border border-brand/10 bg-white p-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Search */}
        <div>
          <label
            htmlFor="employee-search"
            className="mb-2 block text-sm font-medium text-ink"
          >
            Search
          </label>

          <input
            id="employee-search"
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search employees..."
            className="h-11 w-full rounded-xl border border-ink/10 bg-white px-4 text-sm outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/10"
          />
        </div>

        {/* Role */}
        <div>
          <label
            htmlFor="employee-role"
            className="mb-2 block text-sm font-medium text-ink"
          >
            Role
          </label>

          <select
            id="employee-role"
            value={role}
            onChange={(event) => onRoleChange(event.target.value)}
            className="h-11 w-full rounded-xl border border-ink/10 bg-white px-4 text-sm outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/10"
          >
            <option value="all">All roles</option>

            {roles.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label
            htmlFor="employee-location"
            className="mb-2 block text-sm font-medium text-ink"
          >
            Location
          </label>

          <select
            id="employee-location"
            value={location}
            onChange={(event) => onLocationChange(event.target.value)}
            className="h-11 w-full rounded-xl border border-ink/10 bg-white px-4 text-sm outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/10"
          >
            <option value="all">All locations</option>

            {locations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
