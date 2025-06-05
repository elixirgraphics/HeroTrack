import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Calendar, Trophy, Target } from 'lucide-react';
import { getMatchesByTournament } from '../utils/database';
import { calculateTournamentStats, formatDate, formatPercentage } from '../utils/calculations';

function TournamentHistory({ tournaments, onUpdate }) {
  const [expandedTournaments, setExpandedTournaments] = useState(new Set());
  const [tournamentMatches, setTournamentMatches] = useState({});

  const toggleTournament = async (tournamentId) => {
    const newExpanded = new Set(expandedTournaments);
    
    if (newExpanded.has(tournamentId)) {
      newExpanded.delete(tournamentId);
    } else {
      newExpanded.add(tournamentId);
      
      // Load matches if not already loaded
      if (!tournamentMatches[tournamentId]) {
        try {
          const matches = await getMatchesByTournament(tournamentId);
          setTournamentMatches(prev => ({
            ...prev,
            [tournamentId]: matches
          }));
        } catch (error) {
          console.error('Error loading tournament matches:', error);
        }
      }
    }
    
    setExpandedTournaments(newExpanded);
  };

  if (!tournaments || tournaments.length === 0) {
    return (
      <div className="card text-center py-12">
        <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tournaments yet</h3>
        <p className="text-gray-600 mb-4">Create your first tournament to start tracking your performance</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Tournament History</h2>
      
      <div className="space-y-3">
        {tournaments.map((tournament) => {
          const isExpanded = expandedTournaments.has(tournament.id);
          const matches = tournamentMatches[tournament.id] || [];
          const stats = calculateTournamentStats(matches);
          
          return (
            <div key={tournament.id} className="card">
              <div
                className="flex items-center justify-between cursor-pointer mobile-touch"
                onClick={() => toggleTournament(tournament.id)}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {tournament.name}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tournament.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {tournament.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(tournament.date)}</span>
                      </div>
                      
                      {matches.length > 0 && (
                        <>
                          <div className="flex items-center space-x-1">
                            <Trophy className="w-4 h-4" />
                            <span>{stats.wins}W-{stats.losses}L-{stats.draws}D</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Target className="w-4 h-4" />
                            <span>{stats.totalPoints} pts</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <Link
                  to={`/tournament/${tournament.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="btn-secondary text-sm py-2 px-4 ml-4"
                >
                  View
                </Link>
              </div>
              
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {matches.length === 0 ? (
                    <p className="text-gray-600 text-center py-4">No matches recorded yet</p>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-green-600">{stats.wins}</p>
                          <p className="text-sm text-gray-600">Wins</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-red-600">{stats.losses}</p>
                          <p className="text-sm text-gray-600">Losses</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-yellow-600">{stats.draws}</p>
                          <p className="text-sm text-gray-600">Draws</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-primary-600">
                            {formatPercentage(stats.winPercentage)}
                          </p>
                          <p className="text-sm text-gray-600">Win Rate</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Matches</h4>
                        {matches.map((match) => (
                          <div key={match.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-gray-900">
                                Round {match.round}
                              </span>
                              {match.opponentName && (
                                <span className="text-sm text-gray-600">
                                  vs {match.opponentName}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                match.result === 'win' 
                                  ? 'bg-green-100 text-green-800'
                                  : match.result === 'loss'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {match.result.toUpperCase()}
                              </span>
                              
                              <span className="text-sm text-gray-600">
                                {match.pointsScored || 0} pts
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TournamentHistory;
