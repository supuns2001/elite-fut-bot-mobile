import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';

export const usersRouter = Router();

/**
 * PUT /api/users/bot-status
 * Updates the user's bot running state and logs recent snipes/filters
 */
usersRouter.put('/bot-status', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { status, activeFilters, purchase } = req.body;

    if (status && ['idle', 'running', 'stopped'].includes(status)) {
      user.botStatus = status;
      if (status === 'running' && !user.runningSince) {
        user.runningSince = new Date();
      } else if (status === 'stopped' || status === 'idle') {
        user.runningSince = null;
      }
    }

    if (activeFilters !== undefined) {
      user.activeFilters = activeFilters;
    }

    if (purchase && typeof purchase === 'object') {
      user.lastSnipeAt = new Date();
      if (!Array.isArray(user.recentPurchases)) {
        user.recentPurchases = [];
      }
      user.recentPurchases.unshift({
        ...purchase,
        purchasedAt: new Date(),
      });
      // Keep only last 50 purchases
      if (user.recentPurchases.length > 50) {
        user.recentPurchases = user.recentPurchases.slice(0, 50);
      }
    }

    user.lastSeenAt = new Date();
    await user.save();

    res.json({
      success: true,
      botStatus: user.botStatus,
      lastSnipeAt: user.lastSnipeAt,
    });
  } catch (error: any) {
    console.error('❌ Failed to update bot status:', error);
    res.status(500).json({ success: false, message: 'Failed to update bot status' });
  }
});

/**
 * PUT /api/users/stats
 * Increments the user's cumulative purchases and profits
 */
usersRouter.put('/stats', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { purchases = 0, profits = 0 } = req.body;

    const purchasesDelta = Number(purchases) || 0;
    const profitsDelta = Number(profits) || 0;

    user.purchases = (user.purchases || 0) + purchasesDelta;
    user.profits = (user.profits || 0) + profitsDelta;
    user.lastSeenAt = new Date();

    await user.save();

    res.json({
      success: true,
      purchases: user.purchases,
      profits: user.profits,
    });
  } catch (error: any) {
    console.error('❌ Failed to update stats:', error);
    res.status(500).json({ success: false, message: 'Failed to update stats' });
  }
});

/**
 * GET /api/users/stats
 * Returns the user's cumulative stats
 */
usersRouter.get('/stats', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    res.json({
      success: true,
      purchases: user.purchases || 0,
      profits: user.profits || 0,
      botStatus: user.botStatus,
      lastSnipeAt: user.lastSnipeAt,
      runningSince: user.runningSince,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

/**
 * GET /api/users/recent-purchases
 * Returns the user's past purchases / activity history from MongoDB
 */
usersRouter.get('/recent-purchases', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    res.json({
      success: true,
      recentPurchases: Array.isArray(user.recentPurchases) ? user.recentPurchases : [],
      lastSnipeAt: user.lastSnipeAt,
      botStatus: user.botStatus,
    });
  } catch (error: any) {
    console.error('❌ Failed to fetch recent purchases:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch recent purchases' });
  }
});

/**
 * POST /api/users/clear-session
 * Resets the user's active bot session state and filters in MongoDB
 */
usersRouter.post('/clear-session', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    user.botStatus = 'idle';
    user.runningSince = null;
    user.activeFilters = null;
    user.lastSeenAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Bot session and cached state cleared successfully',
      botStatus: user.botStatus,
    });
  } catch (error: any) {
    console.error('❌ Failed to clear session:', error);
    res.status(500).json({ success: false, message: 'Failed to clear session' });
  }
});

