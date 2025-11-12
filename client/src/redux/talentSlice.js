import { createSlice } from '@reduxjs/toolkit';
import { fetchTalents, addTalent, filterTalentsBySkill } from './talentThunks';

const initialState = {
  talents: [],
  filteredTalents: [],
  loading: false,
  error: null,
  currentFilter: '',
};

const talentSlice = createSlice({
  name: 'talents',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilter: (state, action) => {
      state.currentFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch talents
      .addCase(fetchTalents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTalents.fulfilled, (state, action) => {
        state.loading = false;
        state.talents = action.payload;
        state.filteredTalents = action.payload;
        state.error = null;
      })
      .addCase(fetchTalents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add talent
      .addCase(addTalent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTalent.fulfilled, (state, action) => {
        state.loading = false;
        state.talents = [action.payload, ...state.talents];
        state.filteredTalents = [action.payload, ...state.filteredTalents];
        state.error = null;
      })
      .addCase(addTalent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Filter talents by skill
      .addCase(filterTalentsBySkill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterTalentsBySkill.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredTalents = action.payload;
        state.error = null;
      })
      .addCase(filterTalentsBySkill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setFilter } = talentSlice.actions;
export default talentSlice.reducer;