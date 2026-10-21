import { adminRepo, AdminRecord } from '../repositories/admin.repo.js';
import { comparePassword, hashPassword } from '../utils/hash.js';
import { signToken, TokenPayload } from '../utils/jwt.js';
import { logger } from '../utils/logger.js';

export interface LoginResult {
  token: string;
  admin: {
    id: number;
    username: string;
    email: string;
  };
}

export class AuthService {
  async login(username: string, password: string): Promise<LoginResult | null> {
    const admin = await adminRepo.findByUsername(username);
    if (!admin) {
      logger.warn(`Failed login attempt for nonexistent user: ${username}`);
      return null;
    }

    const isMatch = await comparePassword(password, admin.password_hash);
    if (!isMatch) {
      logger.warn(`Invalid password attempt for user: ${username}`);
      return null;
    }

    const payload: TokenPayload = {
      adminId: admin.id,
      username: admin.username,
      email: admin.email,
    };

    const token = signToken(payload);
    logger.info(`Admin successfully authenticated: ${username}`);

    return {
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
      },
    };
  }

  async verifyAdmin(adminId: number): Promise<AdminRecord | null> {
    return await adminRepo.findById(adminId);
  }

  async changePassword(adminId: number, currentPass: string, newPass: string): Promise<{ success: boolean; error?: string }> {
    const admin = await adminRepo.findById(adminId);
    if (!admin) return { success: false, error: 'Admin record not found' };

    const isMatch = await comparePassword(currentPass, admin.password_hash);
    if (!isMatch) return { success: false, error: 'Current password is incorrect' };

    if (!newPass || newPass.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters long' };
    }

    const newHash = await hashPassword(newPass);
    const updated = await adminRepo.updatePassword(adminId, newHash);
    if (!updated) return { success: false, error: 'Failed to update password' };

    logger.info(`Admin password successfully changed for user: ${admin.username}`);
    return { success: true };
  }
}

export const authService = new AuthService();
