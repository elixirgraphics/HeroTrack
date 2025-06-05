import React, { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, User, Camera, MapPin } from 'lucide-react';
import { getUserSettings, updateUserSettings } from '../utils/database';
import Avatar from './Avatar';

function Settings({ user }) {
  const [settings, setSettings] = useState({
    showOpponentName: true,
    showMapName: true,
    showTeamScreenshot: true,
    defaultRounds: 3
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const userSettings = await getUserSettings(user.id);
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage('');
      
      await updateUserSettings(user.id, settings);
      setMessage('Settings saved successfully!');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (field) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleRoundsChange = (e) => {
    setSettings(prev => ({
      ...prev,
      defaultRounds: parseInt(e.target.value)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Customize your HeroTrack experience</p>
      </div>

      {/* User Profile */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Profile</h2>
        
        <div className="flex items-center space-x-4">
          <Avatar
            src={user?.picture}
            alt={user?.name}
            size="lg"
          />
          <div>
            <h3 className="text-lg font-medium text-gray-900">{user?.name}</h3>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Field Visibility Settings */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Field Visibility</h2>
        <p className="text-sm text-gray-600 mb-6">
          Choose which optional fields to show when adding matches
        </p>
        
        <div className="space-y-4">
          {/* Opponent Name */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Opponent Name</p>
                <p className="text-xs text-gray-500">Track who you played against</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('showOpponentName')}
              className={`relative inline-flex h-8 w-14 items-center rounded-lg transition-colors mobile-touch ${
                settings.showOpponentName ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-md bg-white transition-transform shadow-sm ${
                  settings.showOpponentName ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Map Name */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Map Name</p>
                <p className="text-xs text-gray-500">Record which map was played</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('showMapName')}
              className={`relative inline-flex h-8 w-14 items-center rounded-lg transition-colors mobile-touch ${
                settings.showMapName ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-md bg-white transition-transform shadow-sm ${
                  settings.showMapName ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Team Screenshot */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Camera className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Tournament Screenshot</p>
                <p className="text-xs text-gray-500">Upload photos when creating tournaments</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('showTeamScreenshot')}
              className={`relative inline-flex h-8 w-14 items-center rounded-lg transition-colors mobile-touch ${
                settings.showTeamScreenshot ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-md bg-white transition-transform shadow-sm ${
                  settings.showTeamScreenshot ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Tournament Defaults */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Tournament Defaults</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="defaultRounds" className="block text-sm font-medium text-gray-700 mb-1">
              Default Number of Rounds
            </label>
            <select
              id="defaultRounds"
              value={settings.defaultRounds}
              onChange={handleRoundsChange}
              className="input-field w-full sm:w-auto"
            >
              <option value={3}>3 Rounds</option>
              <option value={4}>4 Rounds</option>
              <option value={5}>5 Rounds</option>
              <option value={6}>6 Rounds</option>
              <option value={7}>7 Rounds</option>
              <option value={8}>8 Rounds</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              This will be pre-selected when creating new tournaments
            </p>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Data Management</h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-900">Local Storage</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Your data is stored locally on this device for offline access. 
                  Make sure to back up important tournament data.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>Future features will include:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Export tournament data to PDF/CSV</li>
              <li>Cloud backup and sync</li>
              <li>Data import from other sources</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-3">
        {message && (
          <div className={`px-4 py-2 rounded-lg text-sm ${
            message.includes('success') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}
        
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary mobile-touch flex items-center space-x-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Settings;
