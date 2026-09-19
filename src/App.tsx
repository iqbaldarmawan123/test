import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { easeCinema } from '@/lib/animation';
import Opening from '@/components/sections/Opening';
import Message from '@/components/sections/Message';
import Onyer from '@/components/sections/Onyer';
import Film from '@/components/sections/Film';
import ChapterMarker from '@/components/ChapterMarker';
import SkipControl from '@/components/SkipControl';
import { SECTION_ORDER } from '@/types';

export default function App() {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [cycleKey, setCycleKey] = useState(0); // bump to force remount on replay

  const currentSection = SECTION_ORDER[sectionIndex];

  const goNext = useCallback(() => {
    setSectionIndex((prev) => Math.min(prev + 1, SECTION_ORDER.length - 1));
  }, []);

  const skip = useCallback(() => {
    setSectionIndex((prev) => Math.min(prev + 1, SECTION_ORDER.length - 1));
  }, []);

  const replay = useCallback(() => {
    setSectionIndex(0);
    setCycleKey((k) => k + 1);
  }, []);

  const isLastSection = sectionIndex === SECTION_ORDER.length - 1;

  return (
    <main className="relative min-h-[100dvh] w-full overflow-hidden bg-ink-950">
      {/* Chapter marker */}
      <ChapterMarker current={currentSection} />

      {/* Skip control — hidden on the final section */}
      {!isLastSection && <SkipControl onSkip={skip} />}

      {/* Sections */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentSection}-${cycleKey}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: easeCinema }}
        >
          {currentSection === 'opening' && <Opening onComplete={goNext} />}
          {currentSection === 'message' && <Message onComplete={goNext} />}
          {currentSection === 'onyer' && <Onyer onComplete={goNext} />}
          {currentSection === 'film' && <Film onReplay={replay} />}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
