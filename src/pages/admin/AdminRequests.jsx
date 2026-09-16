import RequestCard from "@/components/admin/request/RequestCard";
import useAdminRequests from "@/hooks/useAdminRequests";

export default function AdminRequests() {
  const {
    filteredRequests,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    stats,

    loading,
    error,

    handleStatusChange,
  } = useAdminRequests();

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Admin
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Cleaning Requests
          </h1>

          <p className="mt-2 text-gray-600">
            Review customer requests, contact clients and prepare confirmed
            jobs.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard label="New Requests" value={stats.newRequests} />

          <StatCard label="Active Requests" value={stats.activeRequests} />

          <StatCard label="Converted" value={stats.convertedRequests} />
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-col gap-4 md:flex-row">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by customer, suburb or request ID..."
            className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-4 py-3"
          >
            <option value="active">Active</option>

            <option value="all">All statuses</option>

            <option value="new">New</option>

            <option value="contacted">Contacted</option>

            <option value="in-discussion">In Discussion</option>

            <option value="converted">Converted</option>

            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Content */}
        <div className="mt-8">
          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
              <p className="font-medium text-gray-900">Loading requests...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
              <p className="font-medium text-red-700">{error}</p>
            </div>
          ) : filteredRequests.length > 0 ? (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <p className="font-medium text-gray-900">No requests found</p>

              <p className="mt-2 text-sm text-gray-500">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">{label}</p>

      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
