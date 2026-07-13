const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET /api/profile/me
// @desc    Get current user's profile (Protected)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-otp -otpExpires');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving current profile' });
  }
});

// @route   POST/PUT /api/profile/save
// @desc    Save/update profile data and qrTheme (Protected)
router.post('/save', auth, async (req, res) => {
  const { profileData, qrTheme } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (profileData) {
      user.profileData = {
        name: profileData.name || '',
        bio: profileData.bio || '',
        jobTitle: profileData.jobTitle || '',
        phone: profileData.phone || '',
        website: profileData.website || '',
        linkedin: profileData.linkedin || '',
        github: profileData.github || '',
        address: profileData.address || ''
      };
    }

    if (qrTheme) {
      user.qrTheme = {
        fgColor: qrTheme.fgColor || '#ffffff',
        bgColor: qrTheme.bgColor || '#000000',
        logoUrl: qrTheme.logoUrl || ''
      };
    }

    await user.save();
    res.json({
      message: 'Profile saved successfully',
      user: {
        _id: user._id,
        email: user.email,
        profileData: user.profileData,
        qrTheme: user.qrTheme,
        scanCount: user.scanCount
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error saving profile' });
  }
});

// @route   GET /api/profile/:id
// @desc    Get user profile by ID (Public) & increment scanCount
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $inc: { scanCount: 1 } },
      { new: true }
    ).select('-otp -otpExpires');

    if (!user) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

module.exports = router;
