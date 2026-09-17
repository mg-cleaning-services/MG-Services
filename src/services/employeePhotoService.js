import { supabase } from "@/lib/supabase";

const BUCKET_NAME = "employee-photo";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function validatePhoto(file) {
  if (!file) {
    throw new Error("Please select an image.");
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only JPG, PNG and WebP images are allowed.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("The image must be smaller than 5 MB.");
  }
}

function getFileExtension(file) {
  const extensions = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  return extensions[file.type];
}

export async function uploadEmployeePhoto(employeeId, file) {
  if (!employeeId) {
    throw new Error("Employee ID is required.");
  }

  validatePhoto(file);

  const extension = getFileExtension(file);
  const fileName = `profile-${Date.now()}.${extension}`;
  const filePath = `${employeeId}/${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error("Error uploading employee photo:", error);
    throw error;
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return {
    path: filePath,
    url: data.publicUrl,
  };
}

export async function deleteEmployeePhoto(photoPath) {
  if (!photoPath) {
    return;
  }

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([photoPath]);

  if (error) {
    console.error("Error deleting employee photo:", error);
    throw error;
  }
}

export function getEmployeePhotoPath(photoUrl) {
  if (!photoUrl) {
    return null;
  }

  const marker = `/storage/v1/object/public/${BUCKET_NAME}/`;
  const markerIndex = photoUrl.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return decodeURIComponent(photoUrl.slice(markerIndex + marker.length));
}
