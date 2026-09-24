import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import EmployeeForm from "@/components/admin/team/forms/EmployeeForm";

import {
  submitCandidateApplication,
  uploadCandidatePhoto,
  validateCandidateInvite,
} from "@/services/candidateService";

export default function CandidateApplication() {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("invite");

  const [validation, setValidation] = useState(null);
  const [validating, setValidating] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [submittedApplication, setSubmittedApplication] = useState(null);

  useEffect(() => {
    let active = true;

    async function validateInvitation() {
      setValidating(true);

      try {
        if (!token) {
          if (active) {
            setValidation({
              valid: false,
            });
          }

          return;
        }

        const result = await validateCandidateInvite(token);

        if (active) {
          setValidation(result);
        }
      } catch (error) {
        console.error("Error validating candidate invitation:", error);

        if (active) {
          setValidation({
            valid: false,
          });
        }
      } finally {
        if (active) {
          setValidating(false);
        }
      }
    }

    validateInvitation();

    return () => {
      active = false;
    };
  }, [token]);

  async function handleSubmit(application, photoFile) {
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      // ------------------------------------------------------
      // 1. Create candidate application
      // ------------------------------------------------------

      const result = await submitCandidateApplication({
        token,

        name: application.name,
        location: application.location,
        years: application.years,

        phone: application.phone,
        email: application.email,

        tagline: application.tagline,
        bio: application.bio,

        languages: application.languages,
        specialties: application.specialties,
        traits: application.traits,
        interests: application.interests,

        photo: null,
      });

      const applicationId = result.id;

      if (!applicationId) {
        throw new Error("Candidate application was created without an ID.");
      }

      // ------------------------------------------------------
      // 2. Upload candidate photo
      // ------------------------------------------------------

      if (photoFile) {
        await uploadCandidatePhoto({
          token,
          applicationId,
          photoFile,
        });
      }

      // ------------------------------------------------------
      // 3. Complete
      // ------------------------------------------------------

      setSubmittedApplication({
        id: applicationId,
      });
    } catch (error) {
      console.error("Error submitting candidate application:", error);

      setSubmitError(
        error?.message ||
          "Your application could not be submitted. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ==========================================================
  // Loading invitation
  // ==========================================================

  if (validating) {
    return (
      <main className="min-h-screen bg-[#F9FAF9] px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-[#2E7D32]/10 bg-white p-8 text-center">
            <p className="text-sm text-[#1A1A1A]/60">
              Checking your invitation...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // Invalid / expired / used invitation
  // ==========================================================

  if (!validation?.valid) {
    return (
      <main className="min-h-screen bg-[#F9FAF9] px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-red-100 bg-white p-8 text-center md:p-12">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl text-red-600">
              !
            </div>

            <h1 className="text-3xl font-heading text-[#1A1A1A]">
              Invitation unavailable
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#1A1A1A]/60">
              This application link is invalid, has expired, or has already been
              used. Please contact MG Cleaning if you need a new invitation.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // Success
  // ==========================================================

  if (submittedApplication) {
    return (
      <main className="min-h-screen bg-[#F9FAF9] px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-[#2E7D32]/10 bg-white p-8 text-center md:p-12">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F5E9] text-xl text-[#2E7D32]">
              ✓
            </div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-[#2E7D32]">
              Application Received
            </p>

            <h1 className="text-3xl font-heading text-[#1A1A1A] md:text-4xl">
              Thank you for applying
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-[#1A1A1A]/60">
              Your application has been sent to MG Cleaning for review. We will
              contact you if we need any additional information.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // Application form
  // ==========================================================

  return (
    <main className="min-h-screen bg-[#F9FAF9] px-6 py-16 md:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#2E7D32]">
            MG Cleaning
          </p>

          <h1 className="text-4xl font-heading text-[#1A1A1A] md:text-5xl">
            Join our team
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-[#1A1A1A]/60">
            Complete your details below to submit your application to MG
            Cleaning.
          </p>
        </div>

        <div className="rounded-3xl border border-[#2E7D32]/10 bg-white p-6 shadow-sm md:p-8">
          {validation.phone && (
            <div className="mb-8 rounded-2xl bg-[#E8F5E9]/60 px-4 py-3">
              <p className="text-sm text-[#1B3D1E]">
                This invitation was created for{" "}
                <span className="font-semibold">{validation.phone}</span>.
              </p>
            </div>
          )}

          {submitError && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

          <EmployeeForm
            mode="application"
            onSubmit={handleSubmit}
            submitLabel={submitting ? "Submitting..." : "Submit Application"}
          />
        </div>
      </div>
    </main>
  );
}
