'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Clock, 
  Target,
  Award,
  TrendingUp,
  BookOpen,
  Search,
  Filter,
  Star,
  Play,
  Trophy,
  Zap,
  Medal,
  Crown
} from 'lucide-react';

export default function PracticePage() {
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const userProgress = {
    totalPapers: 45,
    completed: 28,
    inProgress: 5,
    avgScore: 78,
    badges: 12,
    streak: 7,
    rank: 156,
  };

  const pastPapers = [
    {
      id: 1,
      title: 'Science Olympiad 2023 - Final Round',
      subject: 'Science',
      grade: '9-10',
      difficulty: 'Hard',
      type: 'Past Paper',
      year: 2023,
      totalMarks: 100,
      duration: '2 hours',
      questions: 100,
      downloads: 2340,
      solved: true,
      score: 85,
      hasSolutions: true,
    },
    {
      id: 2,
      title: 'National Math Challenge 2023',
      subject: 'Mathematics',
      grade: '8-10',
      difficulty: 'Medium',
      type: 'Model Paper',
      year: 2023,
      totalMarks: 100,
      duration: '2.5 hours',
      questions: 80,
      downloads: 1850,
      solved: false,
      hasSolutions: true,
    },
    {
      id: 3,
      title: 'English Proficiency Test 2023',
      subject: 'English',
      grade: '6-8',
      difficulty: 'Easy',
      type: 'Practice Test',
      year: 2023,
      totalMarks: 100,
      duration: '1.5 hours',
      questions: 60,
      downloads: 3120,
      solved: true,
      score: 92,
      hasSolutions: true,
    },
    {
      id: 4,
      title: 'Social Studies Olympiad 2022',
      subject: 'Social Studies',
      grade: '9-12',
      difficulty: 'Medium',
      type: 'Past Paper',
      year: 2022,
      totalMarks: 100,
      duration: '2 hours',
      questions: 100,
      downloads: 1560,
      solved: false,
      hasSolutions: true,
    },
    {
      id: 5,
      title: 'Physics Challenge 2023',
      subject: 'Physics',
      grade: '10-12',
      difficulty: 'Hard',
      type: 'Model Paper',
      year: 2023,
      totalMarks: 120,
      duration: '3 hours',
      questions: 60,
      downloads: 2890,
      solved: true,
      score: 72,
      hasSolutions: true,
    },
    {
      id: 6,
      title: 'Chemistry Mock Test 2023',
      subject: 'Chemistry',
      grade: '9-12',
      difficulty: 'Medium',
      type: 'Practice Test',
      year: 2023,
      totalMarks: 100,
      duration: '2 hours',
      questions: 75,
      downloads: 2100,
      solved: false,
      hasSolutions: true,
    },
  ];

  const quizzes = [
    {
      id: 1,
      title: 'Quick Science Quiz - Cellular Biology',
      subject: 'Biology',
      grade: '9-10',
      difficulty: 'Easy',
      questions: 20,
      duration: '15 mins',
      attempts: 1240,
      avgScore: 75,
      completed: false,
    },
    {
      id: 2,
      title: 'Algebra Speed Challenge',
      subject: 'Mathematics',
      grade: '8-10',
      difficulty: 'Medium',
      questions: 30,
      duration: '20 mins',
      attempts: 980,
      avgScore: 68,
      completed: true,
      yourScore: 82,
    },
    {
      id: 3,
      title: 'Grammar Master Quiz',
      subject: 'English',
      grade: '6-8',
      difficulty: 'Easy',
      questions: 25,
      duration: '15 mins',
      attempts: 2100,
      avgScore: 82,
      completed: true,
      yourScore: 88,
    },
  ];

  const badges = [
    { id: 1, name: 'First Steps', icon: Star, color: 'text-blue-500', earned: true, description: 'Complete your first practice paper' },
    { id: 2, name: 'Quick Learner', icon: Zap, color: 'text-yellow-500', earned: true, description: 'Score 90+ in any quiz' },
    { id: 3, name: 'Consistent', icon: Target, color: 'text-green-500', earned: true, description: '7 day practice streak' },
    { id: 4, name: 'High Scorer', icon: Trophy, color: 'text-orange-500', earned: true, description: 'Average score above 75%' },
    { id: 5, name: 'Paper Master', icon: Medal, color: 'text-purple-500', earned: false, description: 'Complete 50 practice papers' },
    { id: 6, name: 'Champion', icon: Crown, color: 'text-red-500', earned: false, description: 'Rank in top 100' },
  ];

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      Easy: 'bg-green-100 text-green-700',
      Medium: 'bg-yellow-100 text-yellow-700',
      Hard: 'bg-red-100 text-red-700',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-700';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Past Paper': 'bg-blue-100 text-blue-700',
      'Model Paper': 'bg-purple-100 text-purple-700',
      'Practice Test': 'bg-orange-100 text-orange-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Practice & Past Papers</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Master your skills with solved papers, interactive quizzes, and track your progress
                </p>
              </div>

              {/* Progress Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card className="p-4 text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{userProgress.completed}</div>
                  <div className="text-sm text-muted-foreground">Papers Completed</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">{userProgress.avgScore}%</div>
                  <div className="text-sm text-muted-foreground">Average Score</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-1">{userProgress.streak}</div>
                  <div className="text-sm text-muted-foreground">Day Streak 🔥</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">#{userProgress.rank}</div>
                  <div className="text-sm text-muted-foreground">Your Rank</div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="papers" className="w-full">
            <TabsList className="w-full justify-start mb-8">
              <TabsTrigger value="papers" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Past Papers
              </TabsTrigger>
              <TabsTrigger value="quizzes" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Quick Quizzes
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                My Progress
              </TabsTrigger>
              <TabsTrigger value="badges" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Badges
              </TabsTrigger>
            </TabsList>

            {/* Past Papers Tab */}
            <TabsContent value="papers">
              {/* Filters */}
              <Card className="p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search papers..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Grades</SelectItem>
                      <SelectItem value="6-8">Grade 6-8</SelectItem>
                      <SelectItem value="8-10">Grade 8-10</SelectItem>
                      <SelectItem value="9-10">Grade 9-10</SelectItem>
                      <SelectItem value="9-12">Grade 9-12</SelectItem>
                      <SelectItem value="10-12">Grade 10-12</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              {/* Papers Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pastPapers.map((paper) => (
                  <Card key={paper.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getTypeColor(paper.type)}>
                            {paper.type}
                          </Badge>
                          <Badge className={getDifficultyColor(paper.difficulty)}>
                            {paper.difficulty}
                          </Badge>
                          {paper.solved && (
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-bold text-lg mb-2">{paper.title}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {paper.subject}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            Grade {paper.grade}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {paper.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
                      <div className="text-center">
                        <div className="font-bold text-lg">{paper.questions}</div>
                        <div className="text-xs text-muted-foreground">Questions</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg">{paper.totalMarks}</div>
                        <div className="text-xs text-muted-foreground">Total Marks</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg">{paper.year}</div>
                        <div className="text-xs text-muted-foreground">Year</div>
                      </div>
                    </div>

                    {paper.solved && paper.score && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Your Score</span>
                          <span className="font-semibold text-green-600">{paper.score}%</span>
                        </div>
                        <Progress value={paper.score} className="h-2" />
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Play className="h-4 w-4 mr-2" />
                        {paper.solved ? 'Retry' : 'Start Practice'}
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                      {paper.hasSolutions && (
                        <Button variant="outline">
                          Solutions
                        </Button>
                      )}
                    </div>

                    <div className="mt-3 text-xs text-muted-foreground text-center">
                      {paper.downloads.toLocaleString()} downloads
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Quick Quizzes Tab */}
            <TabsContent value="quizzes">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz) => (
                  <Card key={quiz.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="mb-4">
                      <Badge className={`${getDifficultyColor(quiz.difficulty)} mb-3`}>
                        {quiz.difficulty}
                      </Badge>
                      <h3 className="font-bold text-lg mb-2">{quiz.title}</h3>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span>{quiz.subject}</span>
                        <span>•</span>
                        <span>Grade {quiz.grade}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Questions</span>
                        <span className="font-semibold">{quiz.questions}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-semibold">{quiz.duration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Avg Score</span>
                        <span className="font-semibold text-primary">{quiz.avgScore}%</span>
                      </div>
                    </div>

                    {quiz.completed && quiz.yourScore && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-700">Your Score</span>
                          <span className="text-xl font-bold text-green-700">{quiz.yourScore}%</span>
                        </div>
                      </div>
                    )}

                    <Button className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      {quiz.completed ? 'Retake Quiz' : 'Start Quiz'}
                    </Button>

                    <div className="mt-3 text-xs text-muted-foreground text-center">
                      {quiz.attempts.toLocaleString()} attempts
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-6">
                  <h2 className="text-2xl font-bold mb-6">Your Performance</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Overall Progress</span>
                        <span className="text-sm font-semibold text-primary">
                          {userProgress.completed}/{userProgress.totalPapers} Papers
                        </span>
                      </div>
                      <Progress value={(userProgress.completed / userProgress.totalPapers) * 100} className="h-3" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-foreground dark:text-white" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-700">{userProgress.completed}</div>
                            <div className="text-sm text-blue-600">Completed</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-foreground dark:text-white" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-orange-700">{userProgress.inProgress}</div>
                            <div className="text-sm text-orange-600">In Progress</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold mb-4">Subject-wise Performance</h3>
                      <div className="space-y-3">
                        {[
                          { subject: 'Mathematics', score: 82, papers: 12 },
                          { subject: 'Science', score: 78, papers: 10 },
                          { subject: 'English', score: 85, papers: 8 },
                          { subject: 'Social Studies', score: 72, papers: 6 },
                        ].map((item) => (
                          <div key={item.subject}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">{item.subject}</span>
                              <span className="text-muted-foreground">{item.score}% • {item.papers} papers</span>
                            </div>
                            <Progress value={item.score} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Recent Activity
                    </h3>
                    <div className="space-y-3">
                      {[
                        { title: 'Science Olympiad 2023', score: 85, date: '2 days ago' },
                        { title: 'Math Challenge', score: 78, date: '5 days ago' },
                        { title: 'English Test', score: 92, date: '1 week ago' },
                      ].map((activity, index) => (
                        <div key={index} className="pb-3 border-b last:border-b-0">
                          <div className="font-medium text-sm mb-1">{activity.title}</div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">{activity.date}</span>
                            <Badge className="bg-green-100 text-green-700">{activity.score}%</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50">
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                      <Target className="h-5 w-5 text-orange-600" />
                      Current Streak
                    </h3>
                    <div className="text-4xl font-bold text-orange-600 mb-2">
                      {userProgress.streak} Days 🔥
                    </div>
                    <p className="text-sm text-muted-foreground">Keep practicing daily to maintain your streak!</p>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Badges Tab */}
            <TabsContent value="badges">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2">Achievement Badges</h2>
                  <p className="text-muted-foreground">Earn badges by completing challenges and reaching milestones</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {badges.map((badge) => {
                    const Icon = badge.icon;
                    return (
                      <Card key={badge.id} className={`p-6 text-center ${badge.earned ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' : 'opacity-60 grayscale'}`}>
                        <div className={`h-20 w-20 mx-auto mb-4 rounded-full ${badge.earned ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gray-300'} flex items-center justify-center`}>
                          <Icon className={`h-10 w-10 ${badge.earned ? 'text-white' : 'text-gray-500'}`} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">{badge.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
                        {badge.earned ? (
                          <Badge className="bg-green-500">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Earned
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            Locked
                          </Badge>
                        )}
                      </Card>
                    );
                  })}
                </div>

                <Card className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg mb-1">Total Badges Earned</h3>
                      <p className="text-muted-foreground">Keep practicing to unlock more achievements</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary">{userProgress.badges}/20</div>
                      <div className="text-sm text-muted-foreground">Badges</div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
