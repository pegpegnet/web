/**
 * Scroll choreography for every page.
 *
 *   data-reveal="lines"  headline: each line rises out of a mask, staggered
 *   data-reveal="up"     block: fades up a short distance
 *   data-reveal-now      run on load instead of when scrolled into view (above the fold)
 *
 * Elements are only hidden when <html> carries the `motion` class, which the inline script in
 * Base.astro adds when motion is allowed. If this module fails to load, that script's failsafe
 * removes the class again, so content is never left invisible.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const EASE = 'expo.out';
const root = document.documentElement;

function trigger(el: Element, now: boolean): ScrollTrigger.Vars | undefined {
  return now ? undefined : { trigger: el, start: 'top 88%', once: true };
}

function revealLines(el: HTMLElement) {
  const now = el.hasAttribute('data-reveal-now');
  SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    autoSplit: true, // re-split after web fonts load and on resize, so line breaks stay right
    onSplit(self) {
      gsap.set(el, { autoAlpha: 1 });
      return gsap.from(self.lines, {
        yPercent: 110,
        duration: 1.1,
        ease: EASE,
        stagger: 0.09,
        delay: now ? 0.15 : 0,
        scrollTrigger: trigger(el, now),
      });
    },
  });
}

function revealUp(el: HTMLElement) {
  const now = el.hasAttribute('data-reveal-now');
  gsap.fromTo(
    el,
    { autoAlpha: 0, y: 28 },
    { autoAlpha: 1, y: 0, duration: 0.9, ease: EASE, delay: now ? 0.45 : 0, scrollTrigger: trigger(el, now) },
  );
}

function init() {
  if (!root.classList.contains('motion')) return; // reduced motion: everything is already visible

  for (const el of document.querySelectorAll<HTMLElement>('[data-reveal]')) {
    if (el.dataset.reveal === 'lines') revealLines(el);
    else revealUp(el);
  }
  root.classList.add('motion-ready');
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();
