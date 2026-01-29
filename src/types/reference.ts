export interface SQLExample {
  title: string;
  code: string;
  explanation: string;
}

export interface SQLReference {
  id: string;
  title: string;
  description: string;
  syntax: string;
  examples: SQLExample[];
  relatedProblems: string[];
  isBigQuerySpecific: boolean;
}
