import { useState, useEffect} from 'react';
import { Header } from '../../components/Header';
import { useLanguage } from '../../context/LanguageContext';
import coursesData from '../../../data/courses.json';
import coursesDataShona from '../../../data/courses_shona.json';
import {
  BookOpenIcon,
  FileTextIcon,
  BrainIcon,
  PenToolIcon,
  PlayCircleIcon,
  ClipboardListIcon,
  XCircleIcon,
  CheckCircleIcon,
} from 'lucide-react';
import FloatingChatButton from '../../components/FloatingChatButton';

function getLessonPlan(language: string) {
  const data = language === 'Shona' ? coursesDataShona : coursesData;
  const mathCourse = data.courses.find((c: any) => c.name === (language === 'Shona' ? 'Masvomhu' : 'Mathematics'));
  if (!mathCourse || !mathCourse.subcourses) return [];
  const algebra = mathCourse.subcourses.find((s: any) => s.name === (language === 'Shona' ? 'Algebra' : 'Algebra'));
  if (!algebra || !algebra.lessonPlan) return [];
  return algebra.lessonPlan;
}

export function AlgebraPage() {
  const { language } = useLanguage();
  const lessonPlan: any[] = getLessonPlan(language);
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [practiceIdx, setPracticeIdx] = useState(() => Math.floor(Math.random() * 3));
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<null | boolean>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answeredSet, setAnsweredSet] = useState<Set<number>>(new Set());
  const currentLesson: any = lessonPlan[selectedLesson] || {};
  const practiceQuestions: any[] = currentLesson.practiceQuestions || [];
  const currentPractice = practiceQuestions[practiceIdx] || practiceQuestions[0] || {};

  // Reset answeredSet when lesson changes
  useEffect(() => {
    setAnsweredSet(new Set());
    setPracticeIdx(Math.floor(Math.random() * (practiceQuestions.length || 1)));
    setUserAnswer('');
    setIsCorrect(null);
    setSubmitted(false);
  }, [selectedLesson]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (
      userAnswer.trim().toLowerCase() === String(currentPractice.answer).trim().toLowerCase()
    ) {
      setIsCorrect(true);
      setAnsweredSet(prev => new Set(prev).add(practiceIdx));
    } else {
      setIsCorrect(false);
    }
  }

  function handleNext() {
    setIsCorrect(null);
    setSubmitted(false);
    setUserAnswer('');
    // Find an unanswered question
    const unanswered = practiceQuestions
      .map((_, idx) => idx)
      .filter(idx => !answeredSet.has(idx));
    if (unanswered.length > 0) {
      const nextIdx = unanswered[Math.floor(Math.random() * unanswered.length)];
      setPracticeIdx(nextIdx);
    }
  }

  const allAnswered = practiceQuestions.length > 0 && answeredSet.size === practiceQuestions.length;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header title="Algebra" />
      <FloatingChatButton />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lesson Navigation */}
          <div className="space-y-6">
            {/* Lesson Plan */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Lesson Plan</h2>
              <div className="space-y-3">
                {lessonPlan.map((lesson: any, idx: number) => (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLesson(idx)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${selectedLesson === idx ? 'bg-blue-50 border-2 border-blue-200' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${selectedLesson === idx ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                        <FileTextIcon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{lesson.title}</div>
                        <div className="text-sm text-gray-500">{lesson.duration}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            {/* Key Concepts moved here, vertical layout */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Key Concepts
              </h2>
              <div className="flex flex-col space-y-4">
                <div className="bg-blue-50 rounded-xl p-4 flex items-center space-x-4">
                  <div className="flex items-center justify-center h-16 w-16 bg-blue-100 rounded-full">
                    <BrainIcon className="w-10 h-10 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-900 text-lg">Variables</h3>
                    <p className="text-blue-800">
                      Letters that represent unknown values in mathematical expressions.
                    </p>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 flex items-center space-x-4">
                  <div className="flex items-center justify-center h-16 w-16 bg-purple-100 rounded-full">
                    <ClipboardListIcon className="w-10 h-10 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-purple-900 text-lg">Terms</h3>
                    <p className="text-purple-800">
                      Parts of an expression separated by addition or subtraction signs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Lesson */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-900 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayCircleIcon className="w-16 h-16 text-white opacity-80" />
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900">{currentLesson.title}</h2>
                <div className="prose max-w-none text-gray-800">
                  {/* Render all paragraphs together */}
                  {Array.isArray(currentLesson.contentParagraphs) && currentLesson.contentParagraphs.length > 0 ? (
                    <div>
                      {currentLesson.contentParagraphs.map((p: string, idx: number) => (
                        <p key={idx} className="mb-4">&nbsp;&nbsp;&nbsp;&nbsp;{p}</p>
                      ))}
                    </div>
                  ) : (
                    <div>{currentLesson.content}</div>
                  )}
                </div>
              </div>
            </div>
            {/* Interactive Practice */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Practice Exercise</h2>
                <div className="bg-blue-100 px-3 py-1 rounded-full">
                  <span className="text-blue-800 text-sm font-medium">{practiceQuestions && practiceQuestions.length ? practiceQuestions.length : 0} Questions</span>
                </div>
              </div>
              <div className="space-y-6">
                {allAnswered ? (
                  <div className="bg-green-50 rounded-xl p-6 flex items-center justify-center text-green-700 font-semibold text-lg">
                    <span>🎉 You answered all questions!</span>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <form key={practiceIdx} onSubmit={handleSubmit}>
                      <div className="flex items-start space-x-4">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <PenToolIcon className={`w-5 h-5 ${isCorrect === true ? 'text-green-600' : isCorrect === false ? 'text-red-600' : 'text-purple-600'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mt-2 mb-2">
                            <p className="text-gray-600">{currentPractice.question}</p>
                            <div className="flex items-center">
                              {isCorrect === false && submitted && (
                                <>
                                  <XCircleIcon className="w-5 h-5 text-red-600 mr-1" />
                                  <span className="text-red-600">Incorrect, try again!</span>
                                </>
                              )}
                              {isCorrect === true && submitted && (
                                <>
                                  <CheckCircleIcon className="w-5 h-5 text-green-600 mr-1" />
                                  <span className="text-green-600">Correct!</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="mt-4">
                            <input
                              type="text"
                              value={userAnswer}
                              onChange={e => setUserAnswer(e.target.value)}
                              placeholder="Enter your answer"
                              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isCorrect === true ? 'border-green-500 focus:ring-green-500' : isCorrect === false ? '' : 'border-gray-300 focus:ring-blue-500'}`}
                              disabled={isCorrect === true}
                            />
                          </div>
                          <div className="mt-4 flex items-center space-x-2">
                            {isCorrect === true ? (
                              <button type="button" className="text-white bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition-colors" onClick={handleNext}>
                                Next Question
                              </button>
                            ) : (
                              <>
                                <button type="submit" className={`text-white px-4 py-2 rounded-lg transition-colors bg-blue-600 hover:bg-blue-700`}>
                                  Check Answer
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
