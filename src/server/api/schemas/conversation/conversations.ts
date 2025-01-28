import { z } from "zod";

// Get all user's conversations
export const conversationsSchema = z.object({
  userId: z.number().int().optional(),
  conversationId: z.string().uuid().optional(),
});

// creating a new conversation
export const newConversationSchema = z.object({
  userId: z.number().int(),
  targetUserId: z.number().int(),
});

export const pinConversationSchema = z.object({
  conversationId: z.string().uuid(),
  isPinned: z.boolean(),
});

export const archiveConversationSchema = z.object({
  conversationId: z.string().uuid(),
});

export const blockUserSchema = z.object({
  userId: z.number().int(),
});
