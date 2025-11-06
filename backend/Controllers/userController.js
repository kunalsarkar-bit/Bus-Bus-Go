const User = require('../models/User');
const { generateToken } = require('../middlewares/authMiddleware');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const fs = require('fs');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinaryConfig');

// Create basic account (minimal registration)
exports.createAccount = async (req, res) => {
  
  const { email, password, name } = req.body; // make sure `name` is included if sent from frontend
console.log("Incoming data:", req.body); // 👈 Log this

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = new User({ email, password, name }); // ensure 'name' is defined in your schema

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: user.toPublicProfile?.() || user // fallback in case method doesn't exist
    });
  } catch (error) {
    console.error("Error creating account:", error); // Add this line
    res.status(500).json({ message: 'Error creating account', error: error.message });
  }
};


// Login with email and password
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        name: user.name,
        email: user.email,
        isVerified: user.isVerified, // ✅ Include this
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Login error', 
      error: error.message 
    });
  }
};


exports.verifyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;
    
    // Check for required fields
    if (
      !profileData.fullName ||
      !profileData.phone ||
      !profileData.gender ||
      !profileData.dateOfBirth ||
      !profileData.idType ||
      !profileData.idNumber
    ) {
      return res.status(400).json({
        message: 'Missing required fields for verification'
      });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Process files if present
    let profileImageData = null;
    let idDocumentData = null;
    
    // Handle profile picture upload
    if (req.files && req.files.profilePicture && req.files.profilePicture[0]) {
      profileImageData = await uploadToCloudinary(
        req.files.profilePicture[0].path, 
        'profile_images'
      );
      // Clean up the temp file
      fs.unlinkSync(req.files.profilePicture[0].path);
      
      // Delete old profile image if exists
      if (user.profileImage?.public_id) {
        await deleteFromCloudinary(user.profileImage.public_id);
      }
    }
    
    // Handle ID document upload
    if (req.files && req.files.idDocument && req.files.idDocument[0]) {
      idDocumentData = await uploadToCloudinary(
        req.files.idDocument[0].path, 
        'id_documents'
      );
      // Clean up the temp file
      fs.unlinkSync(req.files.idDocument[0].path);
      
      // Delete old ID document if exists
      if (user.validID?.documentImage?.public_id) {
        await deleteFromCloudinary(user.validID.documentImage.public_id);
      }
    }

    // Update user information
    user.fullName = profileData.fullName;
    user.phone = profileData.phone;
    user.gender = profileData.gender;
    user.dateOfBirth = new Date(profileData.dateOfBirth);

    // Update address
    user.address = {
      street: profileData.street || user.address?.street || '',
      city: profileData.city || user.address?.city || '',
      state: profileData.state || user.address?.state || '',
      zip: profileData.zip || user.address?.zip || '',
      country: profileData.country || user.address?.country || 'India'
    };

    // Update profile image if uploaded
    if (profileImageData) {
      user.profileImage = {
        secure_url: profileImageData.secure_url,
        public_id: profileImageData.public_id
      };
    }

    // Update valid ID info
    user.validID = {
      type: profileData.idType,
      number: profileData.idNumber,
      documentImage: idDocumentData ? {
        secure_url: idDocumentData.secure_url,
        public_id: idDocumentData.public_id
      } : user.validID?.documentImage
    };

    // Only set as verified if ID document exists
    if (user.validID.documentImage && user.validID.documentImage.secure_url) {
      user.isVerified = true;
    }

    await user.save();

    res.status(200).json({
      message: 'Profile verified successfully',
      user: user.toPublicProfile()
    });
  } catch (error) {
    console.error('Profile verification error:', error);
    
    // Clean up any temporary files
    if (req.files) {
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      });
    }

    res.status(500).json({
      message: 'Error verifying profile',
      error: error.message
    });
  }
};

// Upload Profile Picture (separate endpoint)
exports.uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        message: 'No image file provided'
      });
    }
    
    // Upload file to Cloudinary
    const profileImageData = await uploadToCloudinary(req.file.path, 'profile_images');
    
    // Delete file from local storage after upload
    fs.unlinkSync(req.file.path);
    
    // Update user profile
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    
    // Delete previous profile image if exists
    if (user.profileImage && user.profileImage.public_id) {
      await deleteFromCloudinary(user.profileImage.public_id);
    }
    
    // Update profile image
    user.profileImage = profileImageData;
    
    // Save updated user
    await user.save();
    
    res.status(200).json({
      message: 'Profile picture uploaded successfully',
      user: user.toPublicProfile()
    });
  } catch (error) {
    // Check if file exists and delete it in case of error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      message: 'Error uploading profile picture',
      error: error.message
    });
  }
};

// Forget Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Validate email input
  if (!email) {
    return res.status(400).json({ 
      message: 'Email is required' 
    });
  }

  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Return 200 even if user not found to prevent email enumeration
      return res.status(200).json({ 
        message: 'If an account exists with this email, a reset link has been sent' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token and set expiration
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Create reset URL
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Configure email transporter
    const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false // Add this line to bypass certificate validation
  }
});

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER || 'doaxhunter@gmail.com',
      to: user.email,
      subject: 'Password Reset Token',
      html: `
        <p>You requested a password reset</p>
        <p>Click this link to reset your password (valid for 10 minutes):</p>
        <a href="${resetURL}">${resetURL}</a>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      message: 'If an account exists with this email, a reset link has been sent' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      message: 'Error processing your request', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Validate password input
    if (!password || password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Token is invalid or has expired' 
      });
    }

    // Update password
    user.password = password; // Will be hashed by pre-save hook
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({ 
      message: 'Password has been reset successfully' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      message: 'Error resetting password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fetch User Data
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching user profile', 
      error: error.message 
    });
  }
};

// Update User Data with Profile Picture
exports.updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const updateData = req.body;

  try {
    // Prevent updating certain fields
    delete updateData.email;
    delete updateData.password;
    delete updateData.role;
    delete updateData.isVerified;
    
    let profileImageData = null;
    
    // Upload profile picture if exists
    if (req.file) {
      // Upload file to Cloudinary
      profileImageData = await uploadToCloudinary(req.file.path, 'profile_images');
      
      // Delete file from local storage after upload
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
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    // Check if file exists and delete it in case of error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      message: 'Error updating profile', 
      error: error.message 
    });
  }
};


exports.getProfileImageByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email }).select('profileImage');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      profileImage: user.profileImage
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};