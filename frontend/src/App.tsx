import { CurriculumPage } from './pages/CurriculumPage';
import { MathematicsPage } from './pages/MathematicsPage';
import { SciencePage } from './pages/SciencePage';
import { Routes, Route } from 'react-router-dom';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { EnglishArtsPage } from './pages/EnglishArtsPage';
import { TechnologyPage } from './pages/TechnologyPage';
import { AlgebraPage } from './pages/maths/AlgebraPage';
import { PreAlgebraPage } from './pages/maths/PreAlgebraPage';
import { BasicMathPage } from './pages/maths/BasicMathPage';
import { LanguageProvider } from './context/LanguageContext';
import {GeometryPage} from './pages/maths/GeometryPage';

export function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<CurriculumPage />} />
        <Route path="/mathematics" element={<MathematicsPage />} />
        <Route path="/mathematics/algebra" element={<AlgebraPage />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/science" element={<SciencePage />} />
        <Route path="/english-arts" element={<EnglishArtsPage />} />
        <Route path="/technology" element={<TechnologyPage />} />
        <Route path="/mathematics/pre-algebra" element={<PreAlgebraPage />} />
        <Route path="/mathematics/basic-math" element={<BasicMathPage />} />
        <Route path="/mathematics/geometry" element={<GeometryPage />} />
      </Routes>
    </LanguageProvider>
  );
}

export default App;