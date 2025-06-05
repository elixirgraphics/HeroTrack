import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createMatch } from '../utils/database';
import { getUserSettings } from '../utils/database';

function MatchForm({ user, tournament, round, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    round: round,
    opponentName: '',
    result: '',
    pointsScored: '',
    opponentPoints: '',
    mapName: '',
    notes: ''
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
    
    if (!formData.result) {
      setError('Match result is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const match = {
        ...formData,
        tournamentId: tournament.id,
        userId: user.id,
        pointsScored: parseInt(formData.pointsScored) || 0,
        opponentPoints: parseInt(formData.opponentPoints) || 0,
        date: new Date().toISOString()
      };
      
      await createMatch(match);
      onSuccess();
    } catch (err) {
      console.error('Error creating match:', err);
      setError('Failed to save match. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const shouldShowField = (fieldName) => {
    if (!settings) return true;
    switch (fieldName) {
      case 'opponentName':
        return settings.showOpponentName;
      case 'mapName':
        return settings.showMapName;
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
            <h3 className="text-lg font-medium text-gray-900">
              Add Match - Round {round}
            </h3>
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
            {/* Result - Required */}
            <div>
              <label htmlFor="result" className="block text-sm font-medium text-gray-700 mb-1">
                Result *
              </label>
              <select
                id="result"
                name="result"
                value={formData.result}
                onChange={handleChange}
                className="input-field mobile-touch"
                required
              >
                <option value="">Select result</option>
                <option value="win">Win</option>
                <option value="loss">Loss</option>
                <option value="draw">Draw</option>
              </select>
            </div>

            {/* Points */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="pointsScored" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Points
                </label>
                <input
                  type="number"
                  id="pointsScored"
                  name="pointsScored"
                  value={formData.pointsScored}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className="input-field mobile-touch"
                />
              </div>
              
              <div>
                <label htmlFor="opponentPoints" className="block text-sm font-medium text-gray-700 mb-1">
                  Opponent Points
                </label>
                <input
                  type="number"
                  id="opponentPoints"
                  name="opponentPoints"
                  value={formData.opponentPoints}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className="input-field mobile-touch"
                />
              </div>
            </div>

            {/* Opponent Name - Optional based on settings */}
            {shouldShowField('opponentName') && (
              <div>
                <label htmlFor="opponentName" className="block text-sm font-medium text-gray-700 mb-1">
                  Opponent Name
                </label>
                <input
                  type="text"
                  id="opponentName"
                  name="opponentName"
                  value={formData.opponentName}
                  onChange={handleChange}
                  placeholder="Enter opponent's name"
                  className="input-field mobile-touch"
                />
              </div>
            )}

            {/* Map Name - Optional based on settings */}
            {shouldShowField('mapName') && (
              <div>
                <label htmlFor="mapName" className="block text-sm font-medium text-gray-700 mb-1">
                  Map Name
                </label>
                <input
                  type="text"
                  id="mapName"
                  name="mapName"
                  value={formData.mapName}
                  onChange={handleChange}
                  placeholder="Enter map name"
                  className="input-field mobile-touch"
                />
              </div>
            )}

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional notes about this match..."
                rows={3}
                className="input-field resize-none"
              />
            </div>

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
                    Saving...
                  </div>
                ) : (
                  'Save Match'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MatchForm;
