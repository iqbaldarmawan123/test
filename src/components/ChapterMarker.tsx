import { motion, AnimatePresence } from 'framer-motion';
import { easeCinema } from '@/lib/animation';
import { SECTION_LABELS, TOTAL_SECTIONS, type SectionId } from '@/types';

interface ChapterMarkerProps {
  current: SectionId;
}

export default function ChapterMarker({ current }: ChapterMarkerProps) {
  const label = SECTION_LABELS[current];
  if (!label) return null;

  return (
    <motion.div
      className="fixed top-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: easeCinema, delay: 0.5 }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={current}
          className="font-sans text-ink-400"
          style={{ fontSize: '0.6rem', letterSpacing: '0.35em', fontWeight: 400 }}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.6, ease: easeCinema }}
        >
          {label} <span className="text-ink-600">/</span> {String(TOTAL_SECTIONS).padStart(2, '0')}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}
