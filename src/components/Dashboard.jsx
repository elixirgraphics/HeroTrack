import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Trophy, Target, TrendingUp } from 'lucide-react';
import { getTournaments, getAllMatches } from '../utils/database';
import { calculateOverallStats, formatDate, formatPercentage } from '../utils/calculations';
import TournamentForm from './TournamentForm';
import TournamentHistory from './TournamentHistory';

function Dashboard({ user }) {
  const [tournaments, setTournaments] = useState([]);
  const [overallStats, setOverallStats] = useState(null);
  const [showTournamentForm, setShowTournamentForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tournamentsData, allMatches] = await Promise.all([
        getTournaments(user.id),
        getAllMatches(user.id)
      ]);
      
      setTournaments(tournamentsData);
      setOverallStats(calculateOverallStats(allMatches));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTournamentCreated = () => {
    setShowTournamentForm(false);
    loadData();
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Track your Heroclix tournament performance</p>
        </div>
        <button
          onClick={() => setShowTournamentForm(true)}
          className="btn-primary mt-4 sm:mt-0 mobile-touch flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Tournament</span>
        </button>
      </div>

      {/* Overall Stats */}
      {overallStats && overallStats.gamesPlayed > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Trophy className="w-8 h-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Win Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPercentage(overallStats.winPercentage)}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Points</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(overallStats.averagePoints)}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tournaments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {overallStats.tournamentsPlayed}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Games Played</p>
                <p className="text-2xl font-bold text-gray-900">
                  {overallStats.gamesPlayed}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/stats" className="card hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <TrendingUp className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">View Statistics</h3>
              <p className="text-gray-600">Analyze your performance trends</p>
            </div>
          </div>
        </Link>

        <button
          onClick={() => setShowTournamentForm(true)}
          className="card hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Plus className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Start Tournament</h3>
              <p className="text-gray-600">Create a new tournament to track</p>
            </div>
          </div>
        </button>
      </div>

      {/* Tournament History */}
      <TournamentHistory tournaments={tournaments} onUpdate={loadData} />

      {/* Tournament Form Modal */}
      {showTournamentForm && (
        <TournamentForm
          user={user}
          onClose={() => setShowTournamentForm(false)}
          onSuccess={handleTournamentCreated}
        />
      )}
    </div>
  );
}

export default Dashboard;
