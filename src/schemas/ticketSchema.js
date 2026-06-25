import { z } from "zod";

export const createMessageSchema = z
    .object({
        mensagem: z.string().trim().optional(),
        imagem_url: z.string().trim().optional()
    })
    .refine(
        (data) =>
            !!data.mensagem?.length ||
            !!data.imagem_url?.length,
        {
            message:
                "Informe uma mensagem ou uma imagem."
        }
    );