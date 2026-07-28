import axios from "axios";

const API = "http://localhost:5000/api/catalog";

export async function importCatalog(excelFile, imageZip) {
  const formData = new FormData();

  formData.append("excel", excelFile);
  formData.append("images", imageZip);

  const response = await axios.post(
    `${API}/import`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  console.log("FULL AXIOS RESPONSE");
  console.log(response);

  return response.data;
}