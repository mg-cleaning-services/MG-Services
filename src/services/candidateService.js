import { supabase } from "@/lib/supabase";

/*
|--------------------------------------------------------------------------
| MAPPERS
|--------------------------------------------------------------------------
*/

function mapInviteFromDatabase(invite) {
  if (!invite) {
    return null;
  }

  return {
    id: invite.id,
    phone: invite.phone,
    status: invite.status,
    expiresAt: invite.expires_at,
    usedAt: invite.used_at,
    createdBy: invite.created_by,
    createdAt: invite.created_at,
  };
}

function mapApplicationFromDatabase(application) {
  if (!application) {
    return null;
  }

  return {
    id: application.id,
    inviteId: application.invite_id,

    name: application.name,
    role: application.role,
    location: application.location,
    years: application.years_experience,

    phone: application.phone,
    email: application.email,

    tagline: application.tagline,
    bio: application.bio,

    languages: application.languages || [],
    specialties: application.specialties || [],
    traits: application.traits || [],
    interests: application.interests || [],

    photo: application.photo_url,

    status: application.status,

    employeeId: application.employee_id,

    submittedAt: application.submitted_at,
    reviewedAt: application.reviewed_at,
    reviewedBy: application.reviewed_by,

    createdAt: application.created_at,
    updatedAt: application.updated_at,
  };
}

/*
|--------------------------------------------------------------------------
| ADMIN - INVITATIONS
|--------------------------------------------------------------------------
*/

export async function createCandidateInvite({
  phone = null,
  expiresInDays = 7,
} = {}) {
  const { data, error } = await supabase.rpc("create_candidate_invite", {
    p_phone: phone || null,
    p_expires_in_days: expiresInDays,
  });

  if (error) {
    console.error("Error creating candidate invitation:", error);
    throw error;
  }

  const invite = data?.[0];

  if (!invite) {
    throw new Error("Candidate invitation could not be created.");
  }

  return {
    id: invite.invite_id,
    token: invite.token,
    expiresAt: invite.expires_at,
  };
}

export async function getCandidateInvites() {
  const { data, error } = await supabase
    .from("candidate_invites")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching candidate invitations:", error);
    throw error;
  }

  return (data || []).map(mapInviteFromDatabase);
}

export async function revokeCandidateInvite(inviteId) {
  const { data, error } = await supabase
    .from("candidate_invites")
    .update({
      status: "revoked",
    })
    .eq("id", inviteId)
    .eq("status", "active")
    .select()
    .single();

  if (error) {
    console.error("Error revoking candidate invitation:", error);
    throw error;
  }

  return mapInviteFromDatabase(data);
}

/*
|--------------------------------------------------------------------------
| PUBLIC - INVITATION VALIDATION
|--------------------------------------------------------------------------
*/

export async function validateCandidateInvite(token) {
  if (!token) {
    return {
      valid: false,
      inviteId: null,
      phone: null,
      expiresAt: null,
    };
  }

  const { data, error } = await supabase.rpc("validate_candidate_invite", {
    p_token: token,
  });

  if (error) {
    console.error("Error validating candidate invitation:", error);
    throw error;
  }

  const result = data?.[0];

  if (!result || !result.valid) {
    return {
      valid: false,
      inviteId: null,
      phone: null,
      expiresAt: null,
    };
  }

  return {
    valid: true,
    inviteId: result.invite_id,
    phone: result.phone,
    expiresAt: result.expires_at,
  };
}

/*
|--------------------------------------------------------------------------
| PUBLIC - APPLICATION SUBMISSION
|--------------------------------------------------------------------------
*/

export async function submitCandidateApplication({
  token,
  name,
  role,
  location = null,
  years = 0,
  phone = null,
  email = null,
  tagline = null,
  bio = null,
  languages = [],
  specialties = [],
  traits = [],
  interests = [],
  photo = null,
}) {
  if (!token) {
    throw new Error("Candidate invitation token is required.");
  }

  if (!name?.trim()) {
    throw new Error("Name is required.");
  }

  if (!role?.trim()) {
    throw new Error("Role is required.");
  }

  const { data, error } = await supabase.rpc("submit_candidate_application", {
    p_token: token,
    p_name: name.trim(),
    p_location: location || null,
    p_years_experience: Number(years) || 0,
    p_phone: phone || null,
    p_email: email || null,
    p_tagline: tagline || null,
    p_bio: bio || null,
    p_languages: languages || [],
    p_specialties: specialties || [],
    p_traits: traits || [],
    p_interests: interests || [],
    p_photo_url: photo || null,
    p_role: role.trim(),
  });

  if (error) {
    console.error("Error submitting candidate application:", error);
    throw error;
  }

  return {
    id: data,
  };
}

/*
|--------------------------------------------------------------------------
| ADMIN - APPLICATIONS
|--------------------------------------------------------------------------
*/

export async function getCandidateApplications() {
  const { data, error } = await supabase
    .from("candidate_applications")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("Error fetching candidate applications:", error);
    throw error;
  }

  return (data || []).map(mapApplicationFromDatabase);
}

export async function getCandidateApplicationById(applicationId) {
  const { data, error } = await supabase
    .from("candidate_applications")
    .select("*")
    .eq("id", applicationId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching candidate application:", error);
    throw error;
  }

  return mapApplicationFromDatabase(data);
}

export async function uploadCandidatePhoto({
  token,
  applicationId,
  photoFile,
}) {
  if (!token) {
    throw new Error("Candidate invitation token is required.");
  }

  if (!applicationId) {
    throw new Error("Candidate application ID is required.");
  }

  if (!photoFile) {
    throw new Error("Candidate photo is required.");
  }

  const formData = new FormData();

  formData.append("token", token);
  formData.append("applicationId", applicationId);
  formData.append("photo", photoFile);

  const { data, error } = await supabase.functions.invoke(
    "candidate-photo-upload",
    {
      body: formData,
    },
  );

  if (error) {
    console.error("Candidate photo upload function error:", error);

    throw new Error(
      data?.error || error?.message || "Candidate photo could not be uploaded.",
    );
  }

  if (!data?.success) {
    throw new Error(data?.error || "Candidate photo could not be uploaded.");
  }

  return data;
}
/*
|--------------------------------------------------------------------------
| ADMIN - CANDIDATE PHOTO
|--------------------------------------------------------------------------
*/

export async function getCandidatePhotoSignedUrl(
  photoPath,
  expiresInSeconds = 3600,
) {
  if (!photoPath) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from("candidate-photos")
    .createSignedUrl(photoPath, expiresInSeconds);

  if (error) {
    console.error("Error creating candidate photo signed URL:", error);
    throw error;
  }

  return data?.signedUrl || null;
}

/*
|--------------------------------------------------------------------------
| ADMIN - APPLICATION REVIEW
|--------------------------------------------------------------------------
*/

export async function approveCandidateApplication(applicationId) {
  if (!applicationId) {
    throw new Error("Candidate application ID is required.");
  }

  const { data, error } = await supabase.functions.invoke("approve-candidate", {
    body: {
      applicationId,
    },
  });

  if (error) {
    console.error("Candidate approval function error:", error);

    throw new Error(
      data?.error || error?.message || "Candidate could not be approved.",
    );
  }

  if (!data?.success) {
    throw new Error(data?.error || "Candidate could not be approved.");
  }

  return {
    employeeId: data.employeeId,
    temporaryPhotoRemoved: data.temporaryPhotoRemoved ?? true,
  };
}

export async function rejectCandidateApplication(applicationId) {
  if (!applicationId) {
    throw new Error("Candidate application ID is required.");
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error getting current admin user:", userError);
    throw userError;
  }

  if (!user) {
    throw new Error("An authenticated admin is required.");
  }

  const { data, error } = await supabase
    .from("candidate_applications")
    .update({
      status: "rejected",
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    })
    .eq("id", applicationId)
    .eq("status", "submitted")
    .select()
    .maybeSingle();

  if (error) {
    console.error("Error rejecting candidate application:", error);
    throw error;
  }

  if (!data) {
    throw new Error("This candidate application has already been reviewed.");
  }

  return mapApplicationFromDatabase(data);
}
