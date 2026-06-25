import { useQuery } from "@tanstack/react-query";
import { getProfileRequest } from "../services/profile.service";

export function useProfile() {
    return useQuery({
        queryKey: ["profile"],
        queryFn: getProfileRequest,
        staleTime: 1000 * 60 * 5
    });
}