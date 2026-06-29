import { useQuery } from "@tanstack/react-query";
import { 
    getMyTicketByIdRequest
} from "../services/getMyTicketById.service";
import { getTicketByIdRequest} from "../services/getTicketById.service";

export function useTicket(id) {
    return useQuery({
        queryKey: ["ticket", id],
        queryFn: async () => {
            try {
                
                return await getMyTicketByIdRequest(id);
            } catch (error) {
                
                const status = error.response?.status;

                if (status === 403 || status === 404) {
                    
                    return await getTicketByIdRequest(id);
                }

                
                throw error;
            }
        },
        enabled: !!id,
        retry: false, 
    });
}