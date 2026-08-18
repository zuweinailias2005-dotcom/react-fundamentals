import axios from "axios";

const API = "http://localhost:5000/api/import-resolution";

export async function resolveLookup(jobId, data) {
  const response = await axios.post(
    `${API}/${jobId}/resolve-lookup`,
    data
  );

  return response.data;
}