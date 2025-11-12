import { createAsyncThunk } from '@reduxjs/toolkit';
import { talentAPI } from '../services/api';

// Fetch all talents
export const fetchTalents = createAsyncThunk(
  'talents/fetchTalents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await talentAPI.getTalents();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch talents'
      );
    }
  }
);

// Add new talent
export const addTalent = createAsyncThunk(
  'talents/addTalent',
  async (talentData, { rejectWithValue }) => {
    try {
      const response = await talentAPI.addTalent(talentData);
      return response.data.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.errors?.[0] ||
        error.response?.data?.message ||
        'Failed to add talent';
      return rejectWithValue(errorMessage);
    }
  }
);

// Filter talents by skill
export const filterTalentsBySkill = createAsyncThunk(
  'talents/filterTalentsBySkill',
  async (skill, { rejectWithValue }) => {
    try {
      const response = await talentAPI.getTalents(skill);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to filter talents'
      );
    }
  }
);