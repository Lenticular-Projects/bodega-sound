export interface SpeechHygieneData {
  cleanlinessScore: number;
  fillerWords: Array<{
    word: string;
    count: number;
  }>;
  totalFillerWords: number;
}

export interface PacingData {
  talkRatio: number;
  idealZone: {
    min: number;
    max: number;
  };
  interruptionRate: number;
  longestMonologue: number;
}

export interface AuthorityData {
  leadingRatio: number;
  assumptiveCloses: number;
  passiveQuestions: number;
}

export interface EngagementData {
  energyScore: number;
  energyHistory: number[];
  monologueFatigueZones: number;
  toneShifts: number;
}

export interface CommunicationStyleData {
  speech_hygiene?: SpeechHygieneData;
  pacing?: PacingData;
  authority?: AuthorityData;
  engagement?: EngagementData;
}

export interface CommunicationStyleCardProps {
  data: CommunicationStyleData;
  mode: "aggregate" | "individual";
  agentName?: string;
  callCount?: number;
  onDrillDown?: (metricType: string) => void;
}
