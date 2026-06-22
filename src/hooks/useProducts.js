import { useQuery, keepPreviousData } from '@tanstack/react-query' 
import { getProducts } from '../services/products.service.js'

export function useProducts(page) {
    return useQuery({
        queryKey: ["products", page],
        queryFn: () => getProducts({ page }),
        placeholderData: keepPreviousData 
    });
}