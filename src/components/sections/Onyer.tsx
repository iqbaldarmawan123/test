import { useEffect, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { birthdayContent } from '@/config';
import { easeCinema, fadeBlur, fadeOnly } from '@/lib/animation';

type Phase = 'actually' | 'someone' | 'player' | 'okay' | 'nowForMine';

const PHASE_TIMINGS: Record<Phase, number> = {
  actually: 1600,
  someone: 2600,
  player: 0,
  okay: 0,
  nowForMine: 2400,
};

interface OnyerProps {
  onComplete: () => void;
}

export default function Onyer({ onComplete }: OnyerProps) {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('actually');
  const [hasPlaceholder, setHasPlaceholder] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    setHasPlaceholder(
      birthdayContent.onyerYoutubeId === '[ONYER_YOUTUBE_ID]' ||
        birthdayContent.onyerYoutubeId.trim() === ''
    );
  }, []);

  useEffect(() => {
    if (phase === 'player' || phase === 'okay') return;
    const t = window.setTimeout(() => {
      const order: Phase[] = ['actually', 'someone', 'player', 'okay', 'nowForMine'];
      const idx = order.indexOf(phase);
      if (idx < order.length - 1) setPhase(order[idx + 1]);
    }, PHASE_TIMINGS[phase]);
    return () => window.clearTimeout(t);
  }, [phase]);

  const handleSkipVideo = () => {
    setPhase('okay');
  };

  useEffect(() => {
    if (phase !== 'okay') return;
    const t = window.setTimeout(() => setPhase('nowForMine'), 2000);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'nowForMine') return;
    const t = window.setTimeout(onComplete, PHASE_TIMINGS.nowForMine);
    return () => window.clearTimeout(t);
  }, [phase, onComplete]);

  const embedUrl = hasPlaceholder
    ? ''
    : `https://www.youtube-nocookie.com/embed/${birthdayContent.onyerYoutubeId}?rel=0&modestbranding=1&playsinline=1`;

  return (
    <motion.div
      className="flex min-h-[100dvh] flex-col items-center justify-center px-6 no-select"
      style={{ background: 'linear-gradient(180deg, #0a0a0b 0%, #070708 100%)' }}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeOnly}
    >
      {/* Actually... */}
      {phase === 'actually' && (
        <motion.p
          className="font-serif text-ink-300 italic"
          style={{ fontSize: 'clamp(1rem, 4vw, 1.3rem)', fontWeight: 300 }}
          variants={fadeBlur}
          initial="hidden"
          animate="visible"
        >
          Actually...
        </motion.p>
      )}

      {/* Someone wanted to say something */}
      {(phase === 'someone' || phase === 'player') && (
        <motion.h2
          className="font-serif text-cream text-center text-balance"
          style={{ fontSize: 'clamp(1.6rem, 6vw, 2.8rem)', fontWeight: 300, lineHeight: 1.3, maxWidth: '16ch' }}
          variants={fadeBlur}
          initial="hidden"
          animate="visible"
        >
          Someone wanted to say something.
        </motion.h2>
      )}

      {/* YouTube player */}
      {phase === 'player' && (
        <motion.div
          className="flex flex-col items-center gap-6 mt-12 w-full"
          style={{ maxWidth: '640px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0.3 : 1.4, ease: easeCinema, delay: 0.3 }}
        >
          <span
            className="font-sans text-ink-300"
            style={{ fontSize: '0.65rem', letterSpacing: '0.35em', fontWeight: 400, textTransform: 'uppercase' as const }}
          >
            From Onyer
          </span>

          <div
            className="relative w-full overflow-hidden bg-ink-950"
            style={{ aspectRatio: '16 / 9', borderRadius: '2px' }}
          >
            {!hasPlaceholder ? (
              <>
                <motion.iframe
                  key={embedUrl}
                  src={embedUrl}
                  title="Birthday greeting from Onyer"
                  className="absolute inset-0 h-full w-full"
                  style={{
                    border: 'none',
                    opacity: playerReady ? 1 : 0,
                    transition: 'opacity 1.2s ease',
                  }}
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  onLoad={() => setPlayerReady(true)}
                />
                {!playerReady && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="border border-cream/20 rounded-full"
                      style={{
                        width: 28,
                        height: 28,
                        borderTopColor: 'rgba(232,228,220,0.6)',
                        animation: 'spin 1.2s linear infinite',
                      }}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <p className="font-sans text-ink-400 text-center px-8" style={{ fontSize: '0.8rem' }}>
                  Onyer's video will appear here once the YouTube ID is set.
                </p>
                <button
                  onClick={handleSkipVideo}
                  className="font-sans text-ink-300 hover:text-cream"
                  style={{ fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', transition: 'color 0.4s ease' }}
                >
                  continue →
                </button>
              </div>
            )}
          </div>

          {!hasPlaceholder && (
            <button
              onClick={handleSkipVideo}
              className="font-sans text-ink-400 hover:text-ink-200"
              style={{ fontSize: '0.65rem', letterSpacing: '0.3em', fontWeight: 400, textTransform: 'uppercase', transition: 'color 0.4s ease' }}
            >
              skip →
            </button>
          )}
        </motion.div>
      )}

      {/* Okay */}
      <AnimatePresence mode="wait">
        {phase === 'okay' && (
          <motion.p
            key="okay"
            className="font-serif text-cream"
            style={{ fontSize: 'clamp(1.4rem, 5vw, 2rem)', fontWeight: 300 }}
            variants={fadeBlur}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            Okay.
          </motion.p>
        )}

        {phase === 'nowForMine' && (
          <motion.p
            key="nowForMine"
            className="font-serif text-warm text-center text-balance"
            style={{ fontSize: 'clamp(1.3rem, 5vw, 2rem)', fontWeight: 300, maxWidth: '20ch' }}
            variants={fadeBlur}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            Now for the one I made.
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
