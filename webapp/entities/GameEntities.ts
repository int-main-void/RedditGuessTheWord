interface Word {
    gameId: String;
    value: String;
    level: number;
  }
  
  interface Session {
    playerId: String;
    startTime: Date;
    games: number;
    points: number;
  }
  
  interface Player {
    name: String;
    numSessions: number;
    lastSession: Date;
    points: number;
    gameIdsPlayed: String[];
    currentLevel: number;
  }
  