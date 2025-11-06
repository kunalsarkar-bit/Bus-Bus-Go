const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig'); // Multer for file upload handling

const { 
  createAccount, 
  login, 
  verifyProfile,
  uploadProfilePicture,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  getProfileImageByEmail,
} = require('../Controllers/userController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');
const User = require('../models/User');

// Public Routes
// @route   POST /api/users/create-account
// @desc    Register a new user with basic info
// @access  Public
router.post('/create-account', createAccount);

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   POST /api/users/forgot-password
// @desc    Send password reset token
// @access  Public
router.post('/forgot-password', forgotPassword);

// @route   POST /api/users/reset-password
// @desc    Reset user password
// @access  Public
// In your routes file
router.post('/reset-password/:token', resetPassword);
// Protected Routes (requires authentication)
// @route   PUT /api/users/verify-profile
// @desc    Complete user profile verification with profile picture
// @access  Private
router.put(
  '/verify-profile', 
  protect, 
  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'idDocument', maxCount: 1 }
  ]), 
  verifyProfile
);
// @route   POST /api/users/upload/profile-picture
// @desc    Upload or update profile picture separately
// @access  Private
router.post('/upload/profile-picture', protect, upload.single('profilePicture'), uploadProfilePicture);

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', protect, getUserProfile);

// @route   PUT /api/users/update-profile
// @desc    Update user profile with optional profile picture
// @access  Private
router.put('/update-profile', protect, upload.single('profilePicture'), updateUserProfile);

router.get('/users/profile-image/:email', getProfileImageByEmail);

// @route   DELETE /api/users/delete-profile
// @desc    Delete user profile
// @access  Private
router.delete('/delete-profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    
    // Delete profile image from Cloudinary if exists
    if (user.profileImage && user.profileImage.public_id) {
      const { deleteFromCloudinary } = require('../config/cloudinaryConfig');
      await deleteFromCloudinary(user.profileImage.public_id);
    }
    
    // Delete validation ID document from Cloudinary if exists
    if (user.validID && user.validID.documentImage && user.validID.documentImage.public_id) {
      const { deleteFromCloudinary } = require('../config/cloudinaryConfig');
      await deleteFromCloudinary(user.validID.documentImage.public_id);
    }
    
    // Remove user
    await User.findByIdAndDelete(req.user.id);
    
    res.json({ 
      message: 'User profile deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting profile', 
      error: error.message 
    });
  }
});

// Admin Routes
// @route   GET /api/users/admin/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/admin/users', protect, isAdmin, async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .limit(limit)
      .skip(skipIndex)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching users', 
      error: error.message 
    });
  }
});

// @route   GET /api/users/admin/user/:id
// @desc    Get user by ID (admin only)
// @access  Private/Admin
router.get('/admin/user/:id', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching user', 
      error: error.message 
    });
  }
});

// @route   PUT /api/users/admin/user/:id
// @desc    Update user by ID (admin only)
// @access  Private/Admin
router.put('/admin/user/:id', protect, isAdmin, upload.single('profilePicture'), async (req, res) => {
  try {
    const updateData = req.body;
    const userId = req.params.id;
    
    // Prevent updating certain fields
    delete updateData.email;
    delete updateData.password;
    
    let profileImageData = null;
    
    // Upload profile picture if exists
    if (req.file) {
      // Upload file to Cloudinary
      const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinaryConfig');
      profileImageData = await uploadToCloudinary(req.file.path, 'profile_images');
      
      // Delete file from local storage after upload
      const fs = require('fs');
      fs.unlinkSync(req.file.path);
    }
    
    // Get current user data
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    
    // Format address data if provided
    if (updateData.street || updateData.city || updateData.state || updateData.zip || updateData.country) {
      updateData.address = {
        street: updateData.street || user.address?.street,
        city: updateData.city || user.address?.city,
        state: updateData.state || user.address?.state,
        zip: updateData.zip || user.address?.zip,
        country: updateData.country || user.address?.country || "India"
      };
      
      // Remove individual address fields from updateData
      delete updateData.street;
      delete updateData.city;
      delete updateData.state;
      delete updateData.zip;
      delete updateData.country;
    }
    
    // Handle profile image update
    if (profileImageData) {
      // Delete previous profile image if exists
      if (user.profileImage && user.profileImage.public_id) {
        const { deleteFromCloudinary } = require('../config/cloudinaryConfig');
        await deleteFromCloudinary(user.profileImage.public_id);
      }
      
      // Add profile image to update data
      updateData.profileImage = profileImageData;
    }

    // Update user data
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    // Check if file exists and delete it in case of error
    if (req.file) {
      const fs = require('fs');
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }
    
    res.status(500).json({ 
      message: 'Error updating user', 
      error: error.message 
    });
  }
});

module.exports = router;