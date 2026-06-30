import { z } from "zod";

const productBaseSchema = {
    nome: z.string().min(2, "Nome obrigatório"),
    descricao: z.string().min(5, "Descrição obrigatória"),
    preco: z.coerce.number().positive("Preço deve ser positivo"),
    imagem_url: z
        .string()
        .url("URL inválida")
        .optional()
        .or(z.literal("")),
    categoria_id: z.coerce.number().optional().nullable(),
};

export const createProductSchema = z.object(productBaseSchema);

export const updateProductSchema = z.object(productBaseSchema);
