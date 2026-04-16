import axios from "axios";

export async function getAllPg() {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/v1/listings/top-4`,
    );
    return response;
  } catch (error) {
    console.error("Error fetching PG's ", error);
    throw error;
  }
}

export async function getFilteredPg(filters) {
  const baseUrl = `${import.meta.env.VITE_API_URL}/api/v1/pg/getAllPgs`;
  const response = await axios.get(baseUrl, {
    params: filters,
  });
  return response.data;
}

export async function getFilteredListings({ queryKey }) {
  const [_key, filters, page] = queryKey;
  const baseUrl = `${import.meta.env.VITE_API_URL}/api/v1/listings/filters`;
  const response = await axios.get(baseUrl, {
    params: {
      ...filters,
      page,
    },
  });

  return response.data;
}

export async function getAllRoomsByPgId(pgId, type, page) {
  const baseUrl = `${import.meta.env.VITE_API_URL}/api/v1/listings/${pgId}/rooms`;
  const res = await axios.get(baseUrl, {
    params: { type, page },
  });
  return res.data;
}

export async function getPgdetailById(id) {
  const baseUrl = `${import.meta.env.VITE_API_URL}/api/v1/listings/${id}`;
  const res = await axios.get(baseUrl);

  return res.data;
}
// =====================================================================================

export async function getPgDetail() {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/v1/pg/getSinglePg`,
      {
        withCredentials: true,
      },
    );
    console.log("result: ", res);
    console.log("resutl typ: ", typeof res);
    return res;
  } catch (err) {
    console.log(err);
    throw new Error("Error fetching pg data: ", err);
  }
}

export async function getdetailById(id) {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/v1/listings/room/${id}`,
    );
    if (!res.data) {
      throw new Error("Invalid response from server");
    }
    console.log("response: ", res);
    return res.data;
  } catch (error) {
    throw error.response?.data.message || "Failed to fetch room details";
  }
}

/*
{
  title,
  description,
  address_line_1,
  city,
  area_name,
  monthly_rent_base,
  security_deposit_months,
  is_deposit_refundable,
  near_me,
  amenities,
  image_url,
}
*/
export async function createPg(formData) {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v1/pg/pgCreate`,
      formData, // 2nd Argument: The Data
      {
        // 3rd Argument: The Configuration (Headers + Credentials)
        withCredentials: true, // <--- MUST BE INSIDE HERE
        headers: {
          // "Content-Type": "multipart/form-data" // Optional: Axios detects this automatically
        },
      },
    );
    console.log("pg create result: ", res);
    return res;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data?.message || "Error creating pg");
  }
}

export async function fetchRooms({ queryKey }) {
  const [, pgId, type] = queryKey;

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/v1/listings/total/${pgId}`,
  );

  if (!res.ok) throw new Error("Failed to fetch rooms");

  return res.json();
}
