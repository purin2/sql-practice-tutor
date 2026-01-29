import { SchemaViewer } from '@/components/schema/SchemaViewer';
import type { TableSchema } from '@/types';

interface SchemaPageProps {
  tables: TableSchema[];
}

export function SchemaPage({ tables }: SchemaPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">データスキーマ</h1>
        <p className="text-muted-foreground">
          練習問題で使用するテーブルの構造とサンプルデータを確認できます。
        </p>
      </div>

      <SchemaViewer tables={tables} />
    </div>
  );
}
