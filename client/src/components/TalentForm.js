import React, { useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTalent } from '../redux/talentThunks';
import { clearError } from '../redux/talentSlice';

// Helper function for email validation
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const TalentForm = () => {
  const dispatch = useDispatch();
  const { loading, error: serverError } = useSelector((state) => state.talents);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    experience: '',
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // --- VALIDATION LOGIC ---
  const validateForm = (data) => {
    const errors = {};
    const { name, email, skills, experience } = data;
    const experienceValue = experience ? parseInt(experience, 10) : NaN;

    // 1. Name Validation: Required, minimum length, no numbers/special chars
    if (!name.trim()) {
      errors.name = 'Name is required.';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long.';
    } else if (/\d/.test(name)) { // Check for numbers
        errors.name = 'Name cannot contain numbers.';
    }

    // 2. Email Validation: Required, valid format
    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!validateEmail(email)) {
      errors.email = 'Please provide a valid email address.';
    }

    // 3. Skills Validation: Required, comma-separated, minimum 1 skill
    const skillsArray = skills
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    if (skillsArray.length === 0) {
      errors.skills = 'At least one skill is required.';
    }

    // 4. Experience Validation: Required, integer, range 0-50
    if (experience === '') {
      errors.experience = 'Experience is required.';
    } else if (isNaN(experienceValue) || !Number.isInteger(experienceValue)) {
      errors.experience = 'Experience must be a whole number.';
    } else if (experienceValue < 0 || experienceValue > 50) {
      errors.experience = 'Experience must be between 0 and 50 years.';
    }
    
    return errors;
  };

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear the server error, success message, and the specific field validation error when typing
    setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) dispatch(clearError());
    if (successMessage) setSuccessMessage('');
  };

  const handleBlur = (e) => {
      // Validate the specific field when the user leaves it
      const { name } = e.target;
      const errors = validateForm(formData);
      
      if (errors[name]) {
          setValidationErrors((prev) => ({ ...prev, [name]: errors[name] }));
      } else {
          setValidationErrors((prev) => ({ ...prev, [name]: '' }));
      }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run full validation before submission
    const errors = validateForm(formData);
    setValidationErrors(errors); // Show all errors immediately

    // Stop submission if validation errors exist
    if (Object.keys(errors).length > 0) {
        return;
    }

    const skillsArray = formData.skills
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill !== '');

    const talentData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      skills: skillsArray,
      experience: parseInt(formData.experience, 10),
    };

    try {
      await dispatch(addTalent(talentData)).unwrap();
      setSuccessMessage('Talent added successfully!');
      setFormData({ name: '', email: '', skills: '', experience: '' });
      setValidationErrors({}); // Clear client errors on success
    } catch (err) {
      console.error('Failed to add talent:', err);
    }
  };

  // --- DYNAMIC BUTTON LOGIC ---
  // Check if all fields meet the basic requirements to enable the button
  const formStateErrors = validateForm(formData);
  const isFormValid = Object.keys(formStateErrors).length === 0;

  const isDisabled = loading || !isFormValid;
  
  // --- UTILITY RENDERERS ---
  const renderFieldError = (fieldName) => {
    return validationErrors[fieldName] ? (
      <p className="text-red-600 text-xs mt-1">{validationErrors[fieldName]}</p>
    ) : null;
  };
  
  const getInputBorderClass = (fieldName) => {
      return validationErrors[fieldName]
        ? 'border-red-500 focus:border-red-500' // Red border on error
        : 'border-gray-300 focus:border-gray-400'; // Default border
  };


  return (
    <div className="bg-white border border-gray-200 rounded p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Add New Talent
      </h2>
      
      {/* Server Error Display */}
      {serverError && (
        <div className="mb-4 rounded bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
          {serverError}
        </div>
      )}
      {/* Success Message Display */}
      {successMessage && (
        <div className="mb-4 rounded bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter full name"
            className={`w-full rounded border px-3 py-2 text-sm focus:outline-none ${getInputBorderClass('name')}`}
          />
          {renderFieldError('name')}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter email address"
            className={`w-full rounded border px-3 py-2 text-sm focus:outline-none ${getInputBorderClass('email')}`}
          />
          {renderFieldError('email')}
        </div>

        <div>
          <label
            htmlFor="skills"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Skills <span className="text-gray-500 font-normal">(comma-separated)</span>
          </label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="React, Node.js, MongoDB"
            className={`w-full rounded border px-3 py-2 text-sm focus:outline-none ${getInputBorderClass('skills')}`}
          />
          {renderFieldError('skills')}
        </div>

        <div>
          <label
            htmlFor="experience"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Years of Experience
          </label>
          <input
            type="number"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            onBlur={handleBlur}
            min="0"
            max="50"
            placeholder="Enter years of experience"
            className={`w-full rounded border px-3 py-2 text-sm focus:outline-none ${getInputBorderClass('experience')}`}
          />
          {renderFieldError('experience')}
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className={`w-full py-2 px-4 text-white rounded text-sm font-medium transition duration-150 ease-in-out ${
            isDisabled
              ? 'bg-gray-400 cursor-not-allowed' // Disabled style
              : 'bg-gray-900 hover:bg-gray-800' // Enabled style
          }`}
        >
          {loading ? 'Adding...' : 'Add Talent'}
        </button>
      </form>
    </div>
  );
};

export default TalentForm;