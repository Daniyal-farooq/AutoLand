'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

interface FerrariParallaxProps {
  scrollRange?: [number, number];
  offsetX?: number;
}

export default function FerrariParallax({
  scrollRange = [0, 1500],
  offsetX = 0,
}: FerrariParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Parallax effect - Ferrari moves slower than scroll for depth
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const xOffset = useTransform(scrollYProgress, [0, 1], [offsetX, offsetX - 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        style={{
          y: yOffset,
          x: xOffset,
          opacity,
        }}
        className="absolute top-1/2 right-0 -translate-y-1/2 w-full max-w-4xl h-auto"
      >
        {/* Fire Glow - Back Layer */}
        <motion.div
          animate={{
            boxShadow: [
              '0 0 80px rgba(239, 68, 68, 0.3), 0 0 120px rgba(249, 115, 22, 0.2)',
              '0 0 100px rgba(239, 68, 68, 0.5), 0 0 150px rgba(249, 115, 22, 0.3)',
              '0 0 80px rgba(239, 68, 68, 0.3), 0 0 120px rgba(249, 115, 22, 0.2)',
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -inset-32 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600 blur-3xl -z-10 opacity-20"
        />

        {/* Secondary Glow */}
        <motion.div
          animate={{
            opacity: [0.15, 0.25, 0.15],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute -inset-20 rounded-full bg-gradient-to-r from-red-500 to-yellow-500 blur-2xl -z-10 opacity-20"
        />

        {/* Glassmorphic Overlay */}
        <motion.div
          animate={{
            borderColor: [
              'rgba(212, 165, 116, 0.2)',
              'rgba(212, 165, 116, 0.4)',
              'rgba(212, 165, 116, 0.2)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 rounded-3xl backdrop-blur-sm bg-white/5 border border-white/10 pointer-events-none -z-5"
        />

        {/* Ferrari Image */}
        <img
          src="/ferrari-background.jpg"
          alt="Ferrari F8 Tributo"
          className="relative w-full h-auto object-contain filter drop-shadow-2xl"
          loading="lazy"
        />
      </motion.div>
    </div>
  );
}
