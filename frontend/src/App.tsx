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
import CPage from './pages/programming/CPage';
import PythonPage from './pages/programming/PythonPage';
import IntroductionToSciencePage from './pages/science/IntroductionToSciencePage';
import BiologyFundamentalsPage from './pages/science/BiologyFundamentalsPage';
import ChemistryBasicsPage from './pages/science/ChemistryBasicsPage';
import PhysicsPrinciplesPage from './pages/science/PhysicsPrinciplesPage';
import { ReadingComprehensionPage } from './pages/english/ReadingComprehensionPage';
import { PersonalNarrativesPage } from './pages/english/PersonalNarrativesPage';
import { SatirePage } from './pages/english/SatirePage';
import { AnalysisEssaysPage } from './pages/english/AnalysisEssaysPage';

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
        <Route path="/programming/cpp" element={<CPage />} />
        <Route path="/programming/python" element={<PythonPage />} />
        <Route path="/science/introduction" element={<IntroductionToSciencePage />} />
        <Route path="/science/biology" element={<BiologyFundamentalsPage />} />
        <Route path="/science/chemistry" element={<ChemistryBasicsPage />} />
        <Route path="/science/physics" element={<PhysicsPrinciplesPage />} />
        <Route path="/english/reading-comprehension" element={<ReadingComprehensionPage />} />
        <Route path="/english/personal-narratives" element={<PersonalNarrativesPage />} />
        <Route path="/english/satire" element={<SatirePage />} />
        <Route path="/english/analysis-essays" element={<AnalysisEssaysPage />} />
      </Routes>
    </LanguageProvider>
  );
}

export default App;