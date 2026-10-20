// src/models/AdminUser.ts
import mongoose, { Schema } from 'mongoose';

const AdminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    totpSecret: { type: String, required: true },
  },
  { timestamps: true }
);

export const AdminUserModel =
  mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);