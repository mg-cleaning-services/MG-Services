import jobs from "@/data/jobs.json";

export function getJobs() {
  return jobs;
}

export function getJobById(id) {
  return jobs.find((job) => job.id === id);
}

export function createJob(currentJobs, jobData) {
  const newJob = {
    ...jobData,
    id: createJobId(currentJobs),
    status: jobData.status || "unassigned",
    createdAt: new Date().toISOString(),
  };

  return [...currentJobs, newJob];
}

export function updateJob(currentJobs, updatedJob) {
  return currentJobs.map((job) =>
    job.id === updatedJob.id ? updatedJob : job,
  );
}

export function updateJobStatus(currentJobs, jobId, status) {
  return currentJobs.map((job) =>
    job.id === jobId
      ? {
          ...job,
          status,
        }
      : job,
  );
}

export function deleteJob(currentJobs, jobId) {
  return currentJobs.filter((job) => job.id !== jobId);
}

function createJobId(currentJobs) {
  const highestNumber = currentJobs.reduce((highest, job) => {
    const number = Number(job.id?.replace("JOB-", "")) || 0;
    return Math.max(highest, number);
  }, 0);

  return `JOB-${String(highestNumber + 1).padStart(3, "0")}`;
}
