'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OpportunityCard from '@/components/OpportunityCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Trophy,
  Search,
  Filter,
  TrendingUp,
  Calendar,
  Award,
  Target,
  Sparkles
} from 'lucide-react';

export default function CompetitionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedMode, setSelectedMode] = useState('all');

  const competitions = [
    {
      id: '1',
      title: 'National Science Olympiad 2024',
      category: 'olympiad',
      gradeEligibility: '6-12',
      organizer: 'Science Foundation',
      startDate: '2024-03-15',
      endDate: '2024-03-16',
      registrationDeadline: 'Feb 28, 2024',
      mode: 'online' as const,
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&q=80',
    },
    {
      id: '2',
      title: 'International Math Challenge',
      category: 'competition',
      gradeEligibility: '8-12',
      organizer: 'Math Academy',
      startDate: '2024-04-01',
      endDate: '2024-04-02',
      registrationDeadline: 'Mar 15, 2024',
      mode: 'hybrid' as const,
      fee: '$25',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&q=80',
    },
    {
      id: '5',
      title: 'Creative Writing Contest',
      category: 'competition',
      gradeEligibility: '6-10',
      organizer: 'Literary Society',
      startDate: '2024-04-10',
      endDate: '2024-04-11',
      registrationDeadline: 'Mar 25, 2024',
      mode: 'online' as const,
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&q=80',
    },
    {
      id: '6',
      title: 'Robotics Championship',
      category: 'competition',
      gradeEligibility: '8-12',
      organizer: 'Robotics Association',
      startDate: '2024-05-15',
      endDate: '2024-05-17',
      registrationDeadline: 'Apr 30, 2024',
      mode: 'hybrid' as const,
      fee: '$100',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&q=80',
    },
    {
      id: '7',
      title: 'Science Fair Innovation',
      category: 'competition',
      gradeEligibility: '6-12',
      organizer: 'Innovation Hub',
      startDate: '2024-04-25',
      endDate: '2024-04-26',
      registrationDeadline: 'Apr 10, 2024',
      mode: 'offline' as const,
      fee: '$30',
      image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=500&q=80',
    },
    {
      id: '15',
      title: 'Physics Challenge 2024',
      category: 'competition',
      gradeEligibility: '10-12',
      organizer: 'Physics Society',
      startDate: '2024-05-20',
      endDate: '2024-05-21',
      registrationDeadline: 'May 5, 2024',
      mode: 'online' as const,
      fee: '$15',
      image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=500&q=80',
    },
    {
      id: '16',
      title: 'Chemistry Olympiad',
      category: 'olympiad',
      gradeEligibility: '9-12',
      organizer: 'Chemistry Institute',
      startDate: '2024-06-01',
      endDate: '2024-06-02',
      registrationDeadline: 'May 15, 2024',
      mode: 'hybrid' as const,
      fee: '$20',
      image: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=500&q=80',
    },
    {
      id: '17',
      title: 'Debate Championship',
      category: 'competition',
      gradeEligibility: '7-12',
      organizer: 'Debate Association',
      startDate: '2024-04-18',
      endDate: '2024-04-19',
      registrationDeadline: 'Apr 5, 2024',
      mode: 'offline' as const,
      fee: '$35',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500&q=80',
    },
    {
      id: '18',
      title: 'Art & Design Contest',
      category: 'competition',
      gradeEligibility: '6-12',
      organizer: 'Art Foundation',
      startDate: '2024-05-10',
      endDate: '2024-05-12',
      registrationDeadline: 'Apr 25, 2024',
      mode: 'online' as const,
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500&q=80',
    },
  ];

  const categories = [
    { name: 'STEM Competitions', count: 42, icon: Target, color: 'from-blue-400 to-blue-600' },
    { name: 'Arts & Creativity', count: 28, icon: Sparkles, color: 'from-purple-400 to-purple-600' },
    { name: 'Olympiads', count: 35, icon: Trophy, color: 'from-orange-400 to-orange-600' },
    { name: 'Debate & Writing', count: 18, icon: Award, color: 'from-green-400 to-green-600' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 via-white to-red-50 py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-orange-500">
                <Trophy className="h-3 w-3 mr-1" />
                Competitions
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Compete & Excel
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Showcase your talents in national and international competitions
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search competitions..."
                    className="pl-12 h-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Category Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Card key={cat.name} className="p-4 hover:shadow-lg transition-shadow cursor-pointer group">
                      <div className={`h-12 w-12 mx-auto mb-3 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{cat.name}</h3>
                      <p className="text-2xl font-bold text-primary">{cat.count}</p>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Filters */}
          <Card className="p-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Filter Competitions</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="6-8">Grade 6-8</SelectItem>
                  <SelectItem value="6-10">Grade 6-10</SelectItem>
                  <SelectItem value="6-12">Grade 6-12</SelectItem>
                  <SelectItem value="7-12">Grade 7-12</SelectItem>
                  <SelectItem value="8-12">Grade 8-12</SelectItem>
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
                  <SelectItem value="arts">Arts</SelectItem>
                  <SelectItem value="robotics">Robotics</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedMode} onValueChange={setSelectedMode}>
                <SelectTrigger>
                  <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full">
                Reset Filters
              </Button>
            </div>
          </Card>

          {/* Competitions Grid */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">All Competitions</h2>
              <p className="text-muted-foreground">{competitions.length} competitions available</p>
            </div>
            <Select defaultValue="deadline">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deadline">Sort by Deadline</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="recent">Recently Added</SelectItem>
                <SelectItem value="free">Free First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions.map((competition) => (
              <OpportunityCard key={competition.id} {...competition} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <Button size="lg" variant="outline">
              Load More Competitions
            </Button>
          </div>
        </div>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-orange-600 to-red-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Compete?
            </h2>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto mb-8">
              Register now and showcase your skills on national and international platforms
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary">
                View My Applications
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-orange-600">
                Practice Resources
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}