'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [searchValue, setSearchValue] = useState('');

  const handleHostClick = () => {
    if (!user) {
      router.push('/login?redirect=/host&accountType=organization');
      return;
    }
    router.push('/host');
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchValue.trim();
    if (trimmed.length === 0) {
      router.push('/opportunities');
      return;
    }
    router.push(`/opportunities?search=${encodeURIComponent(trimmed)}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#071045]/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-16 max-w-[1920px]">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 text-white font-bold text-2xl shadow-lg shadow-orange-500/25">
              A
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
              MyArk
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl">
            <form className="relative group" onSubmit={handleSearchSubmit}>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search scholarships, olympiad, entrance exams..."
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                className="pl-10 w-full bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:bg-white/10 transition-all"
                aria-label="Search opportunities"
              />
              <button type="submit" className="hidden" aria-hidden="true" />
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-white hover:text-orange-400 transition-colors">
              Home
            </Link>
            <Link href="/resources" className="text-sm font-medium text-white hover:text-orange-400 transition-colors">
              Resources
            </Link>
            <Link href="/faq" className="text-sm font-medium text-white hover:text-orange-400 transition-colors">
              FAQ
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Button 
              variant="ghost"
              className="text-white hover:text-orange-400 hover:bg-white/5 border border-white/10"
              onClick={handleHostClick}
            >
              Host
            </Button>
            {user ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="hidden sm:flex border-white/10 bg-white/10 text-white hover:bg-white/20"
                  onClick={() => router.push('/dashboard')}
                >
                  Dashboard
                </Button>
                <Button
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg shadow-orange-500/25"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg shadow-orange-500/25"
                onClick={handleLoginClick}
                disabled={loading}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
