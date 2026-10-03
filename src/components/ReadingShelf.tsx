'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import reading from '@/data/reading.json';

function BookCover({ cover, title }: { cover: string | null; title: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-r-md bg-black/[.04] shadow-md dark:bg-white/[.06]">
      {cover && !failed ? (
        <Image
          src={cover}
          alt={`${title} — book cover`}
          fill
          sizes="(max-width: 640px) 104px, 120px"
          className="object-cover"
          onError={() => setFailed(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="flex h-full items-center justify-center p-3 text-center text-sm text-gray-500 dark:text-gray-400">
          {title}
        </span>
      )}
    </div>
  );
}

export default function ReadingShelf() {
  const viewport = useRef<HTMLDivElement>(null);
  const firstGroup = useRef<HTMLDivElement>(null);
  const interacting = useRef(false);
  const resumeAt = useRef(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPlaying(!motion.matches);
    update();
    motion.addEventListener('change', update);
    return () => motion.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const element = viewport.current;
    const group = firstGroup.current;
    if (!element || !group) return;
    let width = group.getBoundingClientRect().width;
    element.scrollLeft = width;
    const resize = new ResizeObserver(() => {
      const nextWidth = group.getBoundingClientRect().width;
      if (width > 0) element.scrollLeft = (element.scrollLeft / width) * nextWidth;
      width = nextWidth;
    });
    resize.observe(group);
    const wrap = () => {
      if (!width) return;
      if (element.scrollLeft < width / 2) element.scrollLeft += width;
      else if (element.scrollLeft >= width * 2.5) element.scrollLeft -= width;
    };
    element.addEventListener('scroll', wrap, { passive: true });
    return () => {
      resize.disconnect();
      element.removeEventListener('scroll', wrap);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    let frame: number;
    let previous = 0;
    let carry = 0;
    const step = (now: number) => {
      const elapsed = previous ? Math.min(now - previous, 50) : 0;
      previous = now;
      const element = viewport.current;
      if (element && !document.hidden && !interacting.current && now >= resumeAt.current) {
        carry += elapsed * 0.018;
        if (carry >= 1) {
          const pixels = Math.floor(carry);
          element.scrollLeft += pixels;
          carry -= pixels;
        }
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  function move(direction: number) {
    const element = viewport.current;
    if (!element) return;
    resumeAt.current = performance.now() + 4000;
    element.scrollBy({
      left: direction * 280,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  }

  if (!reading.books.length) return null;

  return (
    <section
      className="mt-8 w-full max-w-2xl min-w-0 border-t border-black/[.08] pt-7 dark:border-white/[.145]"
      aria-labelledby="reading-heading"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3
            id="reading-heading"
            className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
          >
            Reading
          </h3>
          <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            {reading.books.length} books read
            <span className="mt-1 block text-[11px]">
              Last synced:{' '}
              <time dateTime={reading.syncedAt}>
                {new Intl.DateTimeFormat('en-GB', {
                  timeZone: 'Asia/Tokyo',
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hourCycle: 'h23',
                }).format(new Date(reading.syncedAt))}{' '}
                JST
              </time>
            </span>
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Previous books"
            onClick={() => move(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[.08] hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.06]"
          >
            ←
          </button>
          <button
            type="button"
            aria-label={playing ? 'Pause automatic scrolling' : 'Start automatic scrolling'}
            aria-pressed={playing}
            onClick={() => setPlaying(!playing)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[.08] text-xs hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.06]"
          >
            {playing ? 'Ⅱ' : '▶'}
          </button>
          <button
            type="button"
            aria-label="Next books"
            onClick={() => move(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[.08] hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.06]"
          >
            →
          </button>
        </div>
      </div>
      <div
        ref={viewport}
        className="reading-shelf overflow-x-auto overscroll-x-contain"
        tabIndex={0}
        role="region"
        aria-label="Finished books; scroll horizontally to explore"
        onMouseEnter={() => {
          interacting.current = true;
        }}
        onMouseLeave={() => {
          interacting.current = false;
        }}
        onFocusCapture={() => {
          interacting.current = true;
        }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) interacting.current = false;
        }}
        onTouchStart={() => {
          resumeAt.current = Infinity;
        }}
        onTouchEnd={() => {
          resumeAt.current = performance.now() + 4000;
        }}
        onTouchCancel={() => {
          resumeAt.current = performance.now() + 4000;
        }}
        onWheel={() => {
          resumeAt.current = performance.now() + 4000;
        }}
      >
        <div className="flex w-max py-2">
          {[0, 1, 2].map((copy) => (
            <div
              key={copy}
              ref={copy === 0 ? firstGroup : undefined}
              className="flex shrink-0 gap-6 pr-6"
              aria-hidden={copy !== 1 ? true : undefined}
            >
              {reading.books.map((book) => {
                const content = (
                  <>
                    <BookCover cover={book.cover} title={book.title} />
                    <h4
                      className="mt-3 line-clamp-2 text-xs font-medium leading-relaxed"
                      title={book.title}
                    >
                      {book.title}
                    </h4>
                    <p
                      className="mt-1 truncate text-[11px] text-gray-500 dark:text-gray-400"
                      title={book.author}
                    >
                      {book.author}
                    </p>
                  </>
                );
                return book.url ? (
                  <a
                    key={book.id}
                    href={book.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={copy === 1 ? 0 : -1}
                    className="block w-[104px] shrink-0 transition-transform hover:-translate-y-1 motion-reduce:transform-none sm:w-[120px]"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={book.id} className="w-[104px] shrink-0 sm:w-[120px]">
                    {content}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-[11px] text-gray-400 dark:text-gray-500">
        Swipe to explore · Source: WeRead
      </p>
    </section>
  );
}
