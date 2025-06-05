import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trophy, Target, Calendar } from 'lucide-react';
import { getTournament, getMatchesByTournament, updateTournament } from '../utils/database';
import { calculateTournamentStats, formatDate, formatPercentage } from '../utils/calculations';
import MatchForm from './MatchForm';

function TournamentView({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState(null);
  const [showMatchForm, setShowMatchForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTournamentData();
  }, [id]);

  const loadTournamentData = async () => {
    try {
      setLoading(true);
      const [tournamentData, matchesData] = await Promise.all([
        getTournament(parseInt(id)),
        getMatchesByTournament(parseInt(id))
      ]);
      
      if (!tournamentData) {
        setError('Tournament not found');
        return;
      }
      
      setTournament(tournamentData);
      setMatches(matchesData);
      setStats(calculateTournamentStats(matchesData));
    } catch (err) {
      console.error('Error loading tournament:', err);
      setError('Failed to load tournament data');
    } finally {
      setLoading(false);
    }
  };

  const handleMatchAdded = () => {
    setShowMatchForm(false);
    loadTournamentData();
  };

  const getNextRound = () => {
    if (matches.length === 0) return 1;
    return Math.max(...matches.map(m => m.round)) + 1;
  };

  const canAddMatch = () => {
    return matches.length < tournament?.rounds;
  };

  const handleFinishTournament = async () => {
    try {
      await updateTournament(tournament.id, { status: 'completed' });
      setTournament(prev => ({ ...prev, status: 'completed' }));
    } catch (err) {
      console.error('Error finishing tournament:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/')}
          className="rounded-md p-2 text-gray-400 hover:text-gray-500 mobile-touch"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">{tournament?.name}</h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              tournament?.status === 'active' 
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {tournament?.status}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(tournament?.date)}</span>
            </div>
            <span>{tournament?.rounds} rounds</span>
          </div>
        </div>
        
        {canAddMatch() && tournament?.status === 'active' && (
          <button
            onClick={() => setShowMatchForm(true)}
            className="btn-primary mobile-touch flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Match</span>
          </button>
        )}
      </div>

      {/* Tournament Stats */}
      {stats && matches.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card text-center">
            <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.wins}</p>
            <p className="text-sm text-gray-600">Wins</p>
          </div>

          <div className="card text-center">
            <Target className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.losses}</p>
            <p className="text-sm text-gray-600">Losses</p>
          </div>

          <div className="card text-center">
            <div className="w-8 h-8 bg-yellow-600 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.draws}</p>
            <p className="text-sm text-gray-600">Draws</p>
          </div>

          <div className="card text-center">
            <div className="w-8 h-8 bg-primary-600 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white font-bold text-sm">%</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatPercentage(stats.winPercentage)}</p>
            <p className="text-sm text-gray-600">Win Rate</p>
          </div>
        </div>
      )}

      {/* Matches List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Matches</h2>
          {tournament?.status === 'active' && matches.length >= tournament?.rounds && (
            <button
              onClick={handleFinishTournament}
              className="btn-secondary text-sm"
            >
              Finish Tournament
            </button>
          )}
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No matches yet</h3>
            <p className="text-gray-600 mb-4">Add your first match to start tracking this tournament</p>
            {canAddMatch() && tournament?.status === 'active' && (
              <button
                onClick={() => setShowMatchForm(true)}
                className="btn-primary"
              >
                Add First Match
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((match) => (
              <div key={match.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                      {match.round}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        match.result === 'win'
                          ? 'bg-green-100 text-green-800'
                          : match.result === 'loss'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {match.result.toUpperCase()}
                      </span>

                      <span className="text-sm font-medium text-gray-900">
                        {match.pointsScored || 0} - {match.opponentPoints || 0}
                      </span>
                    </div>

                    {match.opponentName && (
                      <p className="text-sm text-gray-600 mt-1">vs {match.opponentName}</p>
                    )}

                    {match.mapName && (
                      <p className="text-xs text-gray-500 mt-1">Map: {match.mapName}</p>
                    )}
                  </div>
                </div>

                {match.notes && (
                  <div className="text-sm text-gray-600 max-w-xs truncate">
                    {match.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Match Form Modal */}
      {showMatchForm && (
        <MatchForm
          user={user}
          tournament={tournament}
          round={getNextRound()}
          onClose={() => setShowMatchForm(false)}
          onSuccess={handleMatchAdded}
        />
      )}
    </div>
  );
}

export default TournamentView;
