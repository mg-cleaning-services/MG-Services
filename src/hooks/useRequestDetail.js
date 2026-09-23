import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  convertRequestToJob,
  getRequestById,
  updateRequest,
} from "@/services/requestService";

import { getJobByRequestId } from "@/services/jobService";

import { getActiveEmployees } from "@/services/employeeService";

import {
  assignEmployeeToRequest,
  getRequestAssignments,
  removeEmployeeFromRequest,
} from "@/services/requestAssignmentService";

import useServiceEstimate from "@/hooks/shared/useServiceEstimate";
import useJobAvailability from "@/hooks/shared/useJobAvailability";

const initialJobLocation = {
  address: "",
  unit: "",
  suburb: "",
  postcode: "",
};

const initialJobAccess = {
  instructions: "",
  parking: "",
  contactOnArrival: false,
};

export default function useRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | REQUEST
  |--------------------------------------------------------------------------
  */

  const [request, setRequest] = useState(null);
  const [generatedJob, setGeneratedJob] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | JOB DATA
  |--------------------------------------------------------------------------
  */

  const [jobLocation, setJobLocation] = useState(initialJobLocation);
  const [jobAccess, setJobAccess] = useState(initialJobAccess);

  /*
  |--------------------------------------------------------------------------
  | TEAM PLANNING
  |--------------------------------------------------------------------------
  */

  const [activeEmployees, setActiveEmployees] = useState([]);
  const [requestAssignments, setRequestAssignments] = useState([]);

  const [assignmentLoadingId, setAssignmentLoadingId] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | GENERAL STATE
  |--------------------------------------------------------------------------
  */

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let ignore = false;

    async function loadRequest() {
      try {
        setLoading(true);
        setLoadError("");

        const [requestData, relatedJob, employees, assignments] =
          await Promise.all([
            getRequestById(id),
            getJobByRequestId(id),
            getActiveEmployees(),
            getRequestAssignments(id),
          ]);

        if (ignore) {
          return;
        }

        setRequest(requestData);
        setGeneratedJob(relatedJob);

        setActiveEmployees(employees);
        setRequestAssignments(assignments);

        if (requestData) {
          setJobLocation((current) => ({
            ...current,
            suburb: requestData.property?.suburb || "",
            postcode: requestData.property?.postcode || "",
          }));
        }
      } catch (error) {
        console.error("Could not load request:", error);

        if (!ignore) {
          setLoadError("Could not load this request.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadRequest();

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
  | in the Request model.
  |
  | quotedPrice is NEVER changed automatically.
  |
  */

  const handleEstimateChange = useCallback(({ price, labourHours }) => {
    setRequest((current) => {
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
    service: request?.service,
    property: request?.property,
    onEstimateChange: handleEstimateChange,
  });

  /*
  |--------------------------------------------------------------------------
  | OPERATIONAL AVAILABILITY
  |--------------------------------------------------------------------------
  |
  | Shared conflict checking lives in useJobAvailability.
  |
  | Requests represent a proposed Job window, so there is no
  | existing Job to exclude from the conflict check.
  |
  */

  const { checkingConflicts, getEmployeeJobConflicts, hasEmployeeJobConflict } =
    useJobAvailability({
      serviceDate: request?.schedule?.serviceDate,
      startTime: request?.schedule?.startTime,
      endTime: request?.schedule?.endTime,
    });

  /*
  |--------------------------------------------------------------------------
  | REQUEST EDITING
  |--------------------------------------------------------------------------
  */

  function updateRequestSection(section, value) {
    setRequest((current) => ({
      ...current,
      [section]: value,
    }));
  }

  function updateRequestField(field, value) {
    setRequest((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateNestedRequestField(section, field, value) {
    setRequest((current) => ({
      ...current,

      [section]: {
        ...current[section],
        [field]: value,
      },
    }));
  }

  /*
  |--------------------------------------------------------------------------
  | REQUEST ASSIGNMENTS
  |--------------------------------------------------------------------------
  */

  function isEmployeeAssigned(employeeId) {
    return requestAssignments.some(
      (assignment) => String(assignment.employeeId) === String(employeeId),
    );
  }

  async function toggleRequestAssignment(employeeId) {
    if (!request) {
      return;
    }

    const assigned = isEmployeeAssigned(employeeId);

    /*
     * Prevent creating a new preliminary assignment
     * when the employee already has an overlapping Job.
     *
     * An employee who was previously assigned and later
     * develops a conflict can still be removed.
     */

    if (!assigned && hasEmployeeJobConflict(employeeId)) {
      return;
    }

    try {
      setAssignmentLoadingId(employeeId);

      if (assigned) {
        await removeEmployeeFromRequest(request.id, employeeId);
      } else {
        await assignEmployeeToRequest(request.id, employeeId);
      }

      /*
       * Reload assignments from the database so the
       * database remains the source of truth.
       */

      const assignments = await getRequestAssignments(request.id);

      setRequestAssignments(assignments);
    } catch (error) {
      console.error("Could not update request assignment:", error);

      alert("Could not update the team assignment. Please try again.");
    } finally {
      setAssignmentLoadingId(null);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | SAVE REQUEST
  |--------------------------------------------------------------------------
  */

  async function saveRequest() {
    if (!request) {
      return null;
    }

    try {
      setSaving(true);

      const updatedRequest = await updateRequest(request);

      setRequest(updatedRequest);

      alert("Request updated successfully.");

      return updatedRequest;
    } catch (error) {
      console.error("Could not update request:", error);

      alert("Could not save the request. Please try again.");

      throw error;
    } finally {
      setSaving(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | CONVERSION VALIDATION
  |--------------------------------------------------------------------------
  */

  function validateConversion() {
    if (
      !request.schedule?.serviceDate ||
      !request.schedule?.startTime ||
      !request.schedule?.endTime ||
      request.estimation?.labourHours === "" ||
      request.estimation?.labourHours === null ||
      request.estimation?.labourHours === undefined ||
      !jobLocation.address.trim() ||
      !jobLocation.suburb.trim()
    ) {
      alert(
        "Please enter the service date, start time, end time, estimated labour hours, street address and suburb.",
      );

      return null;
    }

    const estimatedLabourHours = Number(request.estimation.labourHours);

    if (!Number.isFinite(estimatedLabourHours) || estimatedLabourHours <= 0) {
      alert("Estimated labour hours must be greater than zero.");

      return null;
    }

    if (request.schedule.endTime <= request.schedule.startTime) {
      alert("End time must be later than start time.");

      return null;
    }

    /*
     * A selected employee may have become unavailable
     * after the original planning decision.
     *
     * Do not silently remove them. Block conversion
     * until Maxi reviews the team.
     */

    const conflictingAssignments = requestAssignments.filter((assignment) =>
      hasEmployeeJobConflict(assignment.employeeId),
    );

    if (conflictingAssignments.length > 0) {
      alert(
        "One or more planned employees now have a conflicting job. Please review the team before converting this request.",
      );

      return null;
    }

    return true;
  }

  /*
  |--------------------------------------------------------------------------
  | CONVERT TO JOB
  |--------------------------------------------------------------------------
  */

  async function convertToJob() {
    if (!request) {
      return;
    }

    if (!validateConversion()) {
      return;
    }

    try {
      setConverting(true);

      const savedRequest = await updateRequest(request);

      setRequest(savedRequest);

      const createdJob = await convertRequestToJob(savedRequest.id, {
        location: {
          address: jobLocation.address,
          unit: jobLocation.unit,
          suburb: jobLocation.suburb,
          postcode: jobLocation.postcode,
        },

        access: {
          instructions: jobAccess.instructions,
          parking: jobAccess.parking,
          contactOnArrival: jobAccess.contactOnArrival,
        },

        notes: savedRequest.notes,
      });

      navigate(`/admin/jobs/${createdJob.id}`);
    } catch (error) {
      console.error("Could not convert request to job:", error);

      alert(error.message || "Could not convert this request to a job.");
    } finally {
      setConverting(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | RETURN
  |--------------------------------------------------------------------------
  */

  return {
    request,
    generatedJob,

    /*
     * Pricing calculation
     */

    pricingCatalog,
    selectedPackage,
    calculationComplete,
    serviceBreakdown,
    packagePrice,
    packageLabourHours,

    jobLocation,
    setJobLocation,

    jobAccess,
    setJobAccess,

    activeEmployees,
    requestAssignments,
    checkingConflicts,
    assignmentLoadingId,

    isEmployeeAssigned,
    getEmployeeJobConflicts,
    hasEmployeeJobConflict,
    toggleRequestAssignment,

    loading,
    loadError,
    saving,
    converting,

    updateRequestSection,
    updateRequestField,
    updateNestedRequestField,

    saveRequest,
    convertToJob,
  };
}
