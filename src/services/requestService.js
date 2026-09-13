import requests from "@/data/requests.json";

export function getRequests() {
  return requests;
}

export function getRequestById(id) {
  return requests.find((request) => request.id === id);
}

export function createRequest(currentRequests, requestData) {
  const newRequest = {
    ...requestData,
    id: createRequestId(currentRequests),
    status: "new",
    createdAt: new Date().toISOString(),
  };

  return [...currentRequests, newRequest];
}

export function updateRequest(currentRequests, updatedRequest) {
  return currentRequests.map((request) =>
    request.id === updatedRequest.id ? updatedRequest : request,
  );
}

export function updateRequestStatus(currentRequests, requestId, status) {
  return currentRequests.map((request) =>
    request.id === requestId
      ? {
          ...request,
          status,
        }
      : request,
  );
}

export function deleteRequest(currentRequests, requestId) {
  return currentRequests.filter((request) => request.id !== requestId);
}

function createRequestId(currentRequests) {
  const highestNumber = currentRequests.reduce((highest, request) => {
    const number = Number(request.id?.replace("REQ-", "")) || 0;
    return Math.max(highest, number);
  }, 0);

  return `REQ-${String(highestNumber + 1).padStart(3, "0")}`;
}
