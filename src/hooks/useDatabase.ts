import { useState, useEffect, useCallback } from 'react';
import initSqlJs, { type Database, type SqlValue } from 'sql.js';
import schemaData from '@/data/schema.json';

type SampleDataRow = Record<string, string | number | null>;

export interface QueryResult {
  columns: string[];
  values: SqlValue[][];
}

export interface QueryError {
  message: string;
}

export function useDatabase() {
  const [db, setDb] = useState<Database | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        console.log('[useDatabase] Initializing SQL.js...');
        const SQL = await initSqlJs({
          locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
        });

        const database = new SQL.Database();
        console.log('[useDatabase] Database created');

        // Create tables and insert sample data
        for (const table of schemaData.tables) {
          // Create table
          const columns = table.columns.map((col) => {
            let type = 'TEXT';
            if (col.type === 'INTEGER' || col.type === 'INT64') type = 'INTEGER';
            if (col.type === 'FLOAT64' || col.type === 'NUMERIC') type = 'REAL';
            return `${col.name} ${type}`;
          });

          const createSQL = `CREATE TABLE ${table.name} (${columns.join(', ')})`;
          console.log('[useDatabase] Creating table:', createSQL);
          database.run(createSQL);

          // Insert sample data
          if (table.sampleData && table.sampleData.length > 0) {
            const colNames = table.columns.map((c) => c.name);
            for (const row of table.sampleData as SampleDataRow[]) {
              const values = colNames.map((name) => {
                const val = row[name];
                if (val === null || val === undefined) return 'NULL';
                if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
                return String(val);
              });
              const insertSQL = `INSERT INTO ${table.name} (${colNames.join(', ')}) VALUES (${values.join(', ')})`;
              database.run(insertSQL);
            }
            console.log(`[useDatabase] Inserted ${table.sampleData.length} rows into ${table.name}`);
          }
        }

        setDb(database);
        setIsLoading(false);
        console.log('[useDatabase] Database initialized successfully');
      } catch (error) {
        console.error('[useDatabase] Initialization error:', error);
        setInitError(error instanceof Error ? error.message : String(error));
        setIsLoading(false);
      }
    };

    initDatabase();

    return () => {
      if (db) {
        db.close();
      }
    };
  }, []);

  const executeQuery = useCallback(
    (sql: string): { result?: QueryResult; error?: QueryError } => {
      if (!db) {
        return { error: { message: 'データベースが初期化されていません' } };
      }

      try {
        console.log('[useDatabase] Executing query:', sql);
        const results = db.exec(sql);

        if (results.length === 0) {
          return {
            result: { columns: ['結果'], values: [['クエリは正常に実行されましたが、結果がありません']] },
          };
        }

        const firstResult = results[0];
        console.log('[useDatabase] Query result:', firstResult);

        return {
          result: {
            columns: firstResult.columns,
            values: firstResult.values,
          },
        };
      } catch (error) {
        console.error('[useDatabase] Query error:', error);
        return {
          error: {
            message: error instanceof Error ? error.message : String(error),
          },
        };
      }
    },
    [db]
  );

  return {
    isLoading,
    initError,
    executeQuery,
  };
}
