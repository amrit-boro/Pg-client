import axios from "axios";

export const signup = async ({
  name: full_name,
  phone: phone_number,
  email,
  password,
}) => {
  console.log({ full_name, phone_number, email, password });
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v1/signup`,
      { full_name, phone_number, email, password },
      {
        withCredentials: true,
      },
    );

    return res.data;
  } catch (err) {
    console.log(err.response);
    throw new Error(err.response?.data?.message || "Signup failed");
  }
};

export const login = async ({ email, password }) => {
  console.log(email, password);
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v1/login`,
      {
        email,
        password,
      },
      { withCredentials: true },
    );
    return res;
  } catch (err) {
    console.log(err.response);
    throw new Error(err.response?.data?.message || "Signup failed");
  }
};

export const getUser = async () => {
  try {
    const res = await axios.get(
      "${import.meta.env.VITE_API_URL}/api/v1/user/getuser",
      {
        withCredentials: true,
      },
    );
    return res;
  } catch (err) {
    console.log(err.response);
    throw new Error(err.response?.data?.message || "Faild to fetch user data");
  }
};
