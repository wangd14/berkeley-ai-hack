import { CurriculumPage } from './pages/CurriculumPage';
import { MathematicsPage } from './pages/MathematicsPage';
import { SciencePage } from './pages/SciencePage';
import { Routes, Route } from 'react-router-dom';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<CurriculumPage />} />
      <Route path="/mathematics" element={<MathematicsPage />} />
      <Route path="/science" element={<SciencePage />} />
    </Routes>
  );
}