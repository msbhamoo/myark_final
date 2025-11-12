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
  Award,
  Search,
  Filter,
  DollarSign,
  GraduationCap,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function ScholarshipsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedAmount, setSelectedAmount] = useState('all');

  const scholarships = [
    {
      id: '8',
      title: 'Merit-Based Academic Scholarship',
      category: 'scholarship',
      gradeEligibility: '10-12',
      organizer: 'University Foundation',
      startDate: '2024-06-01',
      endDate: '2024-06-30',
      registrationDeadline: 'May 15, 2024',
      mode: 'online' as const,
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=80',
    },
    {
      id: '9',
      title: 'Young Innovators Grant',
      category: 'scholarship',
      gradeEligibility: '9-12',
      organizer: 'Innovation Fund',
      startDate: '2024-07-01',
      endDate: '2024-07-31',
      registrationDeadline: 'Jun 20, 2024',
      mode: 'online' as const,
      image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=500&q=80',
    },
    {
      id: '19',
      title: 'STEM Excellence Award',
      category: 'scholarship',
      gradeEligibility: '9-12',
      organizer: 'Tech Foundation',
      startDate: '2024-05-01',
      endDate: '2024-05-31',
      registrationDeadline: 'Apr 20, 2024',
      mode: 'online' as const,
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80',
    },
    {
      id: '20',
      title: 'National Talent Scholarship',
      category: 'scholarship',
      gradeEligibility: '8-12',
      organizer: 'Education Ministry',
      startDate: '2024-04-15',
      endDate: '2024-05-15',
      registrationDeadline: 'Apr 1, 2024',
      mode: 'online' as const,
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=500&q=80',
    },
    {
      id: '21',
      title: 'Sports Excellence Scholarship',
      category: 'scholarship',
      gradeEligibility: '9-12',
      organizer: 'Sports Authority',
      startDate: '2024-06-10',
      endDate: '2024-07-10',
      registrationDeadline: 'May 25, 2024',
      mode: 'offline' as const,
      fee: '$10',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&q=80',
    },
    {
      id: '22',
      title: 'Arts & Culture Grant',
      category: 'scholarship',
      gradeEligibility: '6-12',
      organizer: 'Cultural Foundation',
      startDate: '2024-05-20',
      endDate: '2024-06-20',
      registrationDeadline: 'May 5, 2024',
      mode: 'online' as const,
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80',
    },
  ];

  const scholarshipTypes = [
    { 
      name: 'Merit-Based', 
      count: 45, 
      icon: Award, 
      color: 'from-green-400 to-green-600',
      description: 'Based on academic performance'
    },
    { 
      name: 'Need-Based', 
      count: 32, 
      icon: DollarSign, 
      color: 'from-blue-400 to-blue-600',
      description: 'Financial assistance for students'
    },
    { 
      name: 'Talent-Based', 
      count: 28, 
      icon: Sparkles, 
      color: 'from-purple-400 to-purple-600',
      description: 'For specific talents & skills'
    },
    { 
      name: 'Research Grants', 
      count: 18, 
      icon: GraduationCap, 
      color: 'from-orange-400 to-orange-600',
      description: 'For research projects'
    },
  ];

  const benefits = [
    'Full or partial tuition coverage',
    'Living expenses support',
    'Books and materials allowance',
    'Mentorship opportunities',
    'Career guidance programs',
    'Networking events access',
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-green-500">
                <Award className="h-3 w-3 mr-1" />
                Scholarships
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Fund Your Education
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Discover scholarships and financial aid opportunities for your academic journey
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search scholarships..."
                    className="pl-12 h-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Scholarship Types */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {scholarshipTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Card key={type.name} className="p-4 hover:shadow-lg transition-shadow cursor-pointer group text-left">
                      <div className={`h-12 w-12 mb-3 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-foreground dark:text-white" />
                      </div>
                      <h3 className="font-semibold mb-1">{type.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{type.description}</p>
                      <p className="text-2xl font-bold text-primary">{type.count}</p>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Why Apply for Scholarships?</h2>
                <p className="text-muted-foreground">Benefits beyond financial support</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {benefits.map((benefit, index) => (
                  <Card key={index} className="p-4 flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="font-medium">{benefit}</span>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Filters */}
          <Card className="p-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Filter Scholarships</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="6-12">Grade 6-12</SelectItem>
                  <SelectItem value="8-12">Grade 8-12</SelectItem>
                  <SelectItem value="9-12">Grade 9-12</SelectItem>
                  <SelectItem value="10-12">Grade 10-12</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Scholarship Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="merit">Merit-Based</SelectItem>
                  <SelectItem value="need">Need-Based</SelectItem>
                  <SelectItem value="talent">Talent-Based</SelectItem>
                  <SelectItem value="research">Research Grants</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedAmount} onValueChange={setSelectedAmount}>
                <SelectTrigger>
                  <SelectValue placeholder="Award Amount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Amounts</SelectItem>
                  <SelectItem value="under-1000">Under $1,000</SelectItem>
                  <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                  <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                  <SelectItem value="above-10000">Above $10,000</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full">
                Reset Filters
              </Button>
            </div>
          </Card>

          {/* Scholarships Grid */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Available Scholarships</h2>
              <p className="text-muted-foreground">{scholarships.length} scholarships available</p>
            </div>
            <Select defaultValue="deadline">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deadline">Sort by Deadline</SelectItem>
                <SelectItem value="amount">Highest Amount</SelectItem>
                <SelectItem value="recent">Recently Added</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarships.map((scholarship) => (
              <OpportunityCard key={scholarship.id} {...scholarship} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <Button size="lg" variant="outline">
              Load More Scholarships
            </Button>
          </div>
        </div>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-green-600 to-emerald-600 text-foreground dark:text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <Award className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Your Application Today
            </h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto mb-8">
              Don't miss out on opportunities to fund your education. Apply now!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Create Profile
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-foreground dark:text-white hover:bg-white hover:text-green-600">
                Application Tips
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
