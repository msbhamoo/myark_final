import { QuizOpportunity } from '@/types/quiz';
import { getDb } from '@/lib/firebaseAdmin';
import { redirect } from 'next/navigation';
import EditQuizClient from './EditQuizClient';

export default async function EditQuizPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const db = getDb();
    const quizDoc = await db.collection('quizzes').doc(id).get();

    if (!quizDoc.exists) {
        redirect('/admin/opportunities/quizzes');
    }

    const quizData = { id: quizDoc.id, ...quizDoc.data() } as QuizOpportunity;

    return <EditQuizClient quizId={id} initialData={quizData} />;
}

