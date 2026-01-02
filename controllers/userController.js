import User from '../models/User.js';
import { sendInviteEmail } from '../utils/email.js';
import crypto from 'crypto';

// @desc    Get all admin users
// @route   GET /api/users
// @access  Private (Owner only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users: users.map(user => ({
        id: user._id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastSignInAt: user.lastSignInAt,
        isActive: user.isActive,
        mustChangePassword: user.mustChangePassword
      }))
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب المستخدمين'
    });
  }
};

// @desc    Invite new admin
// @route   POST /api/users/invite
// @access  Private (Owner only)
export const inviteUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مطلوب'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'المستخدم موجود بالفعل'
      });
    }

    // Create user with temporary password
    const tempPassword = crypto.randomBytes(16).toString('hex');
    
    const user = await User.create({
      email,
      password: tempPassword,
      role: 'admin',
      mustChangePassword: true,
      isActive: false // Will be activated when they accept invite
    });

    // Generate invite token
    const inviteToken = crypto.randomBytes(32).toString('hex');
    user.inviteToken = crypto.createHash('sha256').update(inviteToken).digest('hex');
    user.inviteTokenExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    await user.save();

    // Send invite email
    try {
      await sendInviteEmail(email, inviteToken);
    } catch (emailError) {
      // If email fails, delete the user
      await User.findByIdAndDelete(user._id);
      throw emailError;
    }

    res.status(201).json({
      success: true,
      message: 'تم إرسال الدعوة بنجاح',
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Invite user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'خطأ في إرسال الدعوة'
    });
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private (Owner only)
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['owner', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'الدور غير صحيح'
      });
    }

    // Don't allow user to change their own role
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'لا يمكنك تغيير دورك الخاص'
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'تم تحديث الدور بنجاح',
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث الدور'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Owner only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Don't allow user to delete themselves
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'لا يمكنك حذف حسابك الخاص'
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'تم حذف المستخدم بنجاح'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف المستخدم'
    });
  }
};
