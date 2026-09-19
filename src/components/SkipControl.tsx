import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { easeCinema } from '@/lib/animation';

interface SkipControlProps {
  onSkip: () => void;
}

export default function SkipControl({ onSkip }: SkipControlProps) {
  const reducedMotion = useReducedMotion();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <AnimatePresence mode="wait">
        {!confirming ? (
          <motion.button
            key="skip"
            onClick={() => setConfirming(true)}
            className="font-sans text-ink-500 hover:text-ink-200"
            style={{
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              fontWeight: 400,
              textTransform: 'uppercase',
              transition: 'color 0.4s ease',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: easeCinema }}
            aria-label="Skip to the next section"
          >
            skip →
          </motion.button>
        ) : (
          <motion.div
            key="confirm"
            className="flex flex-col items-end gap-3"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.2 : 0.5, ease: easeCinema }}
          >
            <p className="font-serif text-warm" style={{ fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)', fontWeight: 300 }}>
              Skip this?
            </p>
            <p className="font-sans text-ink-400" style={{ fontSize: '0.65rem', letterSpacing: '0.15em' }}>
              You can always come back.
            </p>
            <div className="flex gap-6">
              <button
                onClick={() => setConfirming(false)}
                className="font-sans text-ink-300 hover:text-cream"
                style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', transition: 'color 0.4s ease' }}
              >
                stay
              </button>
              <button
                onClick={() => {
                  setConfirming(false);
                  onSkip();
                }}
                className="font-sans text-cream hover:text-white"
                style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', transition: 'color 0.4s ease' }}
              >
                skip →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
