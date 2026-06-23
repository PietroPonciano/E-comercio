
import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    senha: z.string().min(6, "Senha muito curta"),
});