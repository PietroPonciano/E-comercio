import { z } from "zod";

const categoryBaseSchema = {
    nome: z.string().min(2, "Nome obrigatório"),
    descricao: z.string().min(3, "Descrição obrigatória"),
};

export const createCategorySchema = z.object(categoryBaseSchema);

export const updateCategorySchema = z.object(categoryBaseSchema);
