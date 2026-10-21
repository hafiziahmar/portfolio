import { messageRepo, MessageRecord } from '../repositories/message.repo.js';
import { logger } from '../utils/logger.js';

export interface CreateMessageDTO {
  sender_name: string;
  sender_email: string;
  sender_organization?: string;
  subject: string;
  message: string;
  honeypot?: string; // Bot trap: if filled, reject quietly
  ip_address?: string;
}

export class MessageService {
  async submitRecruiterMessage(dto: CreateMessageDTO): Promise<{ success: boolean; messageId?: number }> {
    // Honeypot check - reject spam bots silently
    if (dto.honeypot && dto.honeypot.trim().length > 0) {
      logger.warn('Spam detected via honeypot field:', { ip: dto.ip_address, email: dto.sender_email });
      return { success: true }; // Return fake success to confuse spam scripts
    }

    const created = await messageRepo.createMessage({
      sender_name: dto.sender_name.trim(),
      sender_email: dto.sender_email.trim().toLowerCase(),
      sender_organization: dto.sender_organization?.trim() || null,
      subject: dto.subject.trim(),
      message: dto.message.trim(),
      ip_address: dto.ip_address || null,
    });

    logger.info('New recruiter message received and stored in queue:', {
      id: created.id,
      from: created.sender_name,
      org: created.sender_organization,
    });

    return { success: true, messageId: created.id };
  }

  async getAllMessages(): Promise<MessageRecord[]> {
    return await messageRepo.getAllMessages();
  }

  async updateStatus(id: number, status: MessageRecord['status']): Promise<MessageRecord | null> {
    return await messageRepo.updateMessageStatus(id, status);
  }

  async deleteMessage(id: number): Promise<boolean> {
    return await messageRepo.deleteMessage(id);
  }
}

export const messageService = new MessageService();
