import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { birthdayContent } from '@/config';
import { easeCinema, fadeBlur, fadeOnly, scaleReveal } from '@/lib/animation';

type Phase = 'venti' | 'thirty' | 'date' | 'intro' | 'hold';

const PHASE_TIMINGS: Record<Phase, number> = {
  venti: 1600,
  thirty: 2000,
  date: 1800,
  intro: 1600,
  hold: 0,
};

const HOLD_DURATION = 1000; // ms to fill the ring

interface OpeningProps {
  onComplete: () => void;
}

export default function Opening({ onComplete }: OpeningProps) {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('venti');
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const holdStartRef = useRef<number>(0);

  // Sequence through the phases automatically
  useEffect(() => {
    if (phase === 'hold') return;
    const t = window.setTimeout(() => {
      const order: Phase[] = ['venti', 'thirty', 'date', 'intro', 'hold'];
      const idx = order.indexOf(phase);
      if (idx < order.length - 1) setPhase(order[idx + 1]);
    }, PHASE_TIMINGS[phase]);
    return () => window.clearTimeout(t);
  }, [phase]);

  const completeHold = useCallback(() => {
    if (holdTimerRef.current) window.clearInterval(holdTimerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setHoldProgress(100);
    window.setTimeout(onComplete, 500);
  }, [onComplete]);

  const startHold = useCallback(() => {
    if (phase !== 'hold' || isHolding) return;
    setIsHolding(true);
    holdStartRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - holdStartRef.current;
      const pct = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setHoldProgress(pct);
      if (pct >= 100) {
        completeHold();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [phase, isHolding, completeHold]);

  const cancelHold = useCallback(() => {
    if (!isHolding) return;
    setIsHolding(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    // Gracefully decay progress
    setHoldProgress((prev) => Math.max(0, prev - 30));
    holdTimerRef.current = window.setTimeout(() => setHoldProgress(0), 300);
  }, [isHolding]);

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) window.clearTimeout(holdTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Keyboard: hold with Space or Enter
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (phase !== 'hold') return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!isHolding) startHold();
      }
    },
    [phase, isHolding, startHold]
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') cancelHold();
    },
    [cancelHold]
  );

  const ringSize = 120;
  const radius = ringSize / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (holdProgress / 100) * circumference;

  return (
    <motion.div
      className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 no-select"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeOnly}
    >
      {/* VENTI */}
      {phase === 'venti' || phase === 'thirty' || phase === 'date' || phase === 'intro' || phase === 'hold' ? (
        <motion.h1
          className="font-serif text-cream"
          variants={scaleReveal}
          initial="hidden"
          animate="visible"
          style={{
            fontSize: 'clamp(3.5rem, 14vw, 7rem)',
            fontWeight: 300,
            letterSpacing: '0.08em',
          }}
        >
          {birthdayContent.name}
        </motion.h1>
      ) : null}

      {/* 30 */}
      {(phase === 'thirty' || phase === 'date' || phase === 'intro' || phase === 'hold') && (
        <motion.div
          initial={{ opacity: 0, filter: 'blur(12px)', scale: 1.1 }}
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
          transition={{ duration: reducedMotion ? 0.3 : 2, ease: easeCinema }}
          className="font-serif text-cream"
          style={{
            fontSize: 'clamp(5rem, 22vw, 12rem)',
            fontWeight: 300,
            letterSpacing: '0.02em',
            lineHeight: 1,
            marginTop: '0.1em',
          }}
        >
          {birthdayContent.age}
        </motion.div>
      )}

      {/* Date */}
      {(phase === 'date' || phase === 'intro' || phase === 'hold') && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reducedMotion ? 0.3 : 1.2, ease: easeCinema, delay: 0.2 }}
          className="mt-8 font-sans text-ink-300"
          style={{ fontSize: 'clamp(0.7rem, 3vw, 0.85rem)', letterSpacing: '0.35em', fontWeight: 400 }}
        >
          {birthdayContent.birthday}
        </motion.p>
      )}

      {/* Intro line */}
      {(phase === 'intro' || phase === 'hold') && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0.3 : 1.4, ease: easeCinema, delay: 0.3 }}
          className="mt-16 font-serif text-warm italic"
          style={{ fontSize: 'clamp(1.1rem, 4vw, 1.5rem)', fontWeight: 300 }}
        >
          I made something for you.
        </motion.p>
      )}

      {/* Hold to begin */}
      {phase === 'hold' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: easeCinema, delay: 0.4 }}
          className="group mt-14 flex flex-col items-center gap-5 cursor-pointer"
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          aria-label="Hold to begin the experience"
          tabIndex={0}
        >
          <div className="relative" style={{ width: ringSize, height: ringSize }}>
            <svg
              width={ringSize}
              height={ringSize}
              viewBox={`0 0 ${ringSize} ${ringSize}`}
              className="absolute inset-0 -rotate-90"
            >
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                fill="none"
                stroke="rgba(232,228,220,0.12)"
                strokeWidth="1.5"
              />
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                fill="none"
                stroke="rgba(232,228,220,0.7)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: isHolding ? 'none' : 'stroke-dashoffset 0.3s ease' }}
              />
            </svg>
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: isHolding ? 'scale(0.92)' : 'scale(1)',
                transition: 'transform 0.3s ease',
              }}
            >
              <div
                className="rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  background: isHolding ? 'rgba(232,228,220,0.9)' : 'rgba(232,228,220,0.35)',
                  transition: 'background 0.3s ease',
                }}
              />
            </div>
          </div>
          <span
            className="font-sans text-ink-300 group-hover:text-ink-100"
            style={{ fontSize: '0.7rem', letterSpacing: '0.35em', fontWeight: 400, textTransform: 'uppercase' as const, transition: 'color 0.4s ease' }}
          >
            hold to begin
          </span>
        </motion.button>
      )}
    </motion.div>
  );
}
