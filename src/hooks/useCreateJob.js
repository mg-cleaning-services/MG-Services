import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createJobWithAssignments } from "@/services/jobService";
import { getActiveEmployees } from "@/services/employeeService";
import { getJobConflictsByEmployee } from "@/services/availabilityService";

const initialJob = {
  requestId: null,

  jobType: "cleaning",
  source: "phone",
  status: "unassigned",

  customer: {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    preferredContact: "",
  },

  service: {
    requestType: "",
    packageId: "",
    selectedServices: [],
    extras: [],
  },

  property: {
    propertyType: "",
    floors: "",
    bedrooms: "",
    bathrooms: "",
    kitchens: "",
    balconies: "",
    laundries: "",
    pets: "",
  },

  location: {
    address: "",
    unit: "",
    suburb: "",
    postcode: "",
  },

  access: {
    instructions: "",
    parking: "",
    contactOnArrival: false,
  },

  schedule: {
    date: "",
    startTime: "",
    endTime: "",
    estimatedLabourHours: "",
  },

  pricing: {
    agreedPrice: "",
    finalPrice: "",
  },

  notes: "",
};

export default function useCreateJob() {
  const navigate = useNavigate();

  const [job, setJob] = useState(initialJob);

  /*
  |--------------------------------------------------------------------------
  | TEAM PLANNING
  |--------------------------------------------------------------------------
  */

  const [activeEmployees, setActiveEmployees] = useState([]);

  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  const [jobConflictsByEmployee, setJobConflictsByEmployee] = useState(
    new Map(),
  );

  const [loadingEmployees, setLoadingEmployees] = useState(true);

  const [checkingConflicts, setCheckingConflicts] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | GENERAL STATE
  |--------------------------------------------------------------------------
  */

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD ACTIVE EMPLOYEES
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let ignore = false;

    async function loadEmployees() {
      try {
        setLoadingEmployees(true);

        const employees = await getActiveEmployees();

        if (!ignore) {
          setActiveEmployees(employees);
        }
      } catch (loadError) {
        console.error("Could not load active employees:", loadError);

        if (!ignore) {
          setError("Could not load active employees.");
        }
      } finally {
        if (!ignore) {
          setLoadingEmployees(false);
        }
      }
    }

    loadEmployees();

    return () => {
      ignore = true;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CHECK AVAILABILITY WHEN SCHEDULE CHANGES
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let ignore = false;

    const { date, startTime, endTime } = job.schedule;

    if (!date || !startTime || !endTime || endTime <= startTime) {
      setJobConflictsByEmployee(new Map());
      setCheckingConflicts(false);

      return () => {
        ignore = true;
      };
    }

    async function checkConflicts() {
      try {
        setCheckingConflicts(true);

        const conflicts = await getJobConflictsByEmployee({
          serviceDate: date,
          startTime,
          endTime,
        });

        if (!ignore) {
          setJobConflictsByEmployee(conflicts);
        }
      } catch (conflictError) {
        console.error("Could not check employee availability:", conflictError);

        if (!ignore) {
          setJobConflictsByEmployee(new Map());
        }
      } finally {
        if (!ignore) {
          setCheckingConflicts(false);
        }
      }
    }

    checkConflicts();

    return () => {
      ignore = true;
    };
  }, [job.schedule.date, job.schedule.startTime, job.schedule.endTime]);

  /*
  |--------------------------------------------------------------------------
  | FORM UPDATES
  |--------------------------------------------------------------------------
  */

  function updateJobField(field, value) {
    setJob((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateJobSection(section, value) {
    setJob((current) => ({
      ...current,
      [section]: value,
    }));
  }

  /*
  |--------------------------------------------------------------------------
  | AVAILABILITY HELPERS
  |--------------------------------------------------------------------------
  */

  function getEmployeeJobConflicts(employeeId) {
    return (
      jobConflictsByEmployee.get(employeeId) ||
      jobConflictsByEmployee.get(String(employeeId)) ||
      []
    );
  }

  function hasEmployeeJobConflict(employeeId) {
    return getEmployeeJobConflicts(employeeId).length > 0;
  }

  function isEmployeeSelected(employeeId) {
    return selectedEmployeeIds.some((id) => String(id) === String(employeeId));
  }

  /*
  |--------------------------------------------------------------------------
  | TEAM SELECTION
  |--------------------------------------------------------------------------
  */

  function addSelectedEmployee() {
    if (!selectedEmployeeId) {
      return;
    }

    if (hasEmployeeJobConflict(selectedEmployeeId)) {
      setError("This employee has a conflicting job at the selected time.");
      return;
    }

    if (isEmployeeSelected(selectedEmployeeId)) {
      setSelectedEmployeeId("");
      return;
    }

    setSelectedEmployeeIds((current) => [...current, selectedEmployeeId]);

    setSelectedEmployeeId("");
    setError("");
  }

  function removeSelectedEmployee(employeeId) {
    setSelectedEmployeeIds((current) =>
      current.filter((id) => String(id) !== String(employeeId)),
    );
  }

  /*
  |--------------------------------------------------------------------------
  | VALIDATION
  |--------------------------------------------------------------------------
  */

  function validateJob() {
    if (!job.customer.firstName.trim()) {
      return "Please enter the customer's first name.";
    }

    if (!job.customer.phone.trim()) {
      return "Please enter the customer's phone number.";
    }

    if (!job.service.requestType) {
      return "Please select the service type.";
    }

    if (!job.location.address.trim()) {
      return "Please enter the service address.";
    }

    if (!job.location.suburb.trim()) {
      return "Please enter the suburb.";
    }

    if (!job.schedule.date) {
      return "Please select the service date.";
    }

    if (!job.schedule.startTime) {
      return "Please enter the start time.";
    }

    if (!job.schedule.endTime) {
      return "Please enter the end time.";
    }

    if (job.schedule.endTime <= job.schedule.startTime) {
      return "End time must be later than start time.";
    }

    const estimatedLabourHours = Number(job.schedule.estimatedLabourHours);

    if (
      !job.schedule.estimatedLabourHours ||
      Number.isNaN(estimatedLabourHours) ||
      estimatedLabourHours <= 0
    ) {
      return "Please enter valid estimated labour hours.";
    }

    if (job.pricing.agreedPrice !== "" && job.pricing.agreedPrice !== null) {
      const agreedPrice = Number(job.pricing.agreedPrice);

      if (Number.isNaN(agreedPrice) || agreedPrice < 0) {
        return "Please enter a valid agreed price.";
      }
    }

    if (job.pricing.finalPrice !== "" && job.pricing.finalPrice !== null) {
      const finalPrice = Number(job.pricing.finalPrice);

      if (Number.isNaN(finalPrice) || finalPrice < 0) {
        return "Please enter a valid final price.";
      }
    }

    /*
     * A selected employee may become unavailable
     * after the schedule is changed.
     */

    const conflictingEmployee = selectedEmployeeIds.find((employeeId) =>
      hasEmployeeJobConflict(employeeId),
    );

    if (conflictingEmployee) {
      return "One or more selected employees have a conflicting job. Please review the planned team.";
    }

    return "";
  }

  /*
  |--------------------------------------------------------------------------
  | CREATE JOB
  |--------------------------------------------------------------------------
  */

  async function submitJob() {
    if (creating) {
      return;
    }

    const validationError = validateJob();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setCreating(true);
      setError("");

      /*
       * Re-check availability immediately before
       * sending the creation request.
       *
       * PostgreSQL will perform the authoritative
       * conflict check again inside the RPC.
       */

      if (selectedEmployeeIds.length > 0) {
        const latestConflicts = await getJobConflictsByEmployee({
          serviceDate: job.schedule.date,
          startTime: job.schedule.startTime,
          endTime: job.schedule.endTime,
        });

        const conflictingEmployee = selectedEmployeeIds.find(
          (employeeId) =>
            (
              latestConflicts.get(employeeId) ||
              latestConflicts.get(String(employeeId)) ||
              []
            ).length > 0,
        );

        if (conflictingEmployee) {
          setJobConflictsByEmployee(latestConflicts);

          setError(
            "One or more selected employees are no longer available at this time. Please review the planned team.",
          );

          return;
        }
      }

      const jobData = {
        ...job,

        requestId: null,

        /*
         * The RPC determines assigned/unassigned
         * from selectedEmployeeIds.
         */

        status: selectedEmployeeIds.length > 0 ? "assigned" : "unassigned",

        schedule: {
          ...job.schedule,

          estimatedLabourHours: Number(job.schedule.estimatedLabourHours),
        },

        pricing: {
          agreedPrice:
            job.pricing.agreedPrice !== ""
              ? Number(job.pricing.agreedPrice)
              : null,

          finalPrice:
            job.pricing.finalPrice !== ""
              ? Number(job.pricing.finalPrice)
              : null,
        },
      };

      const createdJob = await createJobWithAssignments(
        jobData,
        selectedEmployeeIds,
      );

      navigate(`/admin/jobs/${createdJob.id}`);
    } catch (createError) {
      console.error("Could not create job:", createError);

      /*
       * Preserve useful RPC conflict errors instead
       * of hiding them behind a generic message.
       */

      if (createError?.message?.toLowerCase().includes("conflict")) {
        setError(
          "One or more selected employees are no longer available at this time. Please review the planned team.",
        );
      } else {
        setError(
          createError?.message ||
            "Could not create the job. Please check the information and try again.",
        );
      }
    } finally {
      setCreating(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | DERIVED TEAM DATA
  |--------------------------------------------------------------------------
  */

  const selectedEmployees = activeEmployees.filter((employee) =>
    isEmployeeSelected(employee.id),
  );

  const selectableEmployees = activeEmployees.filter(
    (employee) => !isEmployeeSelected(employee.id),
  );

  return {
    job,

    /*
     * Team planning
     */

    activeEmployees,
    selectedEmployees,
    selectableEmployees,

    selectedEmployeeIds,

    selectedEmployeeId,
    setSelectedEmployeeId,

    loadingEmployees,
    checkingConflicts,

    getEmployeeJobConflicts,
    hasEmployeeJobConflict,
    isEmployeeSelected,

    addSelectedEmployee,
    removeSelectedEmployee,

    /*
     * General
     */

    creating,
    error,

    updateJobField,
    updateJobSection,

    submitJob,
  };
}
