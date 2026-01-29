export interface Column {
  name: string;
  type: string;
  description: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
}

export interface Relation {
  fromColumn: string;
  toTable: string;
  toColumn: string;
  type: 'one-to-many' | 'many-to-one';
}

export interface TableSchema {
  name: string;
  description: string;
  columns: Column[];
  sampleData: Record<string, unknown>[];
  relations: Relation[];
}
