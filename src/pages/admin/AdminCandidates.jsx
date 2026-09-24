import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  createCandidateInvite,
  getCandidateApplications,
} from "@/services/candidateService";

export default function AdminCandidates() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("submitted");

  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const [invitePhone, setInvitePhone] = useState("");
  const [inviteExpiresInDays, setInviteExpiresInDays] = useState(7);

  const [creatingInvite, setCreatingInvite] = useState(false);
  const [inviteError, setInviteError] = useState("");

  const [createdInvite, setCreatedInvite] = useState(null);
  const [copied, setCopied] = useState(false);

  // ==========================================================
  // Applications
  // ==========================================================

  useEffect(() => {
    let active = true;

    async function loadApplications() {
      setLoading(true);
      setError("");

      try {
        const data = await getCandidateApplications();

        if (active) {
          setApplications(data ?? []);
        }
      } catch (loadError) {
        console.error("Error loading candidate applications:", loadError);

        if (active) {
          setError(
            loadError?.message ||
              "The candidate applications could not be loaded.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadApplications();

    return () => {
      active = false;
    };
  }, []);

  // ==========================================================
  // Stats
  // ==========================================================

  const stats = useMemo(() => {
    return {
      total: applications.length,

      submitted: applications.filter(
        (application) => application.status === "submitted",
      ).length,

      approved: applications.filter(
        (application) => application.status === "approved",
      ).length,

      rejected: applications.filter(
        (application) => application.status === "rejected",
      ).length,
    };
  }, [applications]);

  // ==========================================================
  // Filter
  // ==========================================================

  const filteredApplications = useMemo(() => {
    if (status === "all") {
      return applications;
    }

    return applications.filter((application) => application.status === status);
  }, [applications, status]);

  // ==========================================================
  // Invitation
  // ==========================================================

  function openInviteModal() {
    setInvitePhone("");
    setInviteExpiresInDays(7);
    setInviteError("");
    setCreatedInvite(null);
    setCopied(false);

    setInviteModalOpen(true);
  }

  function closeInviteModal() {
    if (creatingInvite) {
      return;
    }

    setInviteModalOpen(false);
  }

  async function handleCreateInvite(event) {
    event.preventDefault();

    setCreatingInvite(true);
    setInviteError("");
    setCreatedInvite(null);
    setCopied(false);

    try {
      const invite = await createCandidateInvite({
        phone: invitePhone.trim() || null,
        expiresInDays: Number(inviteExpiresInDays),
      });

      const applicationUrl = `${window.location.origin}/apply?invite=${encodeURIComponent(
        invite.token,
      )}`;

      setCreatedInvite({
        ...invite,
        applicationUrl,
      });
    } catch (inviteCreationError) {
      console.error(
        "Error creating candidate invitation:",
        inviteCreationError,
      );

      setInviteError(
        inviteCreationError?.message ||
          "The candidate invitation could not be created.",
      );
    } finally {
      setCreatingInvite(false);
    }
  }

  async function handleCopyInviteLink() {
    if (!createdInvite?.applicationUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(createdInvite.applicationUrl);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (copyError) {
      console.error("Error copying candidate invitation:", copyError);

      setInviteError(
        "The link could not be copied automatically. Please copy it manually.",
      );
    }
  }

  // ==========================================================
  // Helpers
  // ==========================================================

  function formatDate(value) {
    if (!value) {
      return "—";
    }

    return new Date(value).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function getStatusLabel(value) {
    if (value === "submitted") return "Pending";
    if (value === "approved") return "Approved";
    if (value === "rejected") return "Rejected";

    return value;
  }

  function getStatusClasses(value) {
    if (value === "approved") {
      return "bg-[#E8F5E9] text-[#2E7D32]";
    }

    if (value === "rejected") {
      return "bg-red-50 text-red-700";
    }

    return "bg-amber-50 text-amber-700";
  }

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <>
      <main className="min-h-screen bg-[#F9FAF9] py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#2E7D32]">
                Administration
              </p>

              <h1 className="text-4xl font-heading text-[#1A1A1A] md:text-5xl">
                Candidates
              </h1>

              <p className="mt-3 text-[#1A1A1A]/60">
                Review candidate applications and manage recruitment
                invitations.
              </p>
            </div>

            <button
              type="button"
              onClick={openInviteModal}
              className="inline-flex items-center justify-center rounded-xl bg-[#2E7D32] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#256628]"
            >
              Invite Candidate
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="mb-8 rounded-2xl border border-[#2E7D32]/10 bg-white p-6">
              <p className="text-sm text-[#1A1A1A]/60">Loading candidates...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Stats */}
              <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#2E7D32]/10 bg-white p-5">
                  <p className="text-sm text-[#1A1A1A]/50">
                    Pending Applications
                  </p>

                  <p className="mt-1 text-3xl font-heading text-[#1A1A1A]">
                    {stats.submitted}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#2E7D32]/10 bg-white p-5">
                  <p className="text-sm text-[#1A1A1A]/50">Approved</p>

                  <p className="mt-1 text-3xl font-heading text-[#1A1A1A]">
                    {stats.approved}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#2E7D32]/10 bg-white p-5">
                  <p className="text-sm text-[#1A1A1A]/50">Rejected</p>

                  <p className="mt-1 text-3xl font-heading text-[#1A1A1A]">
                    {stats.rejected}
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="mb-8 rounded-2xl border border-[#2E7D32]/10 bg-white p-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus("submitted")}
                    className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                      status === "submitted"
                        ? "bg-[#2E7D32] text-white"
                        : "text-[#1A1A1A]/60 hover:bg-[#F9FAF9]"
                    }`}
                  >
                    Pending ({stats.submitted})
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus("approved")}
                    className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                      status === "approved"
                        ? "bg-[#2E7D32] text-white"
                        : "text-[#1A1A1A]/60 hover:bg-[#F9FAF9]"
                    }`}
                  >
                    Approved ({stats.approved})
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus("rejected")}
                    className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                      status === "rejected"
                        ? "bg-[#2E7D32] text-white"
                        : "text-[#1A1A1A]/60 hover:bg-[#F9FAF9]"
                    }`}
                  >
                    Rejected ({stats.rejected})
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus("all")}
                    className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                      status === "all"
                        ? "bg-[#2E7D32] text-white"
                        : "text-[#1A1A1A]/60 hover:bg-[#F9FAF9]"
                    }`}
                  >
                    All ({stats.total})
                  </button>
                </div>
              </div>

              {/* Results */}
              {applications.length > 0 && (
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-[#1A1A1A]/50">
                    Showing{" "}
                    <span className="font-medium text-[#1A1A1A]">
                      {filteredApplications.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-[#1A1A1A]">
                      {applications.length}
                    </span>{" "}
                    applications
                  </p>
                </div>
              )}

              {/* Candidate list */}
              {filteredApplications.length > 0 && (
                <div className="grid gap-4">
                  {filteredApplications.map((application) => (
                    <div
                      key={application.id}
                      className="rounded-2xl border border-[#2E7D32]/10 bg-white p-5"
                    >
                      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div className="flex min-w-0 items-center gap-4">
                          {/* Candidate avatar placeholder */}
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] text-xl font-heading text-[#2E7D32]">
                            {application.name
                              ?.trim()
                              ?.charAt(0)
                              ?.toUpperCase() || "?"}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="text-lg font-heading text-[#1A1A1A]">
                                {application.name}
                              </h2>

                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                                  application.status,
                                )}`}
                              >
                                {getStatusLabel(application.status)}
                              </span>
                            </div>

                            <p className="mt-1 text-sm text-[#1A1A1A]/60">
                              {application.location || "Location not provided"}
                              {" · "}
                              {application.years ?? 0} years experience
                            </p>

                            {application.email && (
                              <p className="mt-1 truncate text-sm text-[#1A1A1A]/45">
                                {application.email}
                              </p>
                            )}

                            <p className="mt-2 text-xs text-[#1A1A1A]/40">
                              Submitted {formatDate(application.submittedAt)}
                            </p>
                          </div>
                        </div>

                        <Link
                          to={`/admin/candidates/${application.id}`}
                          className="inline-flex shrink-0 items-center justify-center rounded-xl border border-[#2E7D32]/20 bg-white px-5 py-2.5 text-sm font-medium text-[#2E7D32] transition-colors hover:bg-[#E8F5E9]"
                        >
                          View Application
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No candidates */}
              {applications.length === 0 && (
                <div className="rounded-3xl border border-dashed border-[#2E7D32]/20 bg-white px-6 py-16 text-center">
                  <h2 className="text-xl font-heading text-[#1A1A1A]">
                    No candidate applications yet
                  </h2>

                  <p className="mt-2 text-sm text-[#1A1A1A]/50">
                    Invite a candidate to submit their first application.
                  </p>

                  <button
                    type="button"
                    onClick={openInviteModal}
                    className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#2E7D32] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#256628]"
                  >
                    Invite Candidate
                  </button>
                </div>
              )}

              {/* No filter results */}
              {applications.length > 0 && filteredApplications.length === 0 && (
                <div className="rounded-3xl border border-dashed border-[#2E7D32]/20 bg-white px-6 py-16 text-center">
                  <h2 className="text-xl font-heading text-[#1A1A1A]">
                    No {getStatusLabel(status).toLowerCase()} applications
                  </h2>

                  <p className="mt-2 text-sm text-[#1A1A1A]/50">
                    There are currently no applications with this status.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Candidate Invitation Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close candidate invitation"
            onClick={closeInviteModal}
            className="absolute inset-0 bg-black/40"
          />

          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl md:p-8">
            {!createdInvite ? (
              <>
                <div className="mb-7">
                  <p className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-[#2E7D32]">
                    Candidate Invitation
                  </p>

                  <h2 className="text-2xl font-heading text-[#1A1A1A]">
                    Invite Candidate
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#1A1A1A]/55">
                    Create a private, single-use application link for a
                    candidate.
                  </p>
                </div>

                <form onSubmit={handleCreateInvite}>
                  <div className="space-y-5">
                    <div>
                      <label
                        htmlFor="candidate-phone"
                        className="mb-2 block text-sm font-medium text-[#1A1A1A]"
                      >
                        Candidate phone
                        <span className="ml-1 font-normal text-[#1A1A1A]/40">
                          (optional)
                        </span>
                      </label>

                      <input
                        id="candidate-phone"
                        type="tel"
                        value={invitePhone}
                        onChange={(event) => setInvitePhone(event.target.value)}
                        placeholder="61477507874"
                        className="h-11 w-full rounded-xl border border-[#1A1A1A]/10 px-4 outline-none focus:border-[#2E7D32]/40 focus:ring-2 focus:ring-[#2E7D32]/10"
                      />

                      <p className="mt-2 text-xs leading-5 text-[#1A1A1A]/40">
                        If provided, this phone number will be linked to the
                        invitation.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="candidate-expiration"
                        className="mb-2 block text-sm font-medium text-[#1A1A1A]"
                      >
                        Link expires in
                      </label>

                      <select
                        id="candidate-expiration"
                        value={inviteExpiresInDays}
                        onChange={(event) =>
                          setInviteExpiresInDays(Number(event.target.value))
                        }
                        className="h-11 w-full rounded-xl border border-[#1A1A1A]/10 px-4 outline-none focus:border-[#2E7D32]/40 focus:ring-2 focus:ring-[#2E7D32]/10"
                      >
                        <option value={1}>1 day</option>
                        <option value={3}>3 days</option>
                        <option value={7}>7 days</option>
                        <option value={14}>14 days</option>
                        <option value={30}>30 days</option>
                      </select>
                    </div>
                  </div>

                  {inviteError && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                      <p className="text-sm text-red-700">{inviteError}</p>
                    </div>
                  )}

                  <div className="mt-7 flex justify-end gap-3 border-t border-[#1A1A1A]/10 pt-5">
                    <button
                      type="button"
                      onClick={closeInviteModal}
                      disabled={creatingInvite}
                      className="rounded-xl border border-[#1A1A1A]/10 px-5 py-2.5 text-sm font-medium text-[#1A1A1A] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={creatingInvite}
                      className="rounded-xl bg-[#2E7D32] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#256628] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {creatingInvite ? "Creating..." : "Create Invitation"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="mb-7">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F5E9] text-xl text-[#2E7D32]">
                    ✓
                  </div>

                  <p className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-[#2E7D32]">
                    Invitation Created
                  </p>

                  <h2 className="text-2xl font-heading text-[#1A1A1A]">
                    Candidate link ready
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#1A1A1A]/55">
                    Send this private link directly to the candidate.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#2E7D32]/10 bg-[#F9FAF9] p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#1A1A1A]/40">
                    Application link
                  </p>

                  <p className="break-all text-sm leading-6 text-[#1A1A1A]">
                    {createdInvite.applicationUrl}
                  </p>
                </div>

                <div className="mt-4 rounded-2xl bg-[#E8F5E9]/60 px-4 py-3">
                  <p className="text-sm text-[#1B3D1E]">
                    This link can be used once and expires on{" "}
                    <span className="font-semibold">
                      {new Date(createdInvite.expiresAt).toLocaleDateString(
                        "en-AU",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </span>
                    .
                  </p>
                </div>

                {inviteError && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm text-red-700">{inviteError}</p>
                  </div>
                )}

                <div className="mt-7 flex justify-end gap-3 border-t border-[#1A1A1A]/10 pt-5">
                  <button
                    type="button"
                    onClick={closeInviteModal}
                    className="rounded-xl border border-[#1A1A1A]/10 px-5 py-2.5 text-sm font-medium text-[#1A1A1A] transition-colors hover:bg-gray-50"
                  >
                    Done
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyInviteLink}
                    className="rounded-xl bg-[#2E7D32] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#256628]"
                  >
                    {copied ? "Copied ✓" : "Copy Link"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
