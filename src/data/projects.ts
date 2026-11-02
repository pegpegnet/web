import type { MessageKey } from '../i18n';

export type Category = 'app' | 'web' | 'game';

/** A block of a project's case-study page. `key` values are translation keys. */
export type Block =
  | { type: 'h2' | 'h3' | 'p'; key: MessageKey }
  | { type: 'list'; keys: MessageKey[] }
  | { type: 'image'; src: string; alt: string }
  | { type: 'video'; youtube: string; titleKey: MessageKey }
  | { type: 'link'; href: string; key: MessageKey }
  | { type: 'press'; items: { name: string; href: string }[] };

export interface Project {
  /** URL segment, identical in every language: /es/proyectos/<slug>/ */
  slug: string;
  /** Title shown on cards. Either a translation key or a literal brand name. */
  title: { key: MessageKey } | { text: string };
  summaryKey: MessageKey;
  categories: Category[];
  /** File name in src/assets/works, used for the card. */
  thumb: string;
  /** Hidden projects have a page (old URLs keep working) but no card in the grid. */
  listed: boolean;
  /** Case-study page. Projects without one open their gallery instead. */
  page?: { titleKey: MessageKey; hero?: string; blocks: Block[] };
  gallery?: string[];
  year?: number;
}

const p = (key: MessageKey): Block => ({ type: 'p', key });
const h2 = (key: MessageKey): Block => ({ type: 'h2', key });

export const projects: Project[] = [
  {
    slug: 'telegram-bot-instagram-preview',
    title: { text: 'Socialpreviewbot' },
    summaryKey: 'instacaptionbot-project-desc',
    categories: ['app'],
    thumb: 'bot-300.jpg',
    listed: true,
    page: {
      titleKey: 'instacaptionbot-title',
      hero: 'bot-top.jpg',
      blocks: [
        h2('instacaptionbot-description-title'),
        p('instacaptionbot-description-1'),
        h2('instacaptionbot-features-title'),
        {
          type: 'list',
          keys: [
            'instacaptionbot-features-1',
            'instacaptionbot-features-2',
            'instacaptionbot-features-3',
            'instacaptionbot-features-4',
            'instacaptionbot-features-5',
          ],
        },
        h2('instacaptionbot-tech-title'),
        p('instacaptionbot-tech-desc'),
        h2('instacaptionbot-business-title'),
        p('instacaptionbot-business-desc'),
        { type: 'link', href: 'https://t.me/socialpreviewbot', key: 'instacaptionbot-cta' },
      ],
    },
  },
  {
    slug: 'app-visionos-yutub',
    title: { key: 'yutub-title-proyectos' },
    summaryKey: 'yutub-desc-proyectos',
    categories: ['app'],
    thumb: 'vision-youtube-300.jpg',
    listed: true,
    page: {
      titleKey: 'yutub-title-long',
      hero: 'yutub-top.jpg',
      blocks: [
        h2('yutub-description-title'),
        p('yutub-description'),
        p('yutub-tech-desc'),
        h2('yutub-features-title'),
        {
          type: 'list',
          keys: ['yutub-feature-1', 'yutub-feature-2', 'yutub-feature-3', 'yutub-feature-4', 'yutub-feature-5', 'yutub-feature-6'],
        },
        h2('yutub-opensource'),
        p('yutub-opensource-desc'),
        { type: 'link', href: 'https://github.com/pballada/yutub', key: 'yutub-opensource' },
        { type: 'image', src: 'yutub-capture.jpg', alt: 'Yutub' },
      ],
    },
  },
  {
    slug: 'app-iphone-pong',
    title: { key: 'pong-title-proyectos' },
    summaryKey: 'pong-desc-proyectos',
    categories: ['app', 'game'],
    thumb: 'pong-300.jpg',
    listed: true,
    page: {
      titleKey: 'retropong-title',
      hero: 'pong-top.jpg',
      blocks: [
        h2('retropong-context-title'),
        p('retropong-context'),
        p('retropong-development'),
        h2('retropong-game-title'),
        { type: 'image', src: 'pong-capture.png', alt: 'RetroPong' },
        p('retropong-game'),
        p('retropong-modes'),
        { type: 'video', youtube: '9_xsibeqIqM', titleKey: 'retropong-video-title' },
        p('retropong-video-desc'),
      ],
    },
  },
  {
    slug: 'app-iphone-sumophoto',
    title: { key: 'sumophoto-title-proyectos' },
    summaryKey: 'sumophoto-desc-proyectos',
    categories: ['app'],
    thumb: 'sumo-300.jpg',
    listed: true,
    page: {
      titleKey: 'sumophoto-title',
      hero: 'sumo-top.jpg',
      blocks: [
        h2('sumophoto-description-title'),
        p('sumophoto-description'),
        p('sumophoto-team'),
        p('sumophoto-available'),
        { type: 'image', src: 'sumo-capture.png', alt: 'SumoPhoto' },
      ],
    },
  },
  {
    slug: 'app-iphone-ipad-microsite',
    title: { key: 'niessen-title-proyectos' },
    summaryKey: 'niessen-desc-proyectos',
    categories: ['app'],
    thumb: 'niessen-300.jpg',
    listed: true,
    page: {
      titleKey: 'niessen-title',
      hero: 'niessen-top.jpg',
      blocks: [
        h2('niessen-description-title'),
        p('niessen-description-1'),
        p('niessen-description-2'),
        p('niessen-description-3'),
        { type: 'image', src: 'niessen-capture.png', alt: 'Niessen' },
      ],
    },
  },
  {
    slug: 'gestor-de-contenidos-administrador',
    title: { key: 'gestor-title-proyectos' },
    summaryKey: 'gestor-desc-proyectos',
    categories: ['web'],
    thumb: 'admin-300.jpg',
    listed: true,
    page: {
      titleKey: 'gestor-title',
      hero: 'gestor-top.jpg',
      blocks: [
        h2('gestor-description-title'),
        p('gestor-description-1'),
        p('gestor-description-2'),
        { type: 'image', src: 'gestor-capture.png', alt: 'Content manager' },
      ],
    },
  },
  {
    slug: 'app-iphone-futbol-club-barcelona-zigazaga',
    title: { key: 'zigazaga-title-proyectos' },
    summaryKey: 'zigazaga-desc-proyectos',
    categories: ['app'],
    thumb: 'zigazaga-300.jpg',
    listed: true,
    page: {
      titleKey: 'zigazaga-title',
      hero: 'zigazaga-top.jpg',
      blocks: [
        h2('zigazaga-description-title'),
        p('zigazaga-description-1'),
        p('zigazaga-description-2'),
        p('zigazaga-description-3'),
        { type: 'image', src: 'zigazaga-capture.png', alt: 'ZigaZaga' },
      ],
    },
  },
  {
    slug: 'app-iphone-tv3',
    title: { key: 'tv3-title-proyectos' },
    summaryKey: 'tv3-desc-proyectos',
    categories: ['app'],
    thumb: 'tv3-300.jpg',
    listed: true,
    page: {
      titleKey: 'tv3-title',
      hero: 'tv3-top.jpg',
      blocks: [
        h2('tv3-description-title'),
        p('tv3-description-1'),
        p('tv3-description-2'),
        p('tv3-description-3'),
        { type: 'image', src: 'tv3-capture.png', alt: 'TV3' },
      ],
    },
  },
  {
    slug: 'crackovia',
    title: { key: 'crackovia-title-proyectos' },
    summaryKey: 'crackovia-desc-proyectos',
    categories: ['app'],
    thumb: 'crackovia-300.jpg',
    listed: true,
    gallery: ['crackovia-1.jpg'],
  },
  {
    slug: 'app-iphone-bac',
    title: { key: 'novoypedo-title-proyectos' },
    summaryKey: 'novoypedo-desc-proyectos',
    categories: ['app'],
    thumb: 'novoypedo-300.jpg',
    listed: true,
    page: {
      titleKey: 'novoypedo-title',
      hero: 'novoypedo-top.jpg',
      blocks: [
        h2('novoypedo-description-title'),
        p('novoypedo-description-1'),
        p('novoypedo-description-2'),
        p('novoypedo-description-3'),
        { type: 'image', src: 'novoypedo-capture.png', alt: 'NoVoyPedo' },
      ],
    },
  },
  {
    slug: 'probrowser',
    title: { key: 'probrowser-title-proyectos' },
    summaryKey: 'probrowser-desc-proyectos',
    categories: ['app'],
    thumb: 'pro-300.jpg',
    listed: true,
    gallery: ['probrowser-1.jpg'],
  },
  {
    slug: 'youtube-mix-videos',
    title: { key: 'mixmastertube-title-proyectos' },
    summaryKey: 'mixmastertube-desc-proyectos',
    categories: ['web'],
    thumb: 'mixmaster-300.jpg',
    listed: true,
    page: {
      titleKey: 'mixmastertube-title',
      hero: 'mixmaster-top.jpg',
      blocks: [
        h2('mixmastertube-description-title'),
        p('mixmastertube-description'),
        p('mixmastertube-press'),
        {
          type: 'press',
          items: [
            { name: 'Microsiervos', href: 'https://www.microsiervos.com/archivo/musica/mixmastertube-djs-youtube.html' },
            { name: 'Sicrono', href: 'https://sicrono.com/internet/crear-listas-y-mezclar-musica-con-videos-de-youtube/' },
            { name: 'Culpinak', href: 'https://culpinak.blogspot.com.es/2008/07/aparece-el-dj-mix-de-youtube.html' },
            { name: 'Tuexperto', href: 'https://www.tuexperto.com/2008/11/29/mixmaster-tube-mezcla-tus-videos-musicales/' },
          ],
        },
        p('mixmastertube-users'),
        { type: 'link', href: 'https://www.mixmastertube.com', key: 'mixmastertube-link' },
        { type: 'image', src: 'mixmaster-capture.jpg', alt: 'MixMasterTube' },
        { type: 'video', youtube: 'lQNZzbK3S1s', titleKey: 'mixmastertube-video-title' },
      ],
    },
  },
  {
    slug: 'air-guitar',
    title: { key: 'airguitar-title-proyectos' },
    summaryKey: 'airguitar-desc-proyectos',
    categories: ['web'],
    thumb: 'air-300.jpg',
    listed: true,
    gallery: ['air-1.jpg', 'air-2.jpg'],
  },
  {
    slug: 'tmb',
    title: { key: 'tmb-title-proyectos' },
    summaryKey: 'tmb-desc-proyectos',
    categories: ['web', 'game'],
    thumb: 'tmb-300.jpg',
    listed: true,
    gallery: ['tmb-1.jpg', 'tmb-2.jpg', 'tmb-3.jpg'],
  },
  {
    slug: 'cruzcampo',
    title: { key: 'juegocruzcampo-title-proyectos' },
    summaryKey: 'juegocruzcampo-desc-proyectos',
    categories: ['web', 'game'],
    thumb: 'cruzcampo-300.jpg',
    listed: true,
    gallery: ['cruzcampo-1.jpg', 'cruzcampo-2.jpg', 'cruzcampo-3.jpg'],
  },
  {
    slug: 'mattel-pixelchix',
    title: { key: 'mattel-title-proyectos' },
    summaryKey: 'mattel-desc-proyectos',
    categories: ['web'],
    thumb: 'pixel-300.jpg',
    listed: true,
    gallery: ['pixel-1.jpg', 'pixel-2.jpg'],
  },
  {
    slug: 'caravana-donettes',
    title: { key: 'donettes-title-proyectos' },
    summaryKey: 'donettes-desc-proyectos',
    categories: ['web'],
    thumb: 'donettes-300.jpg',
    listed: true,
    gallery: ['donettes-1.jpg', 'donettes-2.jpg', 'donettes-3.jpg'],
  },
  {
    slug: 'aplicacion-iphone-ahorro-scrush',
    title: { key: 'scrush-title' },
    summaryKey: 'finappsparty',
    categories: ['app'],
    thumb: '',
    listed: false,
    page: {
      titleKey: 'scrush-title',
      blocks: [
        h2('scrush-context-title'),
        p('scrush-context-1'),
        p('scrush-context-2'),
        h2('scrush-app-title'),
        p('scrush-app-1'),
        p('scrush-app-2'),
        p('scrush-app-3'),
        p('scrush-app-4'),
        { type: 'video', youtube: 'RFBQKFvjLcE', titleKey: 'scrush-video-title' },
        p('scrush-video-desc'),
      ],
    },
  },
];

export const listedProjects = projects.filter((x) => x.listed);
