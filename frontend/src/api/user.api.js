import api from "../utils/axios.js";

export const fetchUserProfile = async () => {
  const { data } = await api.get("/user/profile", {
    withCredentials: true // if using cookies/JWT
  });

  console.log("data at fetch user profile is: ", data)
  return data.user;
};
