import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { BookOpenIcon, CheckCircleIcon, LockIcon, ArrowLeftIcon } from 'lucide-react';
import coursesData from '../../../data/courses.json';

export function SatirePage() {
  const navigate = useNavigate();
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Get the Satire course data
  const englishCourse = coursesData.courses.find((course: any) => course.name === 'English Language Arts');
  const satireCourse = englishCourse?.subcourses.find((sub: any) => sub.name === 'Writing satire');
  const lessonPlan = satireCourse?.lessonPlan || [];

  const currentLesson = lessonPlan[selectedLesson];
  const practiceQuestions = currentLesson?.practiceQuestions || [];

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userAnswer.trim().toLowerCase() === practiceQuestions[currentQuestion].answer.toLowerCase()) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < practiceQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setUserAnswer('');
      setIsCorrect(null);
      setShowFeedback(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setUserAnswer('');
      setIsCorrect(null);
      setShowFeedback(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/english-arts')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to English Language Arts</span>
        </button>

        {/* Course Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <BookOpenIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Writing Satire</h1>
              <p className="text-gray-600">Use humor and wit to critique society</p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Master the art of satirical writing to entertain and provoke thought. Learn satirical techniques, 
            character development, and ethical considerations to create meaningful humor that challenges 
            social norms and promotes positive change.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lesson Navigation */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Lesson Plan</h2>
            {lessonPlan.map((lesson: any, index: number) => (
              <button
                key={lesson.id}
                onClick={() => {
                  setSelectedLesson(index);
                  setCurrentQuestion(0);
                  setUserAnswer('');
                  setIsCorrect(null);
                  setShowFeedback(false);
                }}
                className={`w-full text-left p-4 rounded-xl transition-all ${
                  selectedLesson === index 
                    ? 'bg-white shadow-lg border-2 border-blue-200' 
                    : 'bg-white shadow-sm hover:shadow-md border border-gray-100'
                } cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {lesson.completed ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : lesson.locked ? (
                      <LockIcon className="w-5 h-5 text-gray-400" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                    )}
                    <span className="font-semibold text-gray-900">{lesson.title}</span>
                  </div>
                  <span className="text-sm text-gray-500">{lesson.duration}</span>
                </div>
                <p className="text-sm text-gray-600">{lesson.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {lesson.topics.map((topic: string, idx: number) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                      {topic}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* Lesson Content */}
          <div className="lg:col-span-2 space-y-6">
            {currentLesson && (
              <>
                {/* Lesson Overview */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentLesson.title}</h2>
                  <p className="text-gray-700 mb-6">{currentLesson.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <h3 className="font-semibold text-blue-900 mb-2">Duration</h3>
                      <p className="text-blue-700">{currentLesson.duration}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                      <h3 className="font-semibold text-green-900 mb-2">Topics</h3>
                      <p className="text-green-700">{currentLesson.topics.length} topics</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl">
                      <h3 className="font-semibold text-purple-900 mb-2">Practice</h3>
                      <p className="text-purple-700">{practiceQuestions.length} questions</p>
                    </div>
                  </div>

                  {/* Content Paragraphs */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Key Concepts</h3>
                    {currentLesson.contentParagraphs?.map((paragraph: string, index: number) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-gray-700 leading-relaxed">{paragraph}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practice Questions */}
                {practiceQuestions.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      Practice Questions ({currentQuestion + 1} of {practiceQuestions.length})
                    </h3>
                    
                    <form onSubmit={handleAnswerSubmit} key={currentQuestion}>
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                          {practiceQuestions[currentQuestion].question}
                        </h4>
                        <input
                          type="text"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Type your answer here..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={showFeedback}
                        />
                      </div>
                      
                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          disabled={!userAnswer.trim() || showFeedback}
                          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Submit Answer
                        </button>
                        {showFeedback && (
                          <button
                            type="button"
                            onClick={handleNextQuestion}
                            disabled={currentQuestion >= practiceQuestions.length - 1}
                            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            Next Question
                          </button>
                        )}
                        {showFeedback && currentQuestion > 0 && (
                          <button
                            type="button"
                            onClick={handlePreviousQuestion}
                            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                          >
                            Previous Question
                          </button>
                        )}
                      </div>
                    </form>

                    {/* Feedback */}
                    {showFeedback && (
                      <div className={`mt-4 p-4 rounded-lg ${
                        isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        <p className="font-semibold">
                          {isCorrect ? 'Correct!' : 'Incorrect. Try again!'}
                        </p>
                        {!isCorrect && (
                          <p className="mt-2">
                            The correct answer is: <span className="font-semibold">{practiceQuestions[currentQuestion].answer}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 