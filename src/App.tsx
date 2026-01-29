import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/pages/HomePage';
import { ProblemPage } from '@/pages/ProblemPage';
import { SchemaPage } from '@/pages/SchemaPage';
import { ReferencePage } from '@/pages/ReferencePage';
import { ProgressPage } from '@/pages/ProgressPage';
import { GuidePage } from '@/pages/GuidePage';
import problemsData from '@/data/problems.json';
import schemaData from '@/data/schema.json';
import referencesData from '@/data/references.json';
import type { Problem, TableSchema, SQLReference } from '@/types';

const problems = problemsData.problems as Problem[];
const tables = schemaData.tables as TableSchema[];
const references = referencesData.references as SQLReference[];

function App() {
  return (
    <BrowserRouter basename="/sql-practice-tutor">
      <ThemeProvider>
        <ProgressProvider>
          <Routes>
            <Route element={<Layout problems={problems} />}>
              <Route path="/" element={<HomePage problems={problems} />} />
              <Route path="/problem/:id" element={<ProblemPage problems={problems} />} />
              <Route path="/schema" element={<SchemaPage tables={tables} />} />
              <Route path="/reference" element={<ReferencePage references={references} problems={problems} />} />
              <Route path="/reference/:topic" element={<ReferencePage references={references} problems={problems} />} />
              <Route path="/progress" element={<ProgressPage problems={problems} />} />
              <Route path="/guide" element={<GuidePage />} />
            </Route>
          </Routes>
        </ProgressProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
