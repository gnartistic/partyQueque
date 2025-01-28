import { z } from "zod";

export const conversationSchema = z.object({
  conversationId: z.string().uuid().nullable(),
});

export const ablyChannel = z.object({
  ablyChannel: z.string(),
});

export const createAttachmentSchema = z
  .object({
    conversationId: z.string().uuid(),
    messageId: z.string().uuid(),
    attachment: z
      .object({
        name: z.string(),
        url: z.string(),
        type: z.string(),
        size: z.number(),
      })
      .optional(),
  })
  .merge(conversationSchema);

export const deleteMessageSchema = z
  .object({
    messageId: z.string().uuid(),
  })
  .merge(ablyChannel);

export const sendMessageSchema = z
  .object({
    conversationId: z.string().nullable(), // Conversation, if you sending in an existing conversation
    message: z.string().default(""), // Message content
    targetUserId: z.number().int().optional(), // User you are trying to message
    attachments: z
      .object({
        name: z.string(),
        url: z.string(),
        type: z.string(),
        size: z.number(),
      })
      .array()
      .optional(),
  })
  .merge(ablyChannel);

export const editMessageSchema = z
  .object({
    messageId: z.string().uuid(),
    message: z.string(),
  })
  .merge(ablyChannel);

export const readMessageSchema = z
  .object({
    messageId: z.string().uuid(),
  })
  .merge(ablyChannel);

export const consentSchema = z.object({
  consent: z.boolean(),
});
