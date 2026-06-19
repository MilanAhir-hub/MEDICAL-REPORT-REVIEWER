import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../api/user.api";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: fetchUserProfile
  });
};
