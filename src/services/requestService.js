import { supabase } from "@/lib/supabase";

function toNullableNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const number = Number(value);

  return Number.isNaN(number) ? null : number;
}

function mapRequestFromDatabase(request) {
  return {
    id: request.id,
    requestCode: request.request_code,
    source: request.source,
    status: request.status,

    customer: {
      firstName: request.first_name,
      lastName: request.last_name || "",
      phone: request.phone,
      email: request.email || "",
      preferredContact: request.preferred_contact,
    },

    service: {
      requestType: request.request_type,
      packageId: request.package_id || "",
      selectedServices: request.selected_services || [],
      extras: request.extras || [],

      /*
       * Quantities entered by Maxi.
       *
       * Structure:
       *
       * {
       *   [serviceId]: totalRequiredQuantity
       * }
       */
      serviceQuantities: request.service_quantities || {},
    },

    property: {
      propertyType: request.property_type,
      floors: request.floors || "",
      bedrooms: request.bedrooms,
      bathrooms: request.bathrooms,
      kitchens: request.kitchens || "",
      balconies: request.balconies || "",
      laundries: request.laundries || "",
      suburb: request.suburb,
      postcode: request.postcode || "",
      pets: request.pets || "",
    },

    schedule: {
      // Customer preference
      preferredDate: request.preferred_date,
      preferredTime: request.preferred_time,

      // Internal planning
      serviceDate: request.service_date || "",
      startTime: request.start_time || "",
      endTime: request.end_time || "",
    },

    estimation: {
      labourHours: request.estimated_labour_hours ?? "",
      price: request.estimated_price ?? "",
    },

    pricing: {
      quotedPrice: request.quoted_price ?? "",
    },

    condition: {
      level: request.condition_level || "",
      lastProfessionalClean: request.last_professional_clean || "",
    },

    notes: request.notes || "",

    createdAt: request.created_at,
    updatedAt: request.updated_at,
  };
}

function mapRequestToDatabase(request) {
  return {
    source: request.source || "website",
    status: request.status || "new",

    first_name: request.customer.firstName.trim(),
    last_name: request.customer.lastName?.trim() || null,
    phone: request.customer.phone.trim(),
    email: request.customer.email?.trim() || null,
    preferred_contact: request.customer.preferredContact,

    /*
    |--------------------------------------------------------------------------
    | SERVICE
    |--------------------------------------------------------------------------
    */

    request_type: request.service.requestType,
    package_id: request.service.packageId || null,
    selected_services: request.service.selectedServices || [],
    extras: request.service.extras || [],

    service_quantities: request.service.serviceQuantities || {},

    /*
    |--------------------------------------------------------------------------
    | PROPERTY
    |--------------------------------------------------------------------------
    */

    property_type: request.property.propertyType,
    floors: request.property.floors || null,
    bedrooms: request.property.bedrooms,
    bathrooms: request.property.bathrooms,
    kitchens: request.property.kitchens || null,
    balconies: request.property.balconies || null,
    laundries: request.property.laundries || null,
    suburb: request.property.suburb.trim(),
    postcode: request.property.postcode?.trim() || null,
    pets: request.property.pets || null,

    /*
    |--------------------------------------------------------------------------
    | CUSTOMER PREFERENCE
    |--------------------------------------------------------------------------
    */

    preferred_date: request.schedule.preferredDate,
    preferred_time: request.schedule.preferredTime,

    /*
    |--------------------------------------------------------------------------
    | INTERNAL PLANNING
    |--------------------------------------------------------------------------
    */

    service_date: request.schedule.serviceDate || null,
    start_time: request.schedule.startTime || null,
    end_time: request.schedule.endTime || null,

    /*
    |--------------------------------------------------------------------------
    | INTERNAL ESTIMATION
    |--------------------------------------------------------------------------
    */

    estimated_labour_hours: toNullableNumber(request.estimation?.labourHours),

    estimated_price: toNullableNumber(request.estimation?.price),

    /*
    |--------------------------------------------------------------------------
    | COMMERCIAL PRICE
    |--------------------------------------------------------------------------
    */

    quoted_price: toNullableNumber(request.pricing?.quotedPrice),

    /*
    |--------------------------------------------------------------------------
    | CONDITION
    |--------------------------------------------------------------------------
    */

    condition_level: request.condition.level || null,

    last_professional_clean: request.condition.lastProfessionalClean || null,

    /*
    |--------------------------------------------------------------------------
    | NOTES
    |--------------------------------------------------------------------------
    */

    notes: request.notes?.trim() || null,
  };
}

/*
|--------------------------------------------------------------------------
| GET REQUESTS
|--------------------------------------------------------------------------
*/

export async function getRequests() {
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data.map(mapRequestFromDatabase);
}

/*
|--------------------------------------------------------------------------
| GET REQUEST BY ID
|--------------------------------------------------------------------------
*/

export async function getRequestById(id) {
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return mapRequestFromDatabase(data);
}

/*
|--------------------------------------------------------------------------
| CREATE REQUEST
|--------------------------------------------------------------------------
*/

export async function createRequest(requestData) {
  const databaseRequest = mapRequestToDatabase({
    ...requestData,
    source: "website",
    status: "new",
  });

  const { error } = await supabase.from("requests").insert(databaseRequest);

  if (error) {
    throw error;
  }

  return true;
}

/*
|--------------------------------------------------------------------------
| UPDATE REQUEST
|--------------------------------------------------------------------------
*/

export async function updateRequest(request) {
  const databaseRequest = mapRequestToDatabase(request);

  const { data, error } = await supabase
    .from("requests")
    .update({
      ...databaseRequest,
      updated_at: new Date().toISOString(),
    })
    .eq("id", request.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapRequestFromDatabase(data);
}

/*
|--------------------------------------------------------------------------
| UPDATE REQUEST STATUS
|--------------------------------------------------------------------------
*/

export async function updateRequestStatus(requestId, status) {
  const { data, error } = await supabase
    .from("requests")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return mapRequestFromDatabase(data);
}

/*
|--------------------------------------------------------------------------
| DELETE REQUEST
|--------------------------------------------------------------------------
*/

export async function deleteRequest(requestId) {
  const { error } = await supabase
    .from("requests")
    .delete()
    .eq("id", requestId);

  if (error) {
    throw error;
  }

  return requestId;
}

/*
|--------------------------------------------------------------------------
| CONVERT REQUEST TO JOB
|--------------------------------------------------------------------------
|
| Planning and commercial values are already stored
| on the Request before this RPC is called.
|
| The database reads directly from the Request:
|
| service_date
| start_time
| end_time
| estimated_labour_hours
| quoted_price -> agreed_price
| request_assignments -> job_assignments
|
| React only sends operational information that does
| not currently live on the Request.
|
*/

export async function convertRequestToJob(requestId, confirmedData) {
  const { data, error } = await supabase.rpc("convert_request_to_job", {
    p_request_id: requestId,

    p_street_address: confirmedData.location.address.trim(),

    p_unit: confirmedData.location.unit?.trim() || null,

    p_suburb: confirmedData.location.suburb.trim(),

    p_postcode: confirmedData.location.postcode?.trim() || null,

    p_access_instructions: confirmedData.access.instructions?.trim() || null,

    p_parking: confirmedData.access.parking?.trim() || null,

    p_contact_on_arrival: confirmedData.access.contactOnArrival ?? false,

    p_notes: confirmedData.notes?.trim() || null,
  });

  if (error) {
    throw error;
  }

  return data;
}
