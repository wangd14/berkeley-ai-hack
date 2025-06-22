import React, { useState, useEffect } from 'react';
import { BookOpenIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import coursesData from '../../../data/courses.json';

interface Course {
  name: string;
  subcourses?: Subcourse[];
}

interface Subcourse {
  name: string;
  description: string;
  lessonPlan?: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  topics: string[];
  duration: string;
  completed: boolean;
  description: string;
  practiceQuestions?: PracticeQuestion[];
  contentParagraphs?: string[];
}

interface PracticeQuestion {
  question: string;
  answer: string;
}

const PythonPage: React.FC = () => {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<number[]>([0]);

  // Find Python course data
  const technologyCourse = coursesData.courses.find((course: Course) => course.name === 'Technology');
  const pythonCourse = technologyCourse?.subcourses?.find((sub: Subcourse) => sub.name === 'Introduction to Python');
  const lessonPlan = pythonCourse?.lessonPlan || [];

  const currentLessonData = lessonPlan[currentLesson];
  const currentQuestionData = currentLessonData?.practiceQuestions?.[currentQuestion];

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestionData) return;

    const isAnswerCorrect = userAnswer.toLowerCase().trim() === currentQuestionData.answer.toLowerCase().trim();
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    if (isAnswerCorrect) {
      setTimeout(() => {
        if (currentQuestion < (currentLessonData.practiceQuestions?.length || 0) - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setUserAnswer('');
          setIsCorrect(null);
          setShowFeedback(false);
        } else {
          // Lesson completed
          if (!completedLessons.includes(currentLesson)) {
            setCompletedLessons([...completedLessons, currentLesson]);
          }
        }
      }, 2000);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < (currentLessonData.practiceQuestions?.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setUserAnswer('');
      setIsCorrect(null);
      setShowFeedback(false);
    }
  };

  const handleLessonChange = (lessonIndex: number) => {
    setCurrentLesson(lessonIndex);
    setCurrentQuestion(0);
    setUserAnswer('');
    setIsCorrect(null);
    setShowFeedback(false);
  };

  if (!pythonCourse) {
    return <div className="text-center py-8">Course not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Introduction to Python
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {pythonCourse.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lesson Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <BookOpenIcon className="h-6 w-6 mr-2 text-green-600" />
                Lesson Plan
              </h2>
              <div className="space-y-3">
                {lessonPlan.map((lesson: Lesson, index: number) => (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonChange(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentLesson === index
                        ? 'bg-green-100 text-green-800 border-2 border-green-300'
                        : completedLessons.includes(index)
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{lesson.title}</h3>
                        <p className="text-sm opacity-75">{lesson.duration}</p>
                      </div>
                      {completedLessons.includes(index) && (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentLessonData ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {currentLessonData.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{currentLessonData.description}</p>
                  
                  {/* Topics */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Topics Covered:</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentLessonData.topics.map((topic: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Content Paragraphs */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Content:</h3>
                    <div className="space-y-3">
                      {currentLessonData.contentParagraphs?.map((paragraph: string, index: number) => (
                        <p key={index} className="text-gray-700 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Practice Questions */}
                  {currentQuestionData && (
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Practice Question {currentQuestion + 1} of {currentLessonData.practiceQuestions?.length}
                      </h3>
                      
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-gray-800 font-medium">{currentQuestionData.question}</p>
                      </div>

                      <form onSubmit={handleAnswerSubmit} key={`form-${currentLesson}-${currentQuestion}`}>
                        <div className="mb-4">
                          <input
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Enter your answer..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            disabled={showFeedback}
                          />
                        </div>
                        
                        <div className="flex gap-3">
                          <button
                            type="submit"
                            disabled={!userAnswer.trim() || showFeedback}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Submit Answer
                          </button>
                          
                          {currentQuestion < (currentLessonData.practiceQuestions?.length || 0) - 1 && (
                            <button
                              type="button"
                              onClick={handleNextQuestion}
                              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            >
                              Next Question
                            </button>
                          )}
                        </div>
                      </form>

                      {/* Feedback */}
                      {showFeedback && (
                        <div className={`mt-4 p-4 rounded-lg flex items-center ${
                          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {isCorrect ? (
                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                          ) : (
                            <XCircleIcon className="h-5 w-5 mr-2" />
                          )}
                          <span className="font-medium">
                            {isCorrect ? 'Correct!' : `Incorrect. The correct answer is: ${currentQuestionData.answer}`}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <p className="text-gray-600">No lesson data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PythonPage; 