import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTalents } from '../redux/talentThunks';

// Utility function to check if a talent object has valid, non-empty values 
// for key required fields before rendering.
const isValidTalent = (talent) => {
    // Check basic presence of critical fields
    if (!talent || !talent._id) return false;
    
    // Check if name is present and not empty
    if (!talent.name || talent.name.trim() === '') return false;
    
    // Check if email is present and not empty
    if (!talent.email || talent.email.trim() === '') return false;
    
    // Check if skills is a non-empty array of non-empty strings
    if (!talent.skills || !Array.isArray(talent.skills) || talent.skills.length === 0) return false;
    if (talent.skills.some(skill => typeof skill !== 'string' || skill.trim() === '')) return false;

    // Check if experience is present, defined, and a valid number
    if (talent.experience === null || talent.experience === undefined || isNaN(talent.experience)) return false;
    
    return true;
};

const TalentList = () => {
  const dispatch = useDispatch();
  const { filteredTalents, loading, error } = useSelector((state) => state.talents);

  useEffect(() => {
    dispatch(fetchTalents());
  }, [dispatch]);

  // Separate the talents into renderable (valid) and invalid groups
  const renderableTalents = filteredTalents.filter(isValidTalent);

  if (loading && filteredTalents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading talents...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 bg-red-50 text-red-800 border border-red-200 rounded">
        Error: {error}
      </div>
    );
  }

  if (renderableTalents.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No talents found. Add your first talent to get started.</p>
        {/* Warning if there are records but they all failed validation */}
        {filteredTalents.length > 0 && (
            <p className="text-xs mt-2 text-red-400">
                Note: {filteredTalents.length - renderableTalents.length} item(s) are hidden due to incomplete data retrieved from the server.
            </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-5.5">
        <h2 className="text-lg font-medium text-gray-900">
          Team Members
        </h2>
        <span className="text-sm text-gray-500">
          {renderableTalents.length} {renderableTalents.length === 1 ? 'person' : 'people'}
        </span>
      </div>
      
      <div className="space-y-4">
        {filteredTalents.map((talent) => {
            // Check validity for rendering
            if (!isValidTalent(talent)) {
                return (
                    // Display an explicit warning card for invalid data
                    <div
                        key={talent._id || Math.random()} 
                        className="border border-yellow-300 rounded p-4 bg-yellow-50 text-yellow-800 text-sm shadow-sm"
                    >
                        ⚠️ **Incomplete Data:** This record is corrupted and cannot be fully displayed (Missing Name, Email, or Skills).
                    </div>
                );
            }
            
            // Render the valid talent card
            return (
              <div
                key={talent._id}
                className="border border-gray-200 rounded p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-base font-medium text-gray-900">
                    {talent.name}
                  </h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {talent.experience}y experience
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{talent.email}</p>
                
                <div className="flex flex-wrap gap-2">
                  {talent.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
                  Added on {new Date(talent.createdAt).toLocaleDateString('en-GB')}
                </p>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default TalentList;