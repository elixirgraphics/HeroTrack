import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Trophy, Target, Calendar, Percent } from 'lucide-react';
import { getAllMatches, getTournaments } from '../utils/database';
import { 
  calculateOverallStats, 
  getWinPercentageTrend, 
  getPointsTrend,
  formatPercentage,
  formatPoints 
} from '../utils/calculations';

function StatsView({ user }) {
  const [allMatches, setAllMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [overallStats, setOverallStats] = useState(null);
  const [winTrend, setWinTrend] = useState([]);
  const [pointsTrend, setPointsTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatsData();
  }, [user]);

  const loadStatsData = async () => {
    try {
      setLoading(true);
      const [matchesData, tournamentsData] = await Promise.all([
        getAllMatches(user.id),
        getTournaments(user.id)
      ]);
      
      setAllMatches(matchesData);
      setTournaments(tournamentsData);
      setOverallStats(calculateOverallStats(matchesData));
      setWinTrend(getWinPercentageTrend(matchesData));
      setPointsTrend(getPointsTrend(matchesData));
    } catch (error) {
      console.error('Error loading stats data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!overallStats || overallStats.gamesPlayed === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-medium text-gray-900 mb-2">No Statistics Yet</h2>
        <p className="text-gray-600 mb-6">Play some matches to see your performance analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Performance Statistics</h1>
        <p className="text-gray-600">Analyze your Heroclix tournament performance</p>
      </div>

      {/* Overall Stats Grid */}
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
              <p className="text-xs text-gray-500">
                {overallStats.wins}W-{overallStats.losses}L-{overallStats.draws}D
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
                {formatPoints(overallStats.averagePoints)}
              </p>
              <p className="text-xs text-gray-500">
                {overallStats.totalPoints} total
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
              <p className="text-xs text-gray-500">
                {overallStats.gamesPlayed} games
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
              <p className="text-sm font-medium text-gray-600">Avg Opp Points</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPoints(overallStats.totalOpponentPoints / overallStats.gamesPlayed)}
              </p>
              <p className="text-xs text-gray-500">
                {overallStats.totalOpponentPoints} total
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Win Percentage Trend */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <Percent className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-medium text-gray-900">Win Rate by Tournament</h3>
          </div>
          
          {winTrend.length > 0 ? (
            <div className="space-y-3">
              {winTrend.slice(-5).map((trend, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate">
                    Tournament {index + 1}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${trend.winPercentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {formatPercentage(trend.winPercentage)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Not enough data</p>
          )}
        </div>

        {/* Points Trend */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-medium text-gray-900">Points by Tournament</h3>
          </div>
          
          {pointsTrend.length > 0 ? (
            <div className="space-y-3">
              {pointsTrend.slice(-5).map((trend, index) => {
                const maxPoints = Math.max(...pointsTrend.map(t => t.averagePoints));
                const percentage = maxPoints > 0 ? (trend.averagePoints / maxPoints) * 100 : 0;
                
                return (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 truncate">
                      Tournament {index + 1}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">
                        {formatPoints(trend.averagePoints)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Not enough data</p>
          )}
        </div>
      </div>

      {/* Recent Performance */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Matches</h3>
        
        {allMatches.length > 0 ? (
          <div className="space-y-2">
            {allMatches.slice(-10).reverse().map((match, index) => (
              <div key={match.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900">
                    Round {match.round}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    match.result === 'win' 
                      ? 'bg-green-100 text-green-800'
                      : match.result === 'loss'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {match.result.toUpperCase()}
                  </span>
                  {match.opponentName && (
                    <span className="text-sm text-gray-600">vs {match.opponentName}</span>
                  )}
                </div>
                
                <span className="text-sm font-medium text-gray-900">
                  {match.pointsScored || 0} - {match.opponentPoints || 0}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No matches yet</p>
        )}
      </div>
    </div>
  );
}

export default StatsView;
