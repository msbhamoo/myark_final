import { getQuizSubjects } from '../actions';
import { QuizForm } from './QuizForm';

export default async function NewQuizPage() {
  const subjects = await getQuizSubjects();
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create New Quiz</h1>
        <p className="text-gray-500">Configure a new competition or practice quiz.</p>
      </div>
      
      <div className="bg-white dark:bg-[#111] shadow-sm sm:rounded-lg border border-gray-200 dark:border-gray-800 p-6 md:p-8">
        <QuizForm subjects={subjects} />
      </div>
    </div>
  );
}
