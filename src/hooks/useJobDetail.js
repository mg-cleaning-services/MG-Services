import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getJobById, updateJob } from "@/services/jobService";

import { getEmployees } from "@/services/employeeService";

import {
  assignEmployeeToJob,
  getJobAssignments,
  removeEmployeeFromJob,
} from "@/services/jobAssignmentService";

import useServiceEstimate from "@/hooks/shared/useServiceEstimate";
import useJobAvailability from "@/hooks/shared/useJobAvailability";

export default function useJobDetail() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  /*
  |--------------------------------------------------------------------------
  | GENERAL STATE
  |--------------------------------------------------------------------------
  */

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [assignmentLoading, setAssignmentLoading] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let ignore = false;

    async function loadPage() {
      try {
        setLoading(true);
        setLoadError("");

        const [jobData, employeeData, assignmentData] = await Promise.all([
          getJobById(id),
          getEmployees(),
          getJobAssignments(id),
        ]);

        if (ignore) {
          return;
        }

        setJob(jobData);
        setEmployees(employeeData);
        setAssignments(assignmentData);
      } catch (error) {
        console.error("Could not load job:", error);

        if (!ignore) {
          setLoadError("Could not load this job.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadPage();

    return () => {
      ignore = true;
    };
  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | AUTOMATIC SERVICE ESTIMATE
  |--------------------------------------------------------------------------
  |
  | Shared calculation logic lives in useServiceEstimate.
  |
  | This hook only decides where the calculated values belong
  | in the Job model.
  |
  | agreedPrice and finalPrice are NEVER changed automatically.
  |
  */

  const handleEstimateChange = useCallback(({ price, labourHours }) => {
    setJob((current) => {
      if (!current) {
        return current;
      }

      const currentPrice = Number(current.estimation?.price ?? 0);
      const currentLabourHours = Number(current.estimation?.labourHours ?? 0);

      if (currentPrice === price && currentLabourHours === labourHours) {
        return current;
      }

      return {
        ...current,

        estimation: {
          ...(current.estimation || {}),
          price,
          labourHours,
        },
      };
    });
  }, []);

  const {
    pricingCatalog,
    selectedPackage,
    calculationComplete,
    serviceBreakdown,
    packagePrice,
    packageLabourHours,
  } = useServiceEstimate({
    service: job?.service,
    property: job?.property,
    onEstimateChange: handleEstimateChange,
  });

  /*
  |--------------------------------------------------------------------------
  | OPERATIONAL AVAILABILITY
  |--------------------------------------------------------------------------
  |
  | Shared conflict checking lives in useJobAvailability.
  |
  | excludeJobId prevents the current Job from conflicting
  | with itself when its schedule is checked.
  |
  */

  const {
    jobConflictsByEmployee,
    checkingConflicts,
    getEmployeeJobConflicts,
    hasEmployeeJobConflict,
  } = useJobAvailability({
    serviceDate: job?.schedule?.serviceDate,
    startTime: job?.schedule?.startTime,
    endTime: job?.schedule?.endTime,
    excludeJobId: job?.id,
  });

  /*
  |--------------------------------------------------------------------------
  | EMPLOYEES
  |--------------------------------------------------------------------------
  */

  const activeEmployees = employees.filter(
    (employee) => employee.status === "active",
  );

  const assignedEmployeeIds = new Set(
    assignments.map((assignment) => String(assignment.employeeId)),
  );

  const availableEmployees = activeEmployees.filter(
    (employee) => !assignedEmployeeIds.has(String(employee.id)),
  );

  /*
  |--------------------------------------------------------------------------
  | EDIT JOB
  |--------------------------------------------------------------------------
  */

  function updateJobSection(section, value) {
    setJob((current) => ({
      ...current,
      [section]: value,
    }));
  }

  function updateJobField(field, value) {
    setJob((current) => ({
      ...current,
      [field]: value,
    }));
  }

  /*
  |--------------------------------------------------------------------------
  | SAVE JOB
  |--------------------------------------------------------------------------
  */

  async function saveJob() {
    if (!job) {
      return null;
    }

    if (
      !job.schedule?.serviceDate ||
      !job.schedule?.startTime ||
      !job.schedule?.endTime
    ) {
      setSaveMessage("Please enter the service date, start time and end time.");

      return null;
    }

    if (job.schedule.endTime <= job.schedule.startTime) {
      setSaveMessage("End time must be later than start time.");

      return null;
    }

    /*
     * If the Job already has assigned employees,
     * changing its schedule may create conflicts
     * with other Jobs.
     */

    const conflictingAssignments = assignments.filter((assignment) =>
      hasEmployeeJobConflict(assignment.employeeId),
    );

    if (conflictingAssignments.length > 0) {
      setSaveMessage(
        "One or more assigned employees have a conflicting job. Please review the team or schedule before saving.",
      );

      return null;
    }

    try {
      setSaving(true);
      setSaveMessage("");

      const updatedJob = {
        ...job,

        estimation: {
          ...job.estimation,

          labourHours:
            job.estimation?.labourHours !== "" &&
            job.estimation?.labourHours !== null &&
            job.estimation?.labourHours !== undefined
              ? Number(job.estimation.labourHours)
              : null,

          price:
            job.estimation?.price !== "" &&
            job.estimation?.price !== null &&
            job.estimation?.price !== undefined
              ? Number(job.estimation.price)
              : null,
        },

        pricing: {
          ...job.pricing,

          agreedPrice:
            job.pricing?.agreedPrice !== "" &&
            job.pricing?.agreedPrice !== null &&
            job.pricing?.agreedPrice !== undefined
              ? Number(job.pricing.agreedPrice)
              : null,

          finalPrice:
            job.pricing?.finalPrice !== "" &&
            job.pricing?.finalPrice !== null &&
            job.pricing?.finalPrice !== undefined
              ? Number(job.pricing.finalPrice)
              : null,
        },
      };

      const savedJob = await updateJob(updatedJob);

      setJob(savedJob);

      setSaveMessage("Job saved successfully.");

      return savedJob;
    } catch (error) {
      console.error("Could not save job:", error);

      setSaveMessage("Could not save job.");

      throw error;
    } finally {
      setSaving(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | ASSIGN EMPLOYEE
  |--------------------------------------------------------------------------
  */

  async function addEmployee() {
    if (!selectedEmployeeId || !job) {
      return;
    }

    if (hasEmployeeJobConflict(selectedEmployeeId)) {
      alert("This employee already has another job during this time.");

      return;
    }

    try {
      setAssignmentLoading(true);

      const newAssignment = await assignEmployeeToJob(
        job.id,
        selectedEmployeeId,
      );

      const nextAssignments = [...assignments, newAssignment];

      setAssignments(nextAssignments);
      setSelectedEmployeeId("");

      if (job.status === "unassigned") {
        const updatedJob = await updateJob({
          ...job,
          status: "assigned",
        });

        setJob(updatedJob);
      }
    } catch (error) {
      console.error("Could not assign employee:", error);

      alert("Could not assign this employee.");
    } finally {
      setAssignmentLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | REMOVE EMPLOYEE
  |--------------------------------------------------------------------------
  */

  async function removeEmployee(employeeId) {
    try {
      setAssignmentLoading(true);

      await removeEmployeeFromJob(job.id, employeeId);

      const nextAssignments = assignments.filter(
        (assignment) => String(assignment.employeeId) !== String(employeeId),
      );

      setAssignments(nextAssignments);

      if (nextAssignments.length === 0 && job.status === "assigned") {
        const updatedJob = await updateJob({
          ...job,
          status: "unassigned",
        });

        setJob(updatedJob);
      }
    } catch (error) {
      console.error("Could not remove employee:", error);

      alert("Could not remove this employee.");
    } finally {
      setAssignmentLoading(false);
    }
  }

  return {
    job,
    employees,
    assignments,
    availableEmployees,

    selectedEmployeeId,
    setSelectedEmployeeId,
    /*
     * Pricing calculation
     */

    pricingCatalog,
    selectedPackage,
    calculationComplete,
    serviceBreakdown,
    packagePrice,
    packageLabourHours,

    /*
     * Operational availability
     */

    jobConflictsByEmployee,
    checkingConflicts,
    getEmployeeJobConflicts,
    hasEmployeeJobConflict,

    loading,
    loadError,
    saving,
    saveMessage,
    assignmentLoading,

    updateJobSection,
    updateJobField,

    saveJob,
    addEmployee,
    removeEmployee,
  };
}
