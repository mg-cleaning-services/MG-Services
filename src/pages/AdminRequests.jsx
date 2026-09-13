import { useMemo, useState } from "react";
import RequestCard from "../components/admin/request/RequestCard";
import { getRequests, updateRequestStatus } from "@/services/requestService";

export default function AdminRequests() {
  const [requests, setRequests] = useState(getRequests());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        request.id.toLowerCase().includes(searchValue) ||
        request.customer.firstName.toLowerCase().includes(searchValue) ||
        request.customer.lastName.toLowerCase().includes(searchValue) ||
        request.property.suburb.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, search, statusFilter]);

  function handleStatusChange(requestId, status) {
    setRequests((currentRequests) =>
      updateRequestStatus(currentRequests, requestId, status),
    );
  }

  const newCount = requests.filter(
    (request) => request.status === "new",
  ).length;

  const activeCount = requests.filter((request) =>
    ["new", "contacted", "in-discussion"].includes(request.status),
  ).length;

  const convertedCount = requests.filter(
    (request) => request.status === "converted",
  ).length;

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-7xl px-6 py-12">
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

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard label="New Requests" value={newCount} />
          <StatCard label="Active Requests" value={activeCount} />
          <StatCard label="Converted" value={convertedCount} />
        </div>

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
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="in-discussion">In Discussion</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="mt-8 space-y-4">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onStatusChange={handleStatusChange}
              />
            ))
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
