import type { ImageMetadata } from 'astro';
import type { Project } from './projects';

// Every image in src/assets/works, by file name, so data files can refer to them as plain strings.
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/works/*.{jpg,png}', { eager: true });
const byName = new Map(Object.entries(files).map(([p, m]) => [p.split('/').pop()!, m.default]));

export function workImage(name: string): ImageMetadata {
  const img = byName.get(name);
  if (!img) throw new Error(`Missing image src/assets/works/${name}`);
  return img;
}

/** The largest picture a project has, for cards: a gallery shot, then the case-study banner, then the old thumbnail. */
export function cover(project: Project): ImageMetadata {
  const img = maybeCover(project);
  if (!img) throw new Error(`Project ${project.slug} has no image`);
  return img;
}

export function maybeCover(project: Project): ImageMetadata | undefined {
  const name = project.gallery?.[0] ?? project.page?.hero ?? project.thumb;
  return name ? workImage(name) : undefined;
}

/** Shared by a card's picture and the case-study hero, so the browser can morph one into the other. */
export const transitionName = (project: Project) => `work-${project.slug}`;
