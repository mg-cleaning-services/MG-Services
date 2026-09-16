import { useEffect, useMemo, useState } from "react";

import { getJobs } from "@/services/jobService";

export default function useAdminJobs() {
  const [jobs, setJobs] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadJobs() {
      try {
        setLoading(true);
        setLoadError("");

        const data = await getJobs();

        if (!active) {
          return;
        }

        setJobs(data);
      } catch (error) {
        console.error("Could not load jobs:", error);

        if (active) {
          setLoadError("Could not load jobs.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadJobs();

    return () => {
      active = false;
    };
  }, []);

  const filteredJobs = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const fullName =
        `${job.customer.firstName} ${job.customer.lastName}`.toLowerCase();

      const matchesSearch =
        job.jobCode?.toLowerCase().includes(searchValue) ||
        fullName.includes(searchValue) ||
        job.property.suburb?.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          ["unassigned", "assigned"].includes(job.status)) ||
        job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      unassigned: jobs.filter((job) => job.status === "unassigned").length,

      assigned: jobs.filter((job) => job.status === "assigned").length,

      completed: jobs.filter((job) => job.status === "completed").length,
    };
  }, [jobs]);

  return {
    jobs,
    filteredJobs,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    stats,

    loading,
    loadError,
  };
}
