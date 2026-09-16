import { supabase } from "@/lib/supabase";

function mapJobFromDatabase(job) {
  return {
    // Internal database identifier
    id: job.id,

    // Human-readable identifier
    jobCode: job.job_code,

    // Relation to original request
    requestId: job.request_id,
    requestCode: job.requests?.request_code || null,
    jobType: job.job_type,
    source: job.source,
    status: job.status,
    team:
      job.job_assignments
        ?.map((assignment) => assignment.employees)
        .filter(Boolean)
        .map((employee) => ({
          id: employee.id,
          employeeCode: employee.employee_code,
          name: employee.name,
          role: employee.role,
          photo: employee.photo_url,
        })) || [],
    customer: {
      firstName: job.first_name,
      lastName: job.last_name || "",
      phone: job.phone,
      email: job.email || "",
      preferredContact: job.preferred_contact || "",
    },

    service: {
      requestType: job.request_type,
      packageId: job.package_id || "",
      selectedServices: job.selected_services || [],
      extras: job.extras || [],
    },

    property: {
      propertyType: job.property_type || "",
      floors: job.floors || "",
      bedrooms: job.bedrooms || "",
      bathrooms: job.bathrooms || "",
      kitchens: job.kitchens || "",
      balconies: job.balconies || "",
      laundries: job.laundries || "",
      suburb: job.suburb,
      postcode: job.postcode || "",
      pets: job.pets || "",
    },

    location: {
      address: job.street_address,
      unit: job.unit || "",
      suburb: job.suburb,
      postcode: job.postcode || "",
    },

    access: {
      instructions: job.access_instructions || "",
      parking: job.parking || "",
      contactOnArrival: job.contact_on_arrival ?? false,
    },

    schedule: {
      date: job.service_date,
      startTime: job.start_time?.slice(0, 5) || "",
      estimatedHours:
        job.estimated_hours !== null ? Number(job.estimated_hours) : null,
    },

    pricing: {
      finalPrice: job.final_price !== null ? Number(job.final_price) : null,
    },

    notes: job.notes || "",

    createdAt: job.created_at,
    updatedAt: job.updated_at,
  };
}

function mapJobToDatabase(job) {
  return {
    request_id: job.requestId || null,

    job_type: job.jobType || "cleaning",
    source: job.source || "other",
    status: job.status || "unassigned",

    first_name: job.customer.firstName.trim(),
    last_name: job.customer.lastName?.trim() || null,
    phone: job.customer.phone.trim(),
    email: job.customer.email?.trim() || null,
    preferred_contact: job.customer.preferredContact || null,

    request_type: job.service.requestType,
    package_id: job.service.packageId || null,
    selected_services: job.service.selectedServices || [],
    extras: job.service.extras || [],

    property_type: job.property.propertyType || null,
    floors: job.property.floors || null,
    bedrooms: job.property.bedrooms || null,
    bathrooms: job.property.bathrooms || null,
    kitchens: job.property.kitchens || null,
    balconies: job.property.balconies || null,
    laundries: job.property.laundries || null,

    suburb: job.location?.suburb?.trim() || job.property.suburb?.trim(),

    postcode:
      job.location?.postcode?.trim() || job.property.postcode?.trim() || null,

    pets: job.property.pets || null,

    street_address: job.location.address.trim(),

    unit: job.location.unit?.trim() || null,

    access_instructions: job.access?.instructions?.trim() || null,

    parking: job.access?.parking?.trim() || null,

    contact_on_arrival: job.access?.contactOnArrival ?? false,

    service_date: job.schedule.date,

    start_time: job.schedule.startTime,

    estimated_hours:
      job.schedule.estimatedHours !== ""
        ? Number(job.schedule.estimatedHours)
        : null,

    final_price:
      job.pricing.finalPrice !== "" &&
      job.pricing.finalPrice !== null &&
      job.pricing.finalPrice !== undefined
        ? Number(job.pricing.finalPrice)
        : null,

    notes: job.notes?.trim() || null,
  };
}

export async function getJobs() {
  const { data, error } = await supabase
    .from("jobs")
    .select(
      `
      *,
      job_assignments (
        employee_id,
        employees (
          id,
          employee_code,
          name,
          role,
          photo_url
        )
      )
    `,
    )
    .order("service_date", { ascending: true });

  if (error) {
    throw error;
  }

  return data.map(mapJobFromDatabase);
}

export async function getJobById(id) {
  const { data, error } = await supabase
    .from("jobs")
    .select(
      `
      *,
      requests (
        request_code
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return mapJobFromDatabase(data);
}

export async function getJobByRequestId(requestId) {
  const { data, error } = await supabase
    .from("jobs")
    .select(
      `
      *,
      requests (
        request_code
      ),
      job_assignments (
        employee_id,
        employees (
          id,
          employee_code,
          name,
          role,
          photo_url
        )
      )
    `,
    )
    .eq("request_id", requestId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapJobFromDatabase(data) : null;
}

export async function createJob(jobData) {
  const databaseJob = mapJobToDatabase(jobData);

  const { data, error } = await supabase
    .from("jobs")
    .insert(databaseJob)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapJobFromDatabase(data);
}

export async function updateJob(job) {
  const databaseJob = mapJobToDatabase(job);

  const { data, error } = await supabase
    .from("jobs")
    .update({
      ...databaseJob,
      updated_at: new Date().toISOString(),
    })
    .eq("id", job.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapJobFromDatabase(data);
}

export async function updateJobStatus(jobId, status) {
  const { data, error } = await supabase
    .from("jobs")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", jobId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapJobFromDatabase(data);
}

export async function deleteJob(jobId) {
  const { error } = await supabase.from("jobs").delete().eq("id", jobId);

  if (error) {
    throw error;
  }

  return jobId;
}
