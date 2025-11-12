'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Download,
  Play,
  Clock,
  Star,
  Search,
  Eye,
  Bookmark,
  ExternalLink,
  BookMarked,
  Lightbulb,
  GraduationCap,
  Youtube,
  Link as LinkIcon
} from 'lucide-react';

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const books = [
    {
      id: 1,
      title: 'Complete Mathematics Guide - Grade 9-10',
      author: 'Dr. Sarah Johnson',
      subject: 'Mathematics',
      grade: '9-10',
      type: 'Textbook',
      pages: 450,
      downloads: 5680,
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&q=80',
      description: 'Comprehensive mathematics textbook covering algebra, geometry, trigonometry, and calculus fundamentals.',
      topics: ['Algebra', 'Geometry', 'Trigonometry', 'Statistics'],
    },
    {
      id: 2,
      title: 'Science Olympiad Preparation Manual',
      author: 'Prof. Michael Chen',
      subject: 'Science',
      grade: '8-10',
      type: 'Reference',
      pages: 380,
      downloads: 4230,
      rating: 4.9,
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=300&q=80',
      description: 'Essential guide for science olympiad preparation with solved examples and practice questions.',
      topics: ['Physics', 'Chemistry', 'Biology', 'General Science'],
    },
    {
      id: 3,
      title: 'English Grammar & Composition',
      author: 'Emma Williams',
      subject: 'English',
      grade: '6-8',
      type: 'Workbook',
      pages: 280,
      downloads: 6120,
      rating: 4.7,
      thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&q=80',
      description: 'Interactive workbook with exercises on grammar, vocabulary, and writing skills.',
      topics: ['Grammar', 'Vocabulary', 'Writing', 'Comprehension'],
    },
    {
      id: 4,
      title: 'Physics Problem Solving Handbook',
      author: 'Dr. Robert Kumar',
      subject: 'Physics',
      grade: '10-12',
      type: 'Reference',
      pages: 520,
      downloads: 3890,
      rating: 4.9,
      thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=300&q=80',
      description: 'Advanced physics problems with detailed solutions and conceptual explanations.',
      topics: ['Mechanics', 'Electricity', 'Optics', 'Modern Physics'],
    },
  ];

  const videoTutorials = [
    {
      id: 1,
      title: 'Quadratic Equations Made Easy',
      instructor: 'Khan Academy',
      subject: 'Mathematics',
      grade: '9-10',
      duration: '45 mins',
      views: 15600,
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80',
      description: 'Complete guide to solving quadratic equations with multiple methods and real-world applications.',
      playlist: 'Algebra Fundamentals',
    },
    {
      id: 2,
      title: 'Cellular Biology - Complete Overview',
      instructor: 'BioLearn',
      subject: 'Biology',
      grade: '9-12',
      duration: '1 hour',
      views: 22400,
      rating: 4.9,
      thumbnail: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&q=80',
      description: 'Detailed explanation of cell structure, functions, and processes with animations.',
      playlist: 'Biology Essentials',
    },
    {
      id: 3,
      title: 'English Essay Writing Masterclass',
      instructor: 'Writing Academy',
      subject: 'English',
      grade: '8-12',
      duration: '55 mins',
      views: 18900,
      rating: 4.7,
      thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80',
      description: 'Learn how to write compelling essays with proper structure, arguments, and examples.',
      playlist: 'Writing Skills',
    },
    {
      id: 4,
      title: 'Chemical Reactions & Equations',
      instructor: 'Chem Tutor Pro',
      subject: 'Chemistry',
      grade: '9-10',
      duration: '38 mins',
      views: 13200,
      rating: 4.6,
      thumbnail: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=400&q=80',
      description: 'Understanding chemical reactions, balancing equations, and reaction types.',
      playlist: 'Chemistry Basics',
    },
    {
      id: 5,
      title: 'World History - Industrial Revolution',
      instructor: 'History Hub',
      subject: 'History',
      grade: '9-12',
      duration: '50 mins',
      views: 9800,
      rating: 4.5,
      thumbnail: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&q=80',
      description: 'Comprehensive coverage of the Industrial Revolution and its global impact.',
      playlist: 'Modern History',
    },
    {
      id: 6,
      title: 'Geometry - Circles and Theorems',
      instructor: 'Math Wizard',
      subject: 'Mathematics',
      grade: '9-10',
      duration: '42 mins',
      views: 16700,
      rating: 4.8,
      thumbnail: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=400&q=80',
      description: 'Master circle properties, theorems, and problem-solving techniques.',
      playlist: 'Geometry Series',
    },
  ];

  const studyGuides = [
    {
      id: 1,
      title: 'Quick Revision Notes - Physics',
      subject: 'Physics',
      grade: '10-12',
      pages: 25,
      downloads: 8900,
      thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=200&q=80',
      description: 'Condensed notes covering all important physics formulas and concepts.',
    },
    {
      id: 2,
      title: 'Math Formulas Cheat Sheet',
      subject: 'Mathematics',
      grade: '9-12',
      pages: 15,
      downloads: 12400,
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=200&q=80',
      description: 'All essential math formulas in one convenient reference sheet.',
    },
    {
      id: 3,
      title: 'Biology Mind Maps',
      subject: 'Biology',
      grade: '9-10',
      pages: 18,
      downloads: 7600,
      thumbnail: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=200&q=80',
      description: 'Visual mind maps for easy memorization of biology concepts.',
    },
    {
      id: 4,
      title: 'Grammar Rules Summary',
      subject: 'English',
      grade: '6-10',
      pages: 12,
      downloads: 9200,
      thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&q=80',
      description: 'Complete English grammar rules in a concise format.',
    },
  ];

  const learningModules = [
    {
      id: 1,
      title: 'Introduction to Python Programming',
      category: 'Computer Science',
      grade: '8-12',
      lessons: 12,
      duration: '4 weeks',
      enrolled: 3400,
      level: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80',
    },
    {
      id: 2,
      title: 'Creative Writing Workshop',
      category: 'English',
      grade: '7-10',
      lessons: 8,
      duration: '3 weeks',
      enrolled: 2100,
      level: 'Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80',
    },
    {
      id: 3,
      title: 'Environmental Science',
      category: 'Science',
      grade: '9-12',
      lessons: 10,
      duration: '3 weeks',
      enrolled: 1890,
      level: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Learning Resources</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Access quality study materials, video tutorials, and learning modules
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search resources..."
                    className="pl-12 h-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">250+</div>
                  <div className="text-sm text-muted-foreground">Books</div>
                </Card>
                <Card className="p-4 text-center">
                  <Video className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm text-muted-foreground">Videos</div>
                </Card>
                <Card className="p-4 text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">180+</div>
                  <div className="text-sm text-muted-foreground">Guides</div>
                </Card>
                <Card className="p-4 text-center">
                  <GraduationCap className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-sm text-muted-foreground">Modules</div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="books" className="w-full">
            <TabsList className="w-full justify-start mb-8">
              <TabsTrigger value="books" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Reference Books
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Video Tutorials
              </TabsTrigger>
              <TabsTrigger value="guides" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Study Guides
              </TabsTrigger>
              <TabsTrigger value="modules" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Learning Modules
              </TabsTrigger>
            </TabsList>

            {/* Books Tab */}
            <TabsContent value="books">
              {/* Filters */}
              <Card className="p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Resource Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="textbook">Textbook</SelectItem>
                      <SelectItem value="reference">Reference</SelectItem>
                      <SelectItem value="workbook">Workbook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              {/* Books Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {books.map((book) => (
                  <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                      <img 
                        src={book.thumbnail} 
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-muted dark:bg-white/90">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-blue-500">{book.type}</Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-sm">{book.rating}</span>
                        <span className="text-xs text-muted-foreground ml-1">
                          ({book.downloads.toLocaleString()} downloads)
                        </span>
                      </div>
                      <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">by {book.author}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary" className="text-xs">{book.subject}</Badge>
                        <Badge variant="secondary" className="text-xs">Grade {book.grade}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {book.description}
                      </p>
                      <div className="text-xs text-muted-foreground mb-3">
                        {book.pages} pages
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videoTutorials.map((video) => (
                  <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center">
                          <Play className="h-8 w-8 text-primary ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <Badge className="bg-black/70 text-foreground dark:text-white">
                          <Clock className="h-3 w-3 mr-1" />
                          {video.duration}
                        </Badge>
                      </div>
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-red-500">
                          <Youtube className="h-3 w-3 mr-1" />
                          Video
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-sm">{video.rating}</span>
                        <span className="text-xs text-muted-foreground ml-1">
                          • {video.views.toLocaleString()} views
                        </span>
                      </div>
                      <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{video.instructor}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary" className="text-xs">{video.subject}</Badge>
                        <Badge variant="secondary" className="text-xs">Grade {video.grade}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {video.description}
                      </p>
                      <div className="text-xs text-muted-foreground mb-3">
                        Part of: {video.playlist}
                      </div>
                      <Button size="sm" className="w-full">
                        <Play className="h-3 w-3 mr-2" />
                        Watch Now
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Study Guides Tab */}
            <TabsContent value="guides">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {studyGuides.map((guide) => (
                  <Card key={guide.id} className="p-5 hover:shadow-lg transition-shadow group">
                    <div className="h-32 w-full mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-green-100 to-blue-100">
                      <img 
                        src={guide.thumbnail} 
                        alt={guide.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <Badge variant="secondary" className="mb-3">{guide.subject}</Badge>
                    <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {guide.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>Grade {guide.grade}</span>
                      <span>{guide.pages} pages</span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-3">
                      {guide.downloads.toLocaleString()} downloads
                    </div>
                    <Button size="sm" className="w-full">
                      <Download className="h-3 w-3 mr-2" />
                      Download PDF
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Learning Modules Tab */}
            <TabsContent value="modules">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learningModules.map((module) => (
                  <Card key={module.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100 overflow-hidden">
                      <img 
                        src={module.thumbnail} 
                        alt={module.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className={`${
                          module.level === 'Beginner' ? 'bg-green-500' :
                          module.level === 'Intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}>
                          {module.level}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {module.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">{module.category}</p>
                      
                      <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
                        <div className="text-center">
                          <div className="font-bold">{module.lessons}</div>
                          <div className="text-xs text-muted-foreground">Lessons</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold">{module.duration}</div>
                          <div className="text-xs text-muted-foreground">Duration</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold">{module.enrolled}</div>
                          <div className="text-xs text-muted-foreground">Enrolled</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          Start Learning
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}

