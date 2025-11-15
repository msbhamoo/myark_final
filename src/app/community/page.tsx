'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MessageSquare, Users, Star, MessageCircle, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-[#071045]">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/grid-pattern.svg')] opacity-[0.03]"></div>
            <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-full opacity-50 blur-3xl animate-blob"></div>
            <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full opacity-50 blur-3xl animate-blob animation-delay-2000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground dark:text-white mb-6">
                Community <span className="text-orange-400">Discussions</span>
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Connect with fellow students, share experiences, and get your doubts resolved by experts.
              </p>
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search discussions by topic or subject..."
                  className="h-14 pl-12 pr-4 rounded-2xl bg-card/80 dark:bg-slate-800/50 border-border/60 dark:border-slate-700 text-foreground dark:text-white placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 text-foreground dark:text-white">
                <MessageSquare className="h-5 w-5 mr-2" />
                Start New Discussion
              </Button>
            </div>
          </div>
        </section>

        {/* Forums Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="trending" className="space-y-8">
              <TabsList className="w-full justify-start overflow-x-auto flex-wrap bg-card/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-1">
                <TabsTrigger value="trending" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-gray-300">
                  Trending
                </TabsTrigger>
                <TabsTrigger value="subject-wise" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-gray-300">
                  Subject-wise
                </TabsTrigger>
                <TabsTrigger value="study-groups" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-gray-300">
                  Study Groups
                </TabsTrigger>
                <TabsTrigger value="expert-corner" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-gray-300">
                  Expert Corner
                </TabsTrigger>
              </TabsList>

              <TabsContent value="trending">
                <div className="space-y-6">
                  {[
                    {
                      title: 'Best strategy for time management in competitive exams?',
                      author: 'Priya Sharma',
                      replies: 24,
                      views: 1.2,
                      category: 'Study Tips',
                      time: '2 hours ago',
                      solved: true,
                    },
                    {
                      title: 'Understanding quantum mechanics concepts',
                      author: 'Rahul Kumar',
                      replies: 15,
                      views: 0.8,
                      category: 'Physics',
                      time: '5 hours ago',
                      solved: false,
                    },
                  ].map((discussion, index) => (
                    <Card key={index} className="bg-card/80 dark:bg-slate-800/50 border-border/60 dark:border-slate-700 p-6 backdrop-blur-sm hover:bg-card/70 dark:bg-white/10 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-card/80 dark:bg-slate-800/50 text-orange-400 border-orange-500/20">
                              {discussion.category}
                            </Badge>
                            {discussion.solved && (
                              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                                Solved
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-foreground dark:text-white hover:text-orange-400 transition-colors cursor-pointer">
                            {discussion.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>{discussion.author}</span>
                            <span>•</span>
                            <span>{discussion.time}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              {discussion.replies} replies
                            </span>
                            <span>•</span>
                            <span>{discussion.views}K views</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Discussion
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="subject-wise">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {['Physics', 'Chemistry', 'Biology', 'Mathematics'].map((subject) => (
                    <Card key={subject} className="bg-card/80 dark:bg-slate-800/50 border-border/60 dark:border-slate-700 p-6 backdrop-blur-sm hover:bg-card/70 dark:bg-white/10 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-pink-500/20">
                          <MessageSquare className="h-6 w-6 text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">{subject} Forum</h3>
                          <p className="text-gray-300 text-sm mb-4">Subject-specific discussions, doubts, and solutions.</p>
                          <Button variant="outline" size="sm" className="w-full">Visit Forum</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="study-groups">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'JEE Aspirants', members: 1200, activity: 'Very Active' },
                    { name: 'NEET Study Circle', members: 850, activity: 'Active' },
                    { name: 'Olympiad Champions', members: 500, activity: 'Moderate' },
                  ].map((group, index) => (
                    <Card key={index} className="bg-card/80 dark:bg-slate-800/50 border-border/60 dark:border-slate-700 p-6 backdrop-blur-sm hover:bg-card/70 dark:bg-white/10 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-pink-500/20">
                          <Users className="h-6 w-6 text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">{group.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
                            <span>{group.members} members</span>
                            <span>•</span>
                            <span>{group.activity}</span>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">Join Group</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="expert-corner">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      name: 'Dr. Amit Kumar',
                      expertise: 'Physics',
                      rating: 4.9,
                      responses: 1240,
                    },
                    {
                      name: 'Prof. Priya Verma',
                      expertise: 'Chemistry',
                      rating: 4.8,
                      responses: 890,
                    },
                  ].map((expert, index) => (
                    <Card key={index} className="bg-card/80 dark:bg-slate-800/50 border-border/60 dark:border-slate-700 p-6 backdrop-blur-sm hover:bg-card/70 dark:bg-white/10 transition-colors">
                      <div className="flex items-start gap-6">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-500/20 to-pink-500/20 flex items-center justify-center text-2xl font-semibold text-foreground dark:text-white">
                          {expert.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-foreground dark:text-white mb-1">{expert.name}</h3>
                          <p className="text-gray-300 mb-3">{expert.expertise} Expert</p>
                          <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400" />
                              {expert.rating}
                            </span>
                            <span>•</span>
                            <span>{expert.responses} responses</span>
                          </div>
                          <Button variant="outline" size="sm">Ask a Question</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-t border-border/60 dark:border-slate-700">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-card/80 dark:bg-slate-800/50 border-border/60 dark:border-slate-700 p-6 backdrop-blur-sm">
                <div className="text-center">
                  <Sparkles className="h-8 w-8 text-orange-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-foreground dark:text-white mb-1">10K+</div>
                  <div className="text-sm text-gray-300">Active Discussions</div>
                </div>
              </Card>
              <Card className="bg-card/80 dark:bg-slate-800/50 border-border/60 dark:border-slate-700 p-6 backdrop-blur-sm">
                <div className="text-center">
                  <Users className="h-8 w-8 text-pink-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-foreground dark:text-white mb-1">50K+</div>
                  <div className="text-sm text-gray-300">Community Members</div>
                </div>
              </Card>
              <Card className="bg-card/80 dark:bg-slate-800/50 border-border/60 dark:border-slate-700 p-6 backdrop-blur-sm">
                <div className="text-center">
                  <Star className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-foreground dark:text-white mb-1">100+</div>
                  <div className="text-sm text-gray-300">Expert Mentors</div>
                </div>
              </Card>
              <Card className="bg-card/80 dark:bg-slate-800/50 border-border/60 dark:border-slate-700 p-6 backdrop-blur-sm">
                <div className="text-center">
                  <MessageCircle className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-foreground dark:text-white mb-1">95%</div>
                  <div className="text-sm text-gray-300">Doubts Resolved</div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


