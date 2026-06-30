import { z } from "zod";

export const updateUserSchema = z.object({
    nome: z.string().min(2, "Nome obrigatório"),
    sobrenome: z.string().min(2, "Sobrenome obrigatório"),
    telefone: z
        .string()
        .optional()
        .transform((val) => val?.trim()),
    cpf: z
        .string()
        .refine(
            (value) => value.replace(/\D/g, "").length === 11,
            "CPF inválido"
        )
        .transform((value) => value.replace(/\D/g, "")),
});
