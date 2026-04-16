import axios from "axios";

export async function getUser() {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/v1/user/getuser`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      return null;
    }
    console.log(err);
    throw new Error("Error fetching user datab", err);
  }
}
