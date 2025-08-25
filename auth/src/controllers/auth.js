import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
// import { OAuth2Client } from "google-auth-library";
import User from "../models/user.js";

// const client = new OAuth2Client(process.env.CLIENT_ID);

const AuthController = {
  // googleAuth: async (req, res) => {
  //   try {
  //     const { credential } = req.body;
  //     if (!credential) return res.status(400).json({ error: "No credential provided" });

  //     const ticket = await client.verifyIdToken({
  //       idToken: credential,
  //       audience: process.env.CLIENT_ID,
  //     });

  //     const payload = ticket.getPayload();
  //     const { email, name, picture } = payload;

  //     let user = await User.findOne({ email });
  //     if (!user) {
  //       user = await User.create({
  //         name: name || "",
  //         email,
  //         password: "",
  //         phoneNumber: "",
  //         userImage: picture,
  //       });
  //     }

  //     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  //     res.json({ user, token });
  //   } catch (err) {
  //     res.status(400).json({ error: "Invalid Google Token", details: err.message });
  //   }
  // },

  signup: async (req, res) => {
    const { email, password, name, phoneNumber } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "User already exists!" });

    const hashed = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, phoneNumber, password: hashed });
    res.json(user);
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ error: "Incorrect password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ user, token });
  },

  changePassword: async (req, res) => {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ success: "Password changed successfully" });
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
    // TODO: send email via nodemailer
    res.json({ success: "Password reset link sent", resetUrl });
  },

  resetPassword: async (req, res) => {
    const { token, email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid request" });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    if (
      hashedToken !== user.passwordResetToken ||
      user.passwordResetExpires < Date.now()
    ) {
      return res.status(400).json({ error: "Invalid or expired reset token!" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    res.json({ success: "Password reset successfully" });
  },

  me: async (req, res) => {
    const user = await req.user.populate(
      "defaultShippingAddress defaultBillingAddress"
    );
    res.json(user);
  },
};

export default AuthController;
