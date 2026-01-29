import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Database, Lightbulb } from 'lucide-react';

export function GuidePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">使い方ガイド</h1>
        <p className="text-muted-foreground">
          SQL Practice Tutor の使い方と注意点
        </p>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">このツールについて</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            データ分析職の面接対策用SQL練習ツールです。
            <strong>答えを直接教えず</strong>、ヒントを通じて自力で解く力を養います。
          </p>
          <p>
            ブラウザ内でSQLを実行できるので、BigQueryなどの環境がなくても練習できます。
          </p>
        </CardContent>
      </Card>

      {/* SQLite Notice */}
      <Card className="border-yellow-500/50 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            重要: SQLite を使用しています
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p>
            このツールは <Badge variant="secondary">SQLite</Badge> で動作します。
            BigQuery とは一部の関数が異なります。
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">やりたいこと</th>
                  <th className="text-left py-2 px-3">BigQuery</th>
                  <th className="text-left py-2 px-3">SQLite（このツール）</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                <tr className="border-b">
                  <td className="py-2 px-3 font-sans">年月を抽出</td>
                  <td className="py-2 px-3">FORMAT_DATE('%Y-%m', date)</td>
                  <td className="py-2 px-3">strftime('%Y-%m', date)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3 font-sans">文字列の一部</td>
                  <td className="py-2 px-3">SUBSTR(str, 1, 7)</td>
                  <td className="py-2 px-3">substr(str, 1, 7)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3 font-sans">日付の差分</td>
                  <td className="py-2 px-3">DATE_DIFF(d1, d2, DAY)</td>
                  <td className="py-2 px-3">julianday(d1) - julianday(d2)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3 font-sans">現在日時</td>
                  <td className="py-2 px-3">CURRENT_TIMESTAMP()</td>
                  <td className="py-2 px-3">datetime('now')</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-3 font-sans">IF文</td>
                  <td className="py-2 px-3">IF(cond, a, b)</td>
                  <td className="py-2 px-3">CASE WHEN cond THEN a ELSE b END</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans">配列操作</td>
                  <td className="py-2 px-3">ARRAY_AGG, UNNEST</td>
                  <td className="py-2 px-3">❌ 非対応</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-muted-foreground">
            💡 面接では BigQuery の関数を使って回答してください。このツールでは SQLite の関数で練習できます。
          </p>
        </CardContent>
      </Card>

      {/* Data */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-5 w-5" />
            利用可能なデータ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="p-3 rounded-lg bg-muted">
              <div className="font-mono font-bold">users</div>
              <div className="text-muted-foreground text-xs mt-1">500行 - ユーザー情報</div>
              <div className="text-xs mt-2">ad_source, device, age_group, region, registered_at</div>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <div className="font-mono font-bold">payments</div>
              <div className="text-muted-foreground text-xs mt-1">500行 - 課金履歴</div>
              <div className="text-xs mt-2">user_id, amount, payment_date</div>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <div className="font-mono font-bold">events</div>
              <div className="text-muted-foreground text-xs mt-1">2000行 - 行動ログ</div>
              <div className="text-xs mt-2">user_id, event_type, event_date</div>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <div className="font-mono font-bold">ad_costs</div>
              <div className="text-muted-foreground text-xs mt-1">120行 - 広告費用</div>
              <div className="text-xs mt-2">month, ad_source, campaign, cost</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            練習のコツ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <ul className="space-y-2 list-disc list-inside">
            <li>まず <strong>ヒント1</strong> だけ見て考える</li>
            <li>どうしても分からなければヒント2、3と段階的に開く</li>
            <li>「答えを見る」は最終手段。見た後は必ず自分で書き直す</li>
            <li>同じ問題を翌日もう一度解いてみる</li>
            <li>実行結果が正しいか、スキーマページでデータを確認する</li>
          </ul>
        </CardContent>
      </Card>

      {/* Example Queries */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">SQLite 関数の例</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <div className="font-medium mb-2">日付から年月を抽出</div>
            <pre className="p-3 bg-muted rounded-lg overflow-x-auto font-mono text-xs">
{`SELECT
  strftime('%Y-%m', registered_at) as month,
  COUNT(*) as user_count
FROM users
GROUP BY month
ORDER BY month;`}
            </pre>
          </div>

          <div>
            <div className="font-medium mb-2">ウィンドウ関数（累計）</div>
            <pre className="p-3 bg-muted rounded-lg overflow-x-auto font-mono text-xs">
{`SELECT
  payment_date,
  amount,
  SUM(amount) OVER (ORDER BY payment_date) as cumulative_total
FROM payments
ORDER BY payment_date
LIMIT 20;`}
            </pre>
          </div>

          <div>
            <div className="font-medium mb-2">CASE WHEN でセグメント分け</div>
            <pre className="p-3 bg-muted rounded-lg overflow-x-auto font-mono text-xs">
{`SELECT
  user_id,
  CASE
    WHEN total_amount >= 10000 THEN 'heavy'
    WHEN total_amount >= 3000 THEN 'medium'
    ELSE 'light'
  END as user_segment
FROM (
  SELECT user_id, SUM(amount) as total_amount
  FROM payments
  GROUP BY user_id
);`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
