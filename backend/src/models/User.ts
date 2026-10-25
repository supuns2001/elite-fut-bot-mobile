import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  trialDays: number;
  isDuplicateTrial: boolean;
  registrationIp: string;
  registrationCountry: string;
  lastLoginIp: string;
  lastLoginCountry: string;
  purchases: number;
  profits: number;
  isPaid: boolean;
  licenseExpiresAt: Date | null;
  licenseLastVerifiedAt: Date | null;
  paymentProvider: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripeSubscriptionStatus: string | null;
  stripeSubscriptionCancelAt: Date | null;
  mobileAccessExpiresAt: Date | null;
  deviceIds: string[];
  refreshTokens: string[];
  resetPasswordToken: string | null;
  resetPasswordExpires: Date | null;
  botStatus: 'idle' | 'running' | 'stopped';
  activeFilters: Record<string, unknown> | null;
  lastSnipeAt: Date | null;
  lastSeenAt: Date;
  runningSince: Date | null;
  fcmTokens: string[];
  referredBy: mongoose.Types.ObjectId | null;
  stripePayments: unknown[];
  activeDevices: unknown[];
  recentPurchases: unknown[];
  referralCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    trialDays: {
      type: Number,
      default: 2,
    },
    isDuplicateTrial: {
      type: Boolean,
      default: false,
    },
    registrationIp: {
      type: String,
      default: '',
    },
    registrationCountry: {
      type: String,
      default: 'LK',
    },
    lastLoginIp: {
      type: String,
      default: '',
    },
    lastLoginCountry: {
      type: String,
      default: '',
    },
    purchases: {
      type: Number,
      default: 0,
    },
    profits: {
      type: Number,
      default: 0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    licenseExpiresAt: {
      type: Date,
      default: null,
    },
    licenseLastVerifiedAt: {
      type: Date,
      default: null,
    },
    paymentProvider: {
      type: String,
      default: null,
    },
    stripeCustomerId: {
      type: String,
      default: null,
    },
    stripeSubscriptionId: {
      type: String,
      default: null,
    },
    stripeSubscriptionStatus: {
      type: String,
      default: null,
    },
    stripeSubscriptionCancelAt: {
      type: Date,
      default: null,
    },
    mobileAccessExpiresAt: {
      type: Date,
      default: null,
    },
    deviceIds: {
      type: [String],
      default: [],
    },
    refreshTokens: {
      type: [String],
      default: [],
      select: false,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    botStatus: {
      type: String,
      enum: ['idle', 'running', 'stopped'],
      default: 'idle',
    },
    activeFilters: {
      type: Schema.Types.Mixed,
      default: null,
    },
    lastSnipeAt: {
      type: Date,
      default: null,
    },
    lastSeenAt: {
      type: Date,
      default: Date.now,
    },
    runningSince: {
      type: Date,
      default: null,
    },
    fcmTokens: {
      type: [String],
      default: [],
    },
    referredBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    stripePayments: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    activeDevices: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    recentPurchases: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema);
