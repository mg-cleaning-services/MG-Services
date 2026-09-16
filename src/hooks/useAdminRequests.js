import { useEffect, useMemo, useState } from "react";

import { getRequests, updateRequestStatus } from "@/services/requestService";

export default function useAdminRequests() {
  const [requests, setRequests] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadRequests() {
      try {
        setLoading(true);
        setError("");

        const data = await getRequests();

        if (!active) {
          return;
        }

        setRequests(data);
      } catch (error) {
        console.error("Could not load requests:", error);

        if (active) {
          setError("Could not load cleaning requests.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRequests();

    return () => {
      active = false;
    };
  }, []);

  const filteredRequests = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        request.requestCode?.toLowerCase().includes(searchValue) ||
        request.customer?.firstName?.toLowerCase().includes(searchValue) ||
        request.customer?.lastName?.toLowerCase().includes(searchValue) ||
        request.property?.suburb?.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          ["new", "contacted", "in-discussion"].includes(request.status)) ||
        request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, search, statusFilter]);

  const stats = useMemo(() => {
    const newRequests = requests.filter(
      (request) => request.status === "new",
    ).length;

    const activeRequests = requests.filter((request) =>
      ["new", "contacted", "in-discussion"].includes(request.status),
    ).length;

    const convertedRequests = requests.filter(
      (request) => request.status === "converted",
    ).length;

    return {
      newRequests,
      activeRequests,
      convertedRequests,
    };
  }, [requests]);

  async function handleStatusChange(requestId, status) {
    try {
      const updatedRequest = await updateRequestStatus(requestId, status);

      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === requestId ? updatedRequest : request,
        ),
      );
    } catch (error) {
      console.error("Could not update request status:", error);

      alert("Could not update the request status. Please try again.");
    }
  }

  return {
    requests,
    filteredRequests,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    stats,

    loading,
    error,

    handleStatusChange,
  };
}
