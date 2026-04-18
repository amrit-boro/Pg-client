export const uploadFileDirectly = async (file) => {
  // 1. Get the 'Permission Slip' from your backend
  const sigRes = await fetch(
    `${import.meta.env.VITE_API_URL}/api/v1/listings/upload-signature`,
  );
  const { signature, timestamp, cloud_name, api_key, folder } =
    await sigRes.json();

  // 2. Prepare the data for Cloudinary
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", api_key);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder); // Must match the folder used in signature

  // 3. POST directly to Cloudinary
  const cloudRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  return await cloudRes.json(); // Returns { secure_url, public_id }
};
