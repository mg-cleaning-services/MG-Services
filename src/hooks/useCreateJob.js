import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createJob } from "@/services/jobService";

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
    estimatedHours: "",
  },

  pricing: {
    finalPrice: "",
  },

  notes: "",
};

export default function useCreateJob() {
  const navigate = useNavigate();

  const [job, setJob] = useState(initialJob);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

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

    const estimatedHours = Number(job.schedule.estimatedHours);

    if (
      !job.schedule.estimatedHours ||
      Number.isNaN(estimatedHours) ||
      estimatedHours <= 0
    ) {
      return "Please enter a valid estimated duration.";
    }

    if (job.pricing.finalPrice !== "" && job.pricing.finalPrice !== null) {
      const finalPrice = Number(job.pricing.finalPrice);

      if (Number.isNaN(finalPrice) || finalPrice < 0) {
        return "Please enter a valid final price.";
      }
    }

    return "";
  }

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

      const jobData = {
        ...job,

        requestId: null,
        status: "unassigned",

        schedule: {
          ...job.schedule,
          estimatedHours: Number(job.schedule.estimatedHours),
        },

        pricing: {
          finalPrice:
            job.pricing.finalPrice !== ""
              ? Number(job.pricing.finalPrice)
              : null,
        },
      };

      const createdJob = await createJob(jobData);

      navigate(`/admin/jobs/${createdJob.id}`);
    } catch (createError) {
      console.error("Could not create job:", createError);

      setError(
        "Could not create the job. Please check the information and try again.",
      );
    } finally {
      setCreating(false);
    }
  }

  return {
    job,
    creating,
    error,

    updateJobField,
    updateJobSection,

    submitJob,
  };
}
