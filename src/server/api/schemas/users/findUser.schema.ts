import { z } from "zod";

export const findUserSchema = z
  .object({
    name: z.string().optional(),
  })
  .refine((data) => data.name, {
    message: "A name is required",
  });
