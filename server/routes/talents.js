const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const Talent = require('../models/Talent');

// Validation middleware
const validateTalent = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('skills')
    .isArray({ min: 1 }).withMessage('At least one skill is required')
    .custom((skills) => {
      if (skills.some(skill => typeof skill !== 'string' || skill.trim() === '')) {
        throw new Error('All skills must be non-empty strings');
      }
      return true;
    }),
  body('experience')
    .notEmpty().withMessage('Experience is required')
    .isInt({ min: 0, max: 50 }).withMessage('Experience must be between 0 and 50 years')
];

// @route   POST /api/talents
// @desc    Add a new talent
// @access  Public
router.post('/', validateTalent, async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg)
      });
    }

    const { name, email, skills, experience } = req.body;

    // Create new talent
    const talent = await Talent.create({
      name,
      email,
      skills: skills.map(skill => skill.trim()),
      experience
    });

    res.status(201).json({
      success: true,
      message: 'Talent added successfully',
      data: talent
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/talents
// @desc    Get all talents or filter by skill
// @access  Public
router.get('/', [
  query('skill').optional().trim()
], async (req, res, next) => {
  try {
    const { skill } = req.query;
    
    let query = {};
    
    // Filter by skill if provided
    if (skill) {
      query.skills = { $regex: new RegExp(skill, 'i') }; // Case-insensitive search
    }

    const talents = await Talent.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: talents.length,
      data: talents
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;