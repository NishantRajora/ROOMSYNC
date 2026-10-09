import { ChatMessage } from '../types';

/**
 * Generates a symmetric conversation ID for two users.
 * The ID is always the same regardless of who is the sender or recipient.
 */
export const getConversationId = (uid1: string, uid2: string): string => {
  return [uid1, uid2].sort().join('_');
};

/**
 * Determines if a message belongs to a conversation between two users.
 * Handles symmetric conversation IDs and legacy ID formats.
 */
export const isMessageInConversation = (m: ChatMessage | null | undefined, uid1: string, uid2: string): boolean => {
  if (!m) return false;

  // Direct matching
  if ((m.senderId === uid1 && m.recipientId === uid2) ||
      (m.senderId === uid2 && m.recipientId === uid1)) {
    return true;
  }

  if (m.conversationId) {
    const symmetric = getConversationId(uid1, uid2);

    // Symmetric ID match
    if (m.conversationId === symmetric) return true;

    // Legacy matching: conversationId is one of the UIDs and the other UID is involved
    if (m.conversationId === uid1 && (m.senderId === uid2 || m.recipientId === uid2)) return true;
    if (m.conversationId === uid2 && (m.senderId === uid1 || m.recipientId === uid1)) return true;

    // Fallback: conversationId contains both UIDs
    if (m.conversationId.includes(uid1) && m.conversationId.includes(uid2)) return true;
  }

  return false;
};
