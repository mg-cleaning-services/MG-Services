import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  approveCandidateApplication,
  getCandidateApplicationById,
  getCandidatePhotoSignedUrl,
  rejectCandidateApplication,
} from "@/services/candidateService";

function formatDate(value) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getStatusLabel(status) {
  if (status === "submitted") return "Pending";
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";

  return status || "Unknown";
}

function getStatusClasses(status) {
  if (status === "approved") {
    return "bg-[#E8F5E9] text-[#2E7D32]";
  }

  if (status === "rejected") {
    return "bg-red-50 text-red-700";
  }

  return "bg-amber-50 text-amber-700";
}

function ListField({ label, values }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-[#1A1A1A]">{label}</p>

      {values?.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {values.map((value) => (
            <span
              key={value}
              className="rounded-full bg-[#E8F5E9] px-3 py-1.5 text-sm text-[#2E7D32]"
            >
              {value}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#1A1A1A]/40">Not provided</p>
      )}
    </div>
  );
}

export default function CandidateDetail() {
  const { id } = useParams();

  const [candidate, setCandidate] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviewAction, setReviewAction] = useState("");
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCandidate() {
      setLoading(true);
      setError("");

      try {
        const application = await getCandidateApplicationById(id);

        if (!application) {
          throw new Error("Candidate application not found.");
        }

        let signedPhotoUrl = "";

        if (application.photo) {
          try {
            signedPhotoUrl =
              (await getCandidatePhotoSignedUrl(application.photo)) || "";
          } catch (photoError) {
            console.error("Candidate photo could not be loaded:", photoError);
          }
        }

        if (!active) {
          return;
        }

        setCandidate(application);
        setPhotoUrl(signedPhotoUrl);
      } catch (loadError) {
        console.error("Error loading candidate application:", loadError);

        if (active) {
          setError(
            loadError?.message ||
              "The candidate application could not be loaded.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCandidate();

    return () => {
      active = false;
    };
  }, [id]);

  async function refreshCandidate() {
    const application = await getCandidateApplicationById(id);

    if (!application) {
      throw new Error("Candidate application not found.");
    }

    setCandidate(application);

    return application;
  }

  async function handleApprove() {
    if (reviewAction) {
      return;
    }

    const confirmed = window.confirm(
      `Approve ${candidate.name} and create an active employee profile?`,
    );

    if (!confirmed) {
      return;
    }

    setReviewAction("approve");
    setReviewError("");

    try {
      await approveCandidateApplication(candidate.id);

      await refreshCandidate();
    } catch (approvalError) {
      console.error("Error approving candidate:", approvalError);

      setReviewError(
        approvalError?.message || "Candidate could not be approved.",
      );
    } finally {
      setReviewAction("");
    }
  }

  async function handleReject() {
    if (reviewAction) {
      return;
    }

    const confirmed = window.confirm(`Reject ${candidate.name}'s application?`);

    if (!confirmed) {
      return;
    }

    setReviewAction("reject");
    setReviewError("");

    try {
      await rejectCandidateApplication(candidate.id);

      await refreshCandidate();
    } catch (rejectionError) {
      console.error("Error rejecting candidate:", rejectionError);

      setReviewError(
        rejectionError?.message || "Candidate could not be rejected.",
      );
    } finally {
      setReviewAction("");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F9FAF9] py-16">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="rounded-2xl border border-[#2E7D32]/10 bg-white p-6">
            <p className="text-sm text-[#1A1A1A]/60">
              Loading candidate application...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !candidate) {
    return (
      <main className="min-h-screen bg-[#F9FAF9] py-16">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm text-red-700">
              {error || "Candidate application not found."}
            </p>
          </div>

          <Link
            to="/admin/candidates"
            className="mt-6 inline-flex text-sm font-medium text-[#2E7D32]"
          >
            ← Back to Candidates
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9FAF9] py-16">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        {/* Back */}
        <Link
          to="/admin/candidates"
          className="mb-8 inline-flex text-sm font-medium text-[#2E7D32] transition-colors hover:text-[#256628]"
        >
          ← Back to Candidates
        </Link>

        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#2E7D32]">
              Candidate Application
            </p>

            <h1 className="text-4xl font-heading text-[#1A1A1A] md:text-5xl">
              {candidate.name}
            </h1>

            <p className="mt-3 text-[#1A1A1A]/50">
              Submitted {formatDate(candidate.submittedAt)}
            </p>
          </div>

          <span
            className={`self-start rounded-full px-4 py-2 text-sm font-medium ${getStatusClasses(
              candidate.status,
            )}`}
          >
            {getStatusLabel(candidate.status)}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Candidate summary */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-[#2E7D32]/10 bg-white">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={candidate.name}
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center bg-[#E8F5E9]">
                  <span className="text-6xl font-heading text-[#2E7D32]">
                    {candidate.name?.trim()?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                </div>
              )}

              <div className="p-5">
                <h2 className="text-xl font-heading text-[#1A1A1A]">
                  {candidate.name}
                </h2>

                {candidate.tagline && (
                  <p className="mt-2 text-sm leading-6 text-[#1A1A1A]/55">
                    {candidate.tagline}
                  </p>
                )}
              </div>
            </div>

            {/* Contact */}
            <div className="rounded-3xl border border-[#2E7D32]/10 bg-white p-5">
              <h2 className="mb-5 text-lg font-heading text-[#1A1A1A]">
                Contact
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-[#1A1A1A]/35">
                    Phone
                  </p>

                  <p className="mt-1 text-sm text-[#1A1A1A]">
                    {candidate.phone || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-[#1A1A1A]/35">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm text-[#1A1A1A]">
                    {candidate.email || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-[#1A1A1A]/35">
                    Location
                  </p>

                  <p className="mt-1 text-sm text-[#1A1A1A]">
                    {candidate.location || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Application */}
          <div className="space-y-6">
            {/* Experience */}
            <section className="rounded-3xl border border-[#2E7D32]/10 bg-white p-6 md:p-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-[#2E7D32]">
                Experience
              </p>

              <h2 className="text-2xl font-heading text-[#1A1A1A]">
                Candidate Profile
              </h2>

              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-[#1A1A1A]/50">Applied role</p>

                  <p className="mt-1 text-xl font-heading text-[#1A1A1A]">
                    {candidate.role || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#1A1A1A]/50">
                    Years of experience
                  </p>

                  <p className="mt-1 text-3xl font-heading text-[#1A1A1A]">
                    {candidate.years ?? 0}
                  </p>
                </div>
              </div>

              <div className="mt-7 border-t border-[#1A1A1A]/10 pt-7">
                <p className="mb-2 text-sm font-medium text-[#1A1A1A]">Bio</p>

                <p className="whitespace-pre-line text-sm leading-7 text-[#1A1A1A]/60">
                  {candidate.bio || "No bio provided."}
                </p>
              </div>
            </section>

            {/* Skills */}
            <section className="rounded-3xl border border-[#2E7D32]/10 bg-white p-6 md:p-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-[#2E7D32]">
                Details
              </p>

              <h2 className="text-2xl font-heading text-[#1A1A1A]">
                Skills & Profile
              </h2>

              <div className="mt-7 space-y-7">
                <ListField label="Languages" values={candidate.languages} />
                <ListField label="Specialties" values={candidate.specialties} />
                <ListField label="Traits" values={candidate.traits} />
                <ListField label="Interests" values={candidate.interests} />
              </div>
            </section>

            {/* Application metadata */}
            <section className="rounded-3xl border border-[#2E7D32]/10 bg-white p-6 md:p-8">
              <h2 className="text-xl font-heading text-[#1A1A1A]">
                Application
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-[#1A1A1A]/35">
                    Submitted
                  </p>

                  <p className="mt-1 text-sm text-[#1A1A1A]">
                    {formatDate(candidate.submittedAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-[#1A1A1A]/35">
                    Status
                  </p>

                  <p className="mt-1 text-sm text-[#1A1A1A]">
                    {getStatusLabel(candidate.status)}
                  </p>
                </div>

                {candidate.reviewedAt && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-[#1A1A1A]/35">
                      Reviewed
                    </p>

                    <p className="mt-1 text-sm text-[#1A1A1A]">
                      {formatDate(candidate.reviewedAt)}
                    </p>
                  </div>
                )}

                {candidate.employeeId && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-[#1A1A1A]/35">
                      Employee
                    </p>

                    <Link
                      to={`/admin/team/${candidate.employeeId}`}
                      className="mt-1 inline-flex text-sm font-medium text-[#2E7D32] hover:text-[#256628]"
                    >
                      View employee profile →
                    </Link>
                  </div>
                )}
              </div>
            </section>

            {/* Review actions */}
            {candidate.status === "submitted" && (
              <section className="rounded-3xl border border-[#2E7D32]/10 bg-white p-6 md:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#2E7D32]">
                  Application review
                </p>

                <h2 className="mt-2 text-2xl font-heading text-[#1A1A1A]">
                  Review Candidate
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#1A1A1A]/50">
                  Approving this candidate will create an active employee using
                  the information provided in this application.
                </p>

                {reviewError && (
                  <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm text-red-700">{reviewError}</p>
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={Boolean(reviewAction)}
                    className="rounded-xl border border-red-200 px-5 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {reviewAction === "reject"
                      ? "Rejecting..."
                      : "Reject Candidate"}
                  </button>

                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={Boolean(reviewAction)}
                    className="rounded-xl bg-[#2E7D32] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#256628] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {reviewAction === "approve"
                      ? "Approving..."
                      : "Approve Candidate"}
                  </button>
                </div>
              </section>
            )}

            {/* Reviewed result */}
            {candidate.status === "approved" && (
              <section className="rounded-3xl border border-[#2E7D32]/20 bg-[#E8F5E9] p-6 md:p-8">
                <p className="font-medium text-[#2E7D32]">Candidate approved</p>

                <p className="mt-2 text-sm leading-6 text-[#1A1A1A]/60">
                  This candidate has been converted into an active employee.
                </p>
              </section>
            )}

            {candidate.status === "rejected" && (
              <section className="rounded-3xl border border-red-200 bg-red-50 p-6 md:p-8">
                <p className="font-medium text-red-700">Candidate rejected</p>

                <p className="mt-2 text-sm leading-6 text-red-700/70">
                  This application has been reviewed and rejected.
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
