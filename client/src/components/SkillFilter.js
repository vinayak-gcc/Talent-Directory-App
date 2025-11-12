import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterTalentsBySkill, fetchTalents } from '../redux/talentThunks';
import { setFilter } from '../redux/talentSlice';

const SkillFilter = () => {
  const dispatch = useDispatch();
  // We need to access the overall state to track loading
  const { currentFilter, loading } = useSelector((state) => state.talents);
  
  // Use local state for the input value
  const [inputValue, setInputValue] = useState(currentFilter);
  // State to track if the current input value is valid for filtering
  const [isInputValid, setIsInputValid] = useState(false);
  
  // Sync local input state with Redux filter state if necessary (e.g., initial load)
  useEffect(() => {
    setInputValue(currentFilter);
  }, [currentFilter]);

  // Logic to determine if input is ready and valid (no special chars, not empty)
  const validateInput = (value) => {
    const trimmed = value.trim();
    // Check if empty OR if it contains any character that is NOT a letter, space, hyphen, or apostrophe
    const isValid = trimmed.length > 0 && !/[^a-zA-Z\s'-]/.test(trimmed);
    return isValid;
  };
  
  // Effect to update validation status whenever inputValue changes
  useEffect(() => {
      setIsInputValid(validateInput(inputValue));
  }, [inputValue]);


  const handleFilterChange = (e) => {
    const value = e.target.value;
    
    // Input Sanitization: Only allow letters, spaces, hyphens, and apostrophes
    if (value.length > 0 && /[^a-zA-Z\s'-]/.test(value)) {
        // If a non-allowed character is introduced, reject the update
        return; 
    }

    setInputValue(value);
  };

  const handleFilter = (e) => {
    e.preventDefault();
    const skill = inputValue.trim();
    
    // Check validity just before dispatching
    if (!validateInput(skill)) {
        // Button should be disabled, but this is a final guard.
        dispatch(setFilter(''));
        dispatch(fetchTalents()); // Fetch all if invalid filter attempt
        return;
    }
    
    // Update Redux state with the new filter string
    dispatch(setFilter(skill));
    
    // Trigger the fetch/filter thunk
    dispatch(filterTalentsBySkill(skill));
  };

  const handleClear = () => {
    setInputValue('');
    dispatch(setFilter(''));
    // Fetch all talents (no filter)
    dispatch(fetchTalents());
  };

  // Button disabled when loading OR when the input is not ready/valid
  const isFilterButtonDisabled = loading || !isInputValid;
  const isClearButtonVisible = currentFilter.length > 0; // Show clear button if a filter is active
  
  return (
    <div className="bg-white border border-gray-200 rounded p-4 shadow-md">
      <h3 className="text-base font-medium text-gray-900 mb-3">Filter by Skill</h3>
      
      <form onSubmit={handleFilter} className="flex gap-2 items-start">
        <input
          type="text"
          value={inputValue}
          onChange={handleFilterChange}
          placeholder="e.g., React, Node.js"
          className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
        />
        <button
          type="submit"
          disabled={isFilterButtonDisabled}
          className={`px-4 py-2 text-white rounded text-sm font-medium transition-colors 
            ${isFilterButtonDisabled
                ? 'bg-gray-400 cursor-not-allowed text-gray-700' // Disabled style
                : 'bg-gray-900 hover:bg-gray-800' // Enabled style
            }`}
        >
          {loading ? 'Filtering...' : 'Filter'}
        </button>
      </form>
      
      {/* Validation Warning for invalid input characters */}
      {inputValue.length > 0 && !isInputValid && (
          <p className="text-red-600 text-xs mt-2">
            Only letters, spaces, hyphens, and apostrophes are allowed in the filter.
          </p>
      )}

      {/* Display Current Filter and Clear Button */}
      {isClearButtonVisible && (
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Filtering by: <span className="font-medium text-gray-900">{currentFilter}</span>
          </p>
          <button
            onClick={handleClear}
            className="px-3 py-1 text-sm font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Clear Filter
          </button>
        </div>
      )}
    </div>
  );
};

export default SkillFilter;