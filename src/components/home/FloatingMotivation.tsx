'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const MOTIVATIONAL_PHRASES = [
    "Education Shapes Destiny – APJ Abdul Kalam",
    "Learn, Unlearn, Relearn – Alvin Toffler",
    "Dreams Transform into Reality – APJ Abdul Kalam",
    "The Mind Must Be Trained – Swami Vivekananda",
    "Curiosity Fuels Genius – Einstein",
    "Knowledge is Liberation – Dr. B.R. Ambedkar",
    "Strive for Growth – Carol Dweck",
    "You Are the Creator – Rabindranath Tagore",
    "Learning is a Lifelong Journey – Maria Montessori",
    "Believe in Your Strength – Sarvepalli Radhakrishnan",
    "Education is the Real Wealth – Chanakya",
    "Think Deeply, Learn Fully – Socrates",
    "Inspire, Aspire, Achieve – Dr. K. Kasturirangan",
    "Let Wisdom Guide You – Confucius",
    "Awaken the Giant Within – Tony Robbins",
    "Knowledge Builds the Nation – Dr. Prakash Amte",
    "Your Potential is Infinite – Malcolm X",
    "Rise Through Learning – Savitribai Phule",
    "Seek Truth, Seek Light – Sri Aurobindo",
    "Learning Opens Every Door – Nelson Mandela"
];

// Soft, elegant color palette
const COLORS = [
    "text-blue-400/40",
    "text-green-400/40",
    "text-purple-400/40",
    "text-orange-400/40",
    "text-pink-400/40",
    "text-cyan-400/40",
    "text-amber-400/40"
];

type FloatingLine = {
    id: number;
    text: string;
    color: string;
    top: number;
    left: number;
    duration: number;
};

export function FloatingMotivation() {
    const [lines, setLines] = useState<FloatingLine[]>([]);

    useEffect(() => {
        const initialLines = Array.from({ length: 3 }).map((_, i) => createRandomLine(i));
        setLines(initialLines);

        const interval = setInterval(() => {
            setLines(prev => {
                const next = [...prev];
                const replaceIndex = Math.floor(Math.random() * next.length);
                next[replaceIndex] = createRandomLine(Date.now() + Math.random());
                return next;
            });
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
            {lines.map(line => (
                <div
                    key={line.id}
                    className={cn(
                        "absolute text-sm sm:text-base font-semibold whitespace-nowrap drop-shadow-md",
                        line.color,
                        "animate-float-fade"
                    )}
                    style={{
                        top: `${line.top}%`,
                        left: `${line.left}%`,
                        animationDuration: `${line.duration}s`,
                    }}
                >
                    {line.text}
                </div>
            ))}

            <style jsx global>{`
                @keyframes float-fade {
                  0% {
                    opacity: 0;
                    transform: translateY(10px) scale(0.95);
                  }
                  20% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                  }
                  80% {
                    opacity: 1;
                    transform: translateY(-10px) scale(1);
                  }
                  100% {
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                  }
                }
                .animate-float-fade {
                  animation-name: float-fade;
                  animation-timing-function: ease-in-out;
                  animation-fill-mode: forwards;
                }
            `}</style>
        </div>
    );
}

function createRandomLine(id: number): FloatingLine {
    let top = Math.random() * 70 + 10;
    let left = Math.random() * 80 + 10;

    if (top > 30 && top < 70 && left > 30 && left < 70) {
        if (Math.random() > 0.5) top = top < 50 ? top - 30 : top + 30;
        else left = left < 50 ? left - 30 : left + 30;
    }

    return {
        id,
        text: MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        top: Math.max(5, Math.min(90, top)),
        left: Math.max(5, Math.min(90, left)),
        duration: Math.random() * 3 + 6,
    };
}
