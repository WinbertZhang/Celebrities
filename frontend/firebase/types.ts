export type Player = {
    uid: string;
    name: string;
    team?: number;
  };
  
  export type Room = {
    code: string;
    hostUid: string;
    players: Player[];
    words: string[];
    phase: 'lobby' | 'entry' | 'teams' | 'play' | 'done';
    currentTeamTurn?: number;
    round?: number;
    startedAt?: number;
    turnEndsAt?: number;
    usedWords?: string[];
    remainingWords?: string[];
    scores?: { [teamNumber: number]: number };
    clueGivers?: { [teamNumber: number]: string };
  };