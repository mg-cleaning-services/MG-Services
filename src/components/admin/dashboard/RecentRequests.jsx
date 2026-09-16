import { Link } from "react-router-dom";

import SectionCard from "./SectionCard";
import EmptyState from "./EmptyState";

export default function RecentRequests({ requests }) {
  return (
    <SectionCard
      title="Recent Requests"
      description="Latest customer enquiries."
    >
      {requests.length === 0 ? (
        <EmptyState text="No requests yet." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2E7D32]/10 text-left">
                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/40">
                  Request
                </th>

                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/40">
                  Customer
                </th>

                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/40">
                  Location
                </th>

                <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/40">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {requests.map((request) => (
                <tr
                  key={request.id}
                  className="border-b border-[#2E7D32]/5 last:border-0"
                >
                  <td className="py-4">
                    <Link
                      to={`/admin/requests/${request.id}`}
                      className="font-semibold text-[#2E7D32] hover:underline"
                    >
                      {request.requestCode || "Request"}
                    </Link>
                  </td>

                  <td className="py-4 text-sm text-[#1A1A1A]">
                    {formatCustomerName(request.customer)}
                  </td>

                  <td className="py-4 text-sm text-[#1A1A1A]/60">
                    {request.property?.suburb || "Not provided"}
                  </td>

                  <td className="py-4">
                    <StatusBadge status={request.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}

function StatusBadge({ status }) {
  const styles = {
    new: "bg-[#E8F5E9] text-[#2E7D32]",
    contacted: "bg-blue-50 text-blue-700",
    "in-discussion": "bg-amber-50 text-amber-700",
    converted: "bg-purple-50 text-purple-700",
    closed: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {formatStatus(status)}
    </span>
  );
}

function formatCustomerName(customer) {
  return (
    [customer?.firstName, customer?.lastName].filter(Boolean).join(" ") ||
    "Unknown"
  );
}

function formatStatus(status) {
  if (!status) return "Unknown";

  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
