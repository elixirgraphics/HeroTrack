import React, { useState, useEffect } from 'react';
import { X, Camera } from 'lucide-react';
import { createTournament, getUserSettings } from '../utils/database';

function TournamentForm({ user, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    rounds: 3,
    teamScreenshot: null
  });
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    try {
      const userSettings = await getUserSettings(user.id);
      setSettings(userSettings);
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Tournament name is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const tournament = {
        ...formData,
        userId: user.id,
        status: 'active'
      };
      
      await createTournament(tournament);
      onSuccess();
    } catch (err) {
      console.error('Error creating tournament:', err);
      setError('Failed to create tournament. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rounds' ? parseInt(value) : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, we'll store the file name. In a full implementation,
      // you'd want to convert to base64 or upload to a service
      setFormData(prev => ({
        ...prev,
        teamScreenshot: file.name
      }));
    }
  };

  const shouldShowField = (fieldName) => {
    if (!settings) return true;
    switch (fieldName) {
      case 'teamScreenshot':
        return settings.showTeamScreenshot;
      default:
        return true;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Create New Tournament</h3>
            <button
              onClick={onClose}
              className="rounded-md p-2 text-gray-400 hover:text-gray-500 mobile-touch"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Tournament Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Local Store Championship"
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="rounds" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Rounds
              </label>
              <select
                id="rounds"
                name="rounds"
                value={formData.rounds}
                onChange={handleChange}
                className="input-field"
              >
                <option value={3}>3 Rounds</option>
                <option value={4}>4 Rounds</option>
                <option value={5}>5 Rounds</option>
                <option value={6}>6 Rounds</option>
                <option value={7}>7 Rounds</option>
                <option value={8}>8 Rounds</option>
              </select>
            </div>

            {/* Team Screenshot - Optional based on settings */}
            {shouldShowField('teamScreenshot') && (
              <div>
                <label htmlFor="teamScreenshot" className="block text-sm font-medium text-gray-700 mb-1">
                  Team Screenshot
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <Camera className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="teamScreenshot"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload a photo</span>
                        <input
                          id="teamScreenshot"
                          name="teamScreenshot"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                    {formData.teamScreenshot && (
                      <p className="text-sm text-green-600 mt-2">
                        Selected: {formData.teamScreenshot}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1 mobile-touch"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1 mobile-touch"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  'Create Tournament'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TournamentForm;
