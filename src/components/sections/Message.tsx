import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { easeCinema, fadeBlur, fadeOnly } from '@/lib/animation';

type Phase = 'greeting' | 'wish' | 'glad' | 'signoff' | 'more' | 'continue';

const PHASE_TIMINGS: Record<Phase, number> = {
  greeting: 1800,
  wish: 4200,
  glad: 2800,
  signoff: 2400,
  more: 2000,
  continue: 0,
};

interface MessageProps {
  onComplete: () => void;
}

export default function Message({ onComplete }: MessageProps) {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('greeting');

  useEffect(() => {
    if (phase === 'continue') return;
    const t = window.setTimeout(() => {
      const order: Phase[] = ['greeting', 'wish', 'glad', 'signoff', 'more', 'continue'];
      const idx = order.indexOf(phase);
      if (idx < order.length - 1) setPhase(order[idx + 1]);
    }, PHASE_TIMINGS[phase]);
    return () => window.clearTimeout(t);
  }, [phase]);

  const lineStyle = {
    fontSize: 'clamp(1.3rem, 5vw, 2.1rem)',
    fontWeight: 300,
    lineHeight: 1.5,
    maxWidth: '28ch',
  } as const;

  const smallStyle = {
    fontSize: 'clamp(0.95rem, 3.5vw, 1.15rem)',
    fontWeight: 300,
    lineHeight: 1.7,
    maxWidth: '32ch',
  } as const;

  return (
    <motion.div
      className="flex min-h-[100dvh] flex-col items-center justify-center px-6 no-select"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeOnly}
    >
      <div className="flex flex-col items-center text-center gap-10">
        {/* Greeting */}
        {(phase === 'greeting' || phase === 'wish' || phase === 'glad' || phase === 'signoff' || phase === 'more' || phase === 'continue') && (
          <motion.h2
            className="font-serif text-cream text-balance"
            style={lineStyle}
            variants={fadeBlur}
            initial="hidden"
            animate="visible"
          >
            Happy 30th, Venti.
          </motion.h2>
        )}

        {/* Wish paragraph */}
        {(phase === 'wish' || phase === 'glad' || phase === 'signoff' || phase === 'more' || phase === 'continue') && (
          <motion.p
            className="font-serif text-warm text-balance"
            style={smallStyle}
            variants={fadeBlur}
            initial="hidden"
            animate="visible"
          >
            I hope this year brings you more things to discover,
            more places to go,
            more reasons to laugh,
            and plenty of ordinary days worth remembering.
          </motion.p>
        )}

        {/* Glad */}
        {(phase === 'glad' || phase === 'signoff' || phase === 'more' || phase === 'continue') && (
          <motion.p
            className="font-serif text-warm italic text-balance"
            style={{ ...smallStyle, maxWidth: '24ch' }}
            variants={fadeBlur}
            initial="hidden"
            animate="visible"
          >
            I'm glad I get to be around for some of them.
          </motion.p>
        )}

        {/* Signoff */}
        {(phase === 'signoff' || phase === 'more' || phase === 'continue') && (
          <motion.div
            className="flex flex-col items-center gap-1"
            variants={fadeBlur}
            initial="hidden"
            animate="visible"
          >
            <p className="font-serif text-cream" style={{ fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', fontWeight: 400 }}>
              Happy 30th.
            </p>
            <p className="font-sans text-ink-300" style={{ fontSize: '0.85rem', letterSpacing: '0.2em', fontWeight: 400, marginTop: '0.5rem' }}>
              — Iqbal
            </p>
          </motion.div>
        )}

        {/* More */}
        {(phase === 'more' || phase === 'continue') && (
          <motion.p
            className="font-serif text-warm italic text-balance"
            style={{ ...smallStyle, maxWidth: '22ch', marginTop: '1.5rem' }}
            variants={fadeBlur}
            initial="hidden"
            animate="visible"
          >
            But I have one more thing for you.
          </motion.p>
        )}

        {/* Continue button */}
        {phase === 'continue' && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0.3 : 1, ease: easeCinema, delay: 0.3 }}
            onClick={onComplete}
            className="group mt-6 font-sans text-ink-200 hover:text-cream"
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.3em',
              fontWeight: 400,
              textTransform: 'uppercase',
              transition: 'color 0.4s ease',
            }}
            aria-label="Continue to the next section"
          >
            <span className="inline-flex items-center gap-2">
              continue
              <span className="inline-block transition-transform duration-500 group-hover:translate-x-1.5">→</span>
            </span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
