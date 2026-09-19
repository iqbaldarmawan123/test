import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Home } from 'lucide-react';
import { birthdayContent } from '@/config';
import { easeCinema, fadeOnly, scaleReveal } from '@/lib/animation';

type Phase = 'title' | 'date' | 'player';

const PHASE_TIMINGS: Record<Phase, number> = {
  title: 2200,
  date: 1800,
  player: 0,
};

interface FilmProps {
  onReplay: () => void;
}

export default function Film({ onReplay }: FilmProps) {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('title');
  const [hasPlaceholder, setHasPlaceholder] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    setHasPlaceholder(
      birthdayContent.finalFilm.youtubeId === '[YOUTUBE_ID]' ||
        birthdayContent.finalFilm.youtubeId.trim() === ''
    );
  }, []);

  useEffect(() => {
    if (phase === 'player') return;
    const t = window.setTimeout(() => {
      const order: Phase[] = ['title', 'date', 'player'];
      const idx = order.indexOf(phase);
      if (idx < order.length - 1) setPhase(order[idx + 1]);
    }, PHASE_TIMINGS[phase]);
    return () => window.clearTimeout(t);
  }, [phase]);

  const embedUrl = hasPlaceholder
    ? ''
    : `https://www.youtube-nocookie.com/embed/${birthdayContent.finalFilm.youtubeId}?rel=0&modestbranding=1&playsinline=1`;

  return (
    <motion.div
      className="flex min-h-[100dvh] flex-col items-center justify-center px-6 no-select"
      style={{ background: '#070708' }}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeOnly}
    >
      {/* VENTI / 30 */}
      <motion.h2
        className="font-serif text-cream text-center"
        variants={scaleReveal}
        initial="hidden"
        animate="visible"
        style={{
          fontSize: 'clamp(2.5rem, 10vw, 5rem)',
          fontWeight: 300,
          letterSpacing: '0.06em',
        }}
      >
        Venti <span className="text-ink-500">/</span> 30
      </motion.h2>

      {/* Date */}
      {(phase === 'date' || phase === 'player') && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reducedMotion ? 0.3 : 1.2, ease: easeCinema, delay: 0.2 }}
          className="mt-6 font-sans text-ink-300"
          style={{ fontSize: 'clamp(0.65rem, 3vw, 0.8rem)', letterSpacing: '0.35em', fontWeight: 400 }}
        >
          {birthdayContent.birthday}
        </motion.p>
      )}

      {/* YouTube player */}
      {phase === 'player' && (
        <motion.div
          className="flex flex-col items-center gap-8 mt-12 w-full"
          style={{ maxWidth: '800px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0.3 : 1.6, ease: easeCinema, delay: 0.3 }}
        >
          <div
            className="relative w-full overflow-hidden bg-ink-950"
            style={{ aspectRatio: '16 / 9', borderRadius: '2px' }}
          >
            {!hasPlaceholder ? (
              <>
                <motion.iframe
                  key={embedUrl}
                  src={embedUrl}
                  title="A little film for Venti"
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
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="font-sans text-ink-400 text-center px-8" style={{ fontSize: '0.8rem' }}>
                  Your film will play here once the YouTube ID is set.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={onReplay}
            className="group font-sans text-cream hover:text-white"
            style={{
              fontSize: '0.8rem',
              letterSpacing: '0.35em',
              fontWeight: 400,
              textTransform: 'uppercase',
              transition: 'color 0.4s ease',
            }}
            aria-label="Return to the beginning"
          >
            <span className="inline-flex items-center gap-3">
              home
              <Home
                size={16}
                className="transition-transform duration-500 group-hover:-translate-x-1"
                strokeWidth={1.5}
              />
            </span>
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
