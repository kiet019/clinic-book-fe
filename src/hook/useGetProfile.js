import { useQuery } from "@tanstack/react-query";
import { getAccessToken } from "../lib/token";
import { apiFetch } from "../lib/apiFetch";

export const useGetProfile = () => {
  const accessToken = getAccessToken();

  const query = useQuery({
    queryKey: [accessToken, 'userInfo'],
    queryFn: async () => {
      const { data, status } = await apiFetch("/user/info", {
        method: "GET",
      });
      if (!status) return null;
      else return data;
    },
    enabled: true,
  });

  return query;
};
