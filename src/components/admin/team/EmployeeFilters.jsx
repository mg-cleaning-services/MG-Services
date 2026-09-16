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
    <div className="mb-8 rounded-2xl border border-[#2E7D32]/10 bg-white p-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Search */}
        <div>
          <label
            htmlFor="employee-search"
            className="mb-2 block text-sm font-medium text-[#1A1A1A]"
          >
            Search
          </label>

          <input
            id="employee-search"
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search employees..."
            className="h-11 w-full rounded-xl border border-[#1A1A1A]/10 bg-white px-4 text-sm outline-none focus:border-[#2E7D32]/40 focus:ring-2 focus:ring-[#2E7D32]/10"
          />
        </div>

        {/* Role */}
        <div>
          <label
            htmlFor="employee-role"
            className="mb-2 block text-sm font-medium text-[#1A1A1A]"
          >
            Role
          </label>

          <select
            id="employee-role"
            value={role}
            onChange={(event) => onRoleChange(event.target.value)}
            className="h-11 w-full rounded-xl border border-[#1A1A1A]/10 bg-white px-4 text-sm outline-none focus:border-[#2E7D32]/40 focus:ring-2 focus:ring-[#2E7D32]/10"
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
            className="mb-2 block text-sm font-medium text-[#1A1A1A]"
          >
            Location
          </label>

          <select
            id="employee-location"
            value={location}
            onChange={(event) => onLocationChange(event.target.value)}
            className="h-11 w-full rounded-xl border border-[#1A1A1A]/10 bg-white px-4 text-sm outline-none focus:border-[#2E7D32]/40 focus:ring-2 focus:ring-[#2E7D32]/10"
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
