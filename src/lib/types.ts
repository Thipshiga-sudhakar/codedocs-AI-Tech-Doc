export interface DocParam {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

export interface ApiRefItem {
  name: string;
  type: "function" | "class" | "endpoint" | "component";
  signature: string;
  description: string;
  params: DocParam[];
  returns: string;
  example: string;
}

export interface KeyComponent {
  name: string;
  role: string;
  details: string;
}

export interface CodeExplanation {
  overview: string;
  keyComponents: KeyComponent[];
  dataFlow: string;
  designPatterns: string[];
}

export interface ArchLayer {
  name: string;
  responsibility: string;
  components: string[];
}

export interface Dependency {
  from: string;
  to: string;
  reason: string;
}

export interface Architecture {
  type: string;
  layers: ArchLayer[];
  dependencies: Dependency[];
  diagram: string;
}

export interface UsageExample {
  title: string;
  description: string;
  language: string;
  code: string;
}

export interface GeneratedDocs {
  projectName: string;
  summary: string;
  language: string;
  complexity: number;
  techStack: string[];
  apiReference: ApiRefItem[];
  codeExplanation: CodeExplanation;
  architecture: Architecture;
  usageExamples: UsageExample[];
  readme: string;
}

export interface HistoryItem {
  id: string;
  projectName: string;
  language: string;
  timestamp: number;
  docs: GeneratedDocs;
  code: string;
}

export interface DocSettings {
  depth: "quick" | "standard" | "comprehensive";
  includeExamples: boolean;
  includeDiagrams: boolean;
  includePatterns: boolean;
  includeComplexity: boolean;
  outputLanguage: string;
}
