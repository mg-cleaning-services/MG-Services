import { supabase } from "@/lib/supabase";

/*
|--------------------------------------------------------------------------
| MAPPERS
|--------------------------------------------------------------------------
*/

function mapEmployeeFromDatabase(employee) {
  return {
    id: employee.id,
    employeeCode: employee.employee_code,
    slug: employee.slug,
    name: employee.name,
    role: employee.role,
    location: employee.location,
    years: employee.years_experience,

    phone: employee.phone,
    email: employee.email,

    tagline: employee.tagline,
    bio: employee.bio,

    languages: employee.languages || [],
    specialties: employee.specialties || [],
    traits: employee.traits || [],
    interests: employee.interests || [],

    photo: employee.photo_url,

    publicProfile: employee.public_profile,
    status: employee.status,

    createdAt: employee.created_at,
    updatedAt: employee.updated_at,
  };
}

function mapPublicEmployeeFromDatabase(employee) {
  return {
    id: employee.id,
    slug: employee.slug,
    name: employee.name,
    role: employee.role,
    years: employee.years_experience,

    tagline: employee.tagline,
    bio: employee.bio,

    languages: employee.languages || [],
    specialties: employee.specialties || [],
    traits: employee.traits || [],
    interests: employee.interests || [],

    photo: employee.photo_url,
  };
}

function mapEmployeeToDatabase(employee) {
  return {
    employee_code: employee.employeeCode || null,

    name: employee.name,
    role: employee.role,
    location: employee.location || null,
    years_experience: Number(employee.years) || 0,

    phone: employee.phone || null,
    email: employee.email || null,

    tagline: employee.tagline || null,
    bio: employee.bio || null,

    languages: employee.languages || [],
    specialties: employee.specialties || [],
    traits: employee.traits || [],
    interests: employee.interests || [],

    photo_url: employee.photo || null,

    public_profile: employee.publicProfile ?? false,
    status: employee.status || "active",
  };
}

/*
|--------------------------------------------------------------------------
| ADMIN - SUPABASE
|--------------------------------------------------------------------------
*/

export async function getEmployees() {
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
  return (data || []).map(mapEmployeeFromDatabase);
}

export async function getActiveEmployees() {
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("status", "active")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching active employees:", error);
    throw error;
  }

  return (data || []).map(mapEmployeeFromDatabase);
}

export async function getEmployeeById(id) {
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching employee:", error);
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapEmployeeFromDatabase(data);
}

export async function createEmployee(employeeData) {
  const databaseEmployee = mapEmployeeToDatabase(employeeData);

  const { data, error } = await supabase
    .from("employees")
    .insert(databaseEmployee)
    .select()
    .single();

  if (error) {
    console.error("Error creating employee:", error);
    throw error;
  }

  return mapEmployeeFromDatabase(data);
}

export async function updateEmployee(employeeData) {
  const databaseEmployee = mapEmployeeToDatabase(employeeData);

  const { data, error } = await supabase
    .from("employees")
    .update(databaseEmployee)
    .eq("id", employeeData.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating employee:", error);
    throw error;
  }

  return mapEmployeeFromDatabase(data);
}

export async function deleteEmployee(employeeId) {
  const { error } = await supabase
    .from("employees")
    .delete()
    .eq("id", employeeId);

  if (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
}

/*
|--------------------------------------------------------------------------
| PUBLIC - SUPABASE
|--------------------------------------------------------------------------
*/

export async function getPublicEmployees() {
  const { data, error } = await supabase
    .from("public_employees")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching public employees:", error);
    throw error;
  }

  return (data || []).map(mapPublicEmployeeFromDatabase);
}

export async function getPublicEmployeeBySlug(slug) {
  const { data, error } = await supabase
    .from("public_employees")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching public employee:", error);
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapPublicEmployeeFromDatabase(data);
}
