// Utility functions for tournament and match calculations

export function calculateTournamentStats(matches) {
  if (!matches || matches.length === 0) {
    return {
      wins: 0,
      losses: 0,
      draws: 0,
      totalPoints: 0,
      totalOpponentPoints: 0,
      winPercentage: 0,
      averagePoints: 0
    };
  }

  const stats = matches.reduce((acc, match) => {
    switch (match.result) {
      case 'win':
        acc.wins++;
        break;
      case 'loss':
        acc.losses++;
        break;
      case 'draw':
        acc.draws++;
        break;
    }
    acc.totalPoints += match.pointsScored || 0;
    acc.totalOpponentPoints += match.opponentPoints || 0;
    return acc;
  }, {
    wins: 0,
    losses: 0,
    draws: 0,
    totalPoints: 0,
    totalOpponentPoints: 0
  });

  const totalGames = stats.wins + stats.losses + stats.draws;
  stats.winPercentage = totalGames > 0 ? (stats.wins / totalGames) * 100 : 0;
  stats.averagePoints = totalGames > 0 ? stats.totalPoints / totalGames : 0;

  return stats;
}

export function calculateOverallStats(allMatches) {
  const stats = calculateTournamentStats(allMatches);
  
  // Additional overall stats
  const tournaments = [...new Set(allMatches.map(match => match.tournamentId))];
  stats.tournamentsPlayed = tournaments.length;
  stats.gamesPlayed = allMatches.length;

  return stats;
}

export function getWinPercentageTrend(matches, groupBy = 'tournament') {
  if (!matches || matches.length === 0) return [];

  // Group matches by tournament or date
  const grouped = matches.reduce((acc, match) => {
    const key = groupBy === 'tournament' ? match.tournamentId : match.date?.split('T')[0];
    if (!acc[key]) acc[key] = [];
    acc[key].push(match);
    return acc;
  }, {});

  // Calculate win percentage for each group
  return Object.entries(grouped).map(([key, groupMatches]) => {
    const stats = calculateTournamentStats(groupMatches);
    return {
      label: key,
      winPercentage: stats.winPercentage,
      date: groupMatches[0].date
    };
  }).sort((a, b) => new Date(a.date) - new Date(b.date));
}

export function getPointsTrend(matches, groupBy = 'tournament') {
  if (!matches || matches.length === 0) return [];

  const grouped = matches.reduce((acc, match) => {
    const key = groupBy === 'tournament' ? match.tournamentId : match.date?.split('T')[0];
    if (!acc[key]) acc[key] = [];
    acc[key].push(match);
    return acc;
  }, {});

  return Object.entries(grouped).map(([key, groupMatches]) => {
    const stats = calculateTournamentStats(groupMatches);
    return {
      label: key,
      averagePoints: stats.averagePoints,
      totalPoints: stats.totalPoints,
      date: groupMatches[0].date
    };
  }).sort((a, b) => new Date(a.date) - new Date(b.date));
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatPercentage(value) {
  return `${Math.round(value)}%`;
}

export function formatPoints(value) {
  return Math.round(value);
}
