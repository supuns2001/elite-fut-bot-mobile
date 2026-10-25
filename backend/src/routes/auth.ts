import crypto from 'crypto';
import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'elite_fut_bot_secret_jwt_key_2026_x9';

// Generate a random 6-character unique referral code (e.g. 'A4F91C')
const generateReferralCode = async (): Promise<string> => {
  let isUnique = false;
  let code = '';

  while (!isUnique) {
    code = crypto.randomBytes(3).toString('hex').toUpperCase();
    const existing = await User.findOne({ referralCode: code });
    if (!existing) {
      isUnique = true;
    }
  }

  return code;
};

/**
 * POST /api/auth/register
 * Registers a new user with a 2-day Free Trial
 */
authRouter.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password, referralCode, deviceId } = req.body;

    // 1. Validation
    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'First name, last name, email, and password are required',
      });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Check for duplicate email
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
      return;
    }

    // 3. Referral code handling
    let referredById = null;
    if (referralCode && typeof referralCode === 'string') {
      const referringUser = await User.findOne({
        referralCode: referralCode.trim().toUpperCase(),
      });
      if (referringUser) {
        referredById = referringUser._id;
      }
    }

    // 4. Generate user's own unique referral code
    const newReferralCode = await generateReferralCode();

    // 5. Password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Calculate 2-Day Free Trial expiration (48 hours from now)
    const trialDays = 2;
    const trialDurationMs = trialDays * 24 * 60 * 60 * 1000;
    const mobileAccessExpiresAt = new Date(Date.now() + trialDurationMs);

    // 7. Client IP resolution
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      '';

    // 8. Create user document
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'user',
      trialDays,
      isDuplicateTrial: false,
      registrationIp: clientIp,
      registrationCountry: 'LK',
      lastLoginIp: clientIp,
      lastLoginCountry: 'LK',
      purchases: 0,
      profits: 0,
      isPaid: false,
      mobileAccessExpiresAt,
      deviceIds: deviceId ? [deviceId] : [],
      refreshTokens: [],
      botStatus: 'idle',
      referredBy: referredById,
      referralCode: newReferralCode,
    });

    // 9. Generate JWT access token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Registration successful! 2-day free trial activated.',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        trialDays: user.trialDays,
        isPaid: user.isPaid,
        mobileAccessExpiresAt: user.mobileAccessExpiresAt,
        referralCode: user.referralCode,
        botStatus: user.botStatus,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during registration',
    });
  }
});

/**
 * POST /api/auth/login
 * User sign in
 */
authRouter.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, deviceId } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user || !user.password) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    // Update last login info
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      '';
    user.lastLoginIp = clientIp;
    user.lastSeenAt = new Date();
    if (deviceId && !user.deviceIds.includes(deviceId)) {
      user.deviceIds.push(deviceId);
    }
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        trialDays: user.trialDays,
        isPaid: user.isPaid,
        mobileAccessExpiresAt: user.mobileAccessExpiresAt,
        referralCode: user.referralCode,
        botStatus: user.botStatus,
      },
    });
  } catch (error: any) {
    console.error('❌ Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * GET /api/auth/me
 * Retrieves current user profile and trial status
 */
authRouter.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const user = req.user!;
  const isTrialExpired = user.mobileAccessExpiresAt
    ? new Date() > new Date(user.mobileAccessExpiresAt)
    : false;

  res.json({
    success: true,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      trialDays: user.trialDays,
      isPaid: user.isPaid,
      isTrialExpired,
      mobileAccessExpiresAt: user.mobileAccessExpiresAt,
      referralCode: user.referralCode,
      botStatus: user.botStatus,
      profits: user.profits,
      purchases: user.purchases,
    },
  });
});
