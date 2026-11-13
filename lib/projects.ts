import media from '@/content/media.json';
import { projects, type Project, type ProjectText } from '@/content/projects';
import type { Locale } from './i18n';

export type Media = { src: string; width: number; height: number };

const sizes: Record<string, number[]> = media;

/** An image from public/work with its intrinsic size, so the page can reserve its space. */
export function image(name: string): Media {
  const size = sizes[name];
  const [width, height] = size ?? [];
  if (!width || !height) throw new Error(`Missing image public/work/${name}.webp`);
  return { src: `/work/${name}.webp`, width, height };
}

export const listedProjects = projects.filter((p) => p.listed);
export const featuredProjects = projects.filter((p) => p.scene);
export const openSourceProjects = projects.filter((p) => p.kinds.includes('open-source') && !p.scene);
export const archiveProjects = projects.filter((p) => p.listed && !p.scene && !p.kinds.includes('open-source'));

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function textOf(project: Project, locale: Locale): ProjectText {
  return project.text[locale];
}

/** The next listed project, wrapping round, for "next project" links. */
export function nextProject(slug: string): Project {
  const i = listedProjects.findIndex((p) => p.slug === slug);
  return listedProjects[(i + 1) % listedProjects.length]!;
}

export { projects };
export type { Project };
