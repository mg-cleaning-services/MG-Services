import { useEffect, useState } from "react";

const EMPTY_FORM = {
  name: "",
  role: "",
  location: "",
  years: "",

  phone: "",
  email: "",

  tagline: "",
  bio: "",

  languages: "",
  specialties: "",
  traits: "",
  interests: "",

  photo: "",

  publicProfile: false,
  status: "active",
};

function employeeToForm(employee) {
  if (!employee) {
    return EMPTY_FORM;
  }

  return {
    name: employee.name ?? "",
    role: employee.role ?? "",
    location: employee.location ?? "",
    years: employee.years ?? "",

    phone: employee.phone ?? "",
    email: employee.email ?? "",

    tagline: employee.tagline ?? "",
    bio: employee.bio ?? "",

    languages: employee.languages?.join(", ") ?? "",
    specialties: employee.specialties?.join(", ") ?? "",
    traits: employee.traits?.join(", ") ?? "",
    interests: employee.interests?.join(", ") ?? "",

    photo: employee.photo ?? "",

    publicProfile: employee.publicProfile ?? false,
    status: employee.status ?? "active",
  };
}

function commaSeparatedToArray(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function useEmployeeForm({ employee, onSubmit }) {
  const [form, setForm] = useState(() => employeeToForm(employee));
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(employee?.photo ?? "");

  useEffect(() => {
    setForm(employeeToForm(employee));
    setPhotoFile(null);
    setPhotoPreview(employee?.photo ?? "");
  }, [employee]);

  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (photoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit(
      {
        ...(employee ?? {}),

        name: form.name.trim(),
        role: form.role.trim(),
        location: form.location.trim(),
        years: Number(form.years),

        phone: form.phone.trim(),
        email: form.email.trim(),

        tagline: form.tagline.trim(),
        bio: form.bio.trim(),

        languages: commaSeparatedToArray(form.languages),
        specialties: commaSeparatedToArray(form.specialties),
        traits: commaSeparatedToArray(form.traits),
        interests: commaSeparatedToArray(form.interests),

        photo: form.photo.trim(),

        publicProfile: form.publicProfile,
        status: form.status,
      },
      photoFile,
    );
  }

  return {
    form,
    photoFile,
    photoPreview,

    handleChange,
    handlePhotoChange,
    handleSubmit,
  };
}
