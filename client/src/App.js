import React from 'react';
import TalentForm from './components/TalentForm';
import TalentList from './components/TalentList';
import SkillFilter from './components/SkillFilter';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Talent Directory
          </h1>
          <p className="text-gray-600">
            Manage and discover talented professionals
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="space-y-6">
            <TalentForm />
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <SkillFilter />
            <div className="bg-white border border-gray-200 rounded p-6">
              <TalentList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;