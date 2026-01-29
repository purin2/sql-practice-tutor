import { useState } from 'react';
import { Database, Key, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { TableSchema } from '@/types';
import { cn } from '@/lib/utils';

interface SchemaViewerProps {
  tables: TableSchema[];
}

export function SchemaViewer({ tables }: SchemaViewerProps) {
  const [selectedTable, setSelectedTable] = useState<string | null>(tables[0]?.name || null);

  const currentTable = tables.find((t) => t.name === selectedTable);

  return (
    <div className="space-y-6">
      {/* ER Diagram */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-4 w-4" />
            テーブル構成
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-center gap-4 p-4">
            {tables.map((table) => (
              <button
                key={table.name}
                onClick={() => setSelectedTable(table.name)}
                className={cn(
                  'p-4 rounded-lg border-2 transition-all min-w-[140px]',
                  selectedTable === table.name
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <div className="font-mono font-bold text-sm">{table.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {table.columns.length} columns
                </div>
              </button>
            ))}
          </div>
          <div className="text-center text-xs text-muted-foreground mt-2">
            ※ payments, events → users へ user_id で紐付け
          </div>
        </CardContent>
      </Card>

      {/* Table Detail */}
      {currentTable && (
        <Card id={currentTable.name}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="font-mono">{currentTable.name}</span>
              <Badge variant="outline">{currentTable.columns.length} columns</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">{currentTable.description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Columns */}
            <div>
              <h3 className="text-sm font-semibold mb-3">カラム</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 font-medium">カラム名</th>
                      <th className="text-left py-2 px-3 font-medium">型</th>
                      <th className="text-left py-2 px-3 font-medium">説明</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTable.columns.map((column) => (
                      <tr key={column.name} className="border-b last:border-0">
                        <td className="py-2 px-3 font-mono text-sm flex items-center gap-2">
                          {column.name}
                          {column.isPrimaryKey && (
                            <span title="Primary Key">
                              <Key className="h-3 w-3 text-yellow-500" />
                            </span>
                          )}
                          {column.isForeignKey && (
                            <span title="Foreign Key">
                              <LinkIcon className="h-3 w-3 text-blue-500" />
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          <Badge variant="secondary" className="font-mono text-xs">
                            {column.type}
                          </Badge>
                        </td>
                        <td className="py-2 px-3 text-muted-foreground">
                          {column.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sample Data */}
            <div>
              <h3 className="text-sm font-semibold mb-3">サンプルデータ</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      {currentTable.columns.map((column) => (
                        <th key={column.name} className="text-left py-2 px-3 font-mono text-xs">
                          {column.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentTable.sampleData.map((row, i) => (
                      <tr key={i} className="border-b last:border-0">
                        {currentTable.columns.map((column) => (
                          <td key={column.name} className="py-2 px-3 font-mono text-xs">
                            {String(row[column.name] ?? '-')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Relations */}
            {currentTable.relations.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3">リレーション</h3>
                <div className="space-y-2">
                  {currentTable.relations.map((rel, i) => (
                    <div key={i} className="text-sm text-muted-foreground">
                      <span className="font-mono">{currentTable.name}.{rel.fromColumn}</span>
                      {' → '}
                      <Button
                        variant="link"
                        className="p-0 h-auto font-mono"
                        onClick={() => setSelectedTable(rel.toTable)}
                      >
                        {rel.toTable}.{rel.toColumn}
                      </Button>
                      <span className="text-xs ml-2">({rel.type})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
