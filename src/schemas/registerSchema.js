import { z } from "zod";

export const registerSchema = z.object({
    nome: z
        .string()
        .min(2, "Nome obrigatório"),

    sobrenome: z
        .string()
        .min(2, "Sobrenome obrigatório"),

    email: z
        .string()
        .email("Email inválido"),

    senha: z
        .string()
        .min(6, "A senha deve possuir no mínimo 6 caracteres"),

    endereco: z
        .string()
        .min(5, "Endereço obrigatório"),

    cpf: z
        .string()
        .refine(
            value => value.replace(/\D/g, "").length === 11,
            "CPF inválido"
        )
        .transform(value => value.replace(/\D/g, "")),

    telefone: z
        .string()
        .optional()
        .transform(val => val?.trim())
});