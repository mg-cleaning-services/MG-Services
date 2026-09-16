import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  convertRequestToJob,
  getRequestById,
  updateRequest,
} from "@/services/requestService";

import { getJobByRequestId } from "@/services/jobService";

const initialJobDetails = {
  date: "",
  startTime: "",
  estimatedHours: "",
  finalPrice: "",
};

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

  const [request, setRequest] = useState(null);
  const [generatedJob, setGeneratedJob] = useState(null);

  const [jobDetails, setJobDetails] = useState(initialJobDetails);

  const [jobLocation, setJobLocation] = useState(initialJobLocation);

  const [jobAccess, setJobAccess] = useState(initialJobAccess);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadRequest() {
      try {
        setLoading(true);
        setLoadError("");

        const [requestData, relatedJob] = await Promise.all([
          getRequestById(id),
          getJobByRequestId(id),
        ]);

        if (ignore) {
          return;
        }

        setRequest(requestData);
        setGeneratedJob(relatedJob);

        if (requestData) {
          setJobDetails((current) => ({
            ...current,
            date: requestData.schedule?.preferredDate || "",
          }));

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

  function validateConversion() {
    if (
      !jobDetails.date ||
      !jobDetails.startTime ||
      !jobDetails.estimatedHours ||
      !jobLocation.address.trim() ||
      !jobLocation.suburb.trim()
    ) {
      alert(
        "Please enter the confirmed date, start time, estimated duration, street address and suburb.",
      );

      return null;
    }

    const estimatedHours = Number(jobDetails.estimatedHours);

    if (!Number.isFinite(estimatedHours) || estimatedHours <= 0) {
      alert("Estimated hours must be greater than zero.");

      return null;
    }

    return {
      estimatedHours,
    };
  }

  async function convertToJob() {
    if (!request) {
      return;
    }

    const validation = validateConversion();

    if (!validation) {
      return;
    }

    try {
      setConverting(true);

      /*
       * Save the current Request first.
       *
       * This prevents unsaved edits in the form from
       * being lost when the database RPC creates the Job.
       */
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

        schedule: {
          date: jobDetails.date,
          startTime: jobDetails.startTime,
          estimatedHours: validation.estimatedHours,
        },

        pricing: {
          finalPrice: jobDetails.finalPrice,
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

  return {
    request,
    generatedJob,

    jobDetails,
    setJobDetails,

    jobLocation,
    setJobLocation,

    jobAccess,
    setJobAccess,

    loading,
    loadError,
    saving,
    converting,

    updateRequestSection,
    updateRequestField,

    saveRequest,
    convertToJob,
  };
}
