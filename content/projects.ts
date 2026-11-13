/**
 * PegPeg's projects. Everything here is real: the descriptions come from the previous pegpeg.net
 * and from the projects' own READMEs. No invented clients, numbers, awards or quotes.
 *
 * Images are file names in public/work (without .webp); their sizes live in content/media.json.
 * Text is per language; the build fails if a language is missing.
 */
import type { Locale } from '../lib/i18n';
import { es } from './projects.es.ts';
import { ca } from './projects.ca.ts';

export type Kind = 'app' | 'web' | 'game' | 'open-source';

/** Projects with their own interactive scene in the Selected Work section. */
export type SceneId = 'yutub' | 'socialpreview' | 'retropong' | 'mixmaster';

export type Section = { heading: string; body: string[]; list?: string[] };

export type ProjectText = {
  name: string;
  /** One line, used on cards and as the page description. */
  summary: string;
  sections: Section[];
};

export type Link = { label: Record<Locale, string>; href: string };

export type Project = {
  slug: string;
  kinds: Kind[];
  year?: number;
  platforms: string[];
  /** The project's own colours, used for its chapter and page. */
  theme: { bg: string; fg: string; accent: string };
  /** Main picture; a few old projects have none. */
  cover?: string;
  gallery: string[];
  links: Link[];
  youtube?: string;
  press?: { name: string; href: string }[];
  scene?: SceneId;
  repo?: string;
  /** Hidden projects keep their page (old links work) but are not listed. */
  listed: boolean;
  text: Record<Locale, ProjectText>;
};

const github = (repo: string): Link => ({
  label: { en: 'Source on GitHub', es: 'Código en GitHub', ca: 'Codi a GitHub' },
  href: `https://github.com/${repo}`,
});
const downloadLabel = { en: 'Download for Mac', es: 'Descargar para Mac', ca: 'Descarrega per a Mac' };

/** As written below: English inline; Spanish and Catalan come from projects.es.ts and projects.ca.ts. */
type Draft = Omit<Project, 'text'> & { text: { en: ProjectText } };

const drafts: Draft[] = [
  // Selected work: each has its own scene on the home page.
  {
    slug: 'app-visionos-yutub',
    kinds: ['app', 'open-source'],
    year: 2024,
    platforms: ['visionOS'],
    theme: { bg: '#dfe2ea', fg: '#161719', accent: '#ff3b2f' },
    cover: 'yutub-top',
    gallery: ['yutub-screenshot', 'yutub-capture'],
    links: [github('pballada/yutub')],
    scene: 'yutub',
    repo: 'pballada/yutub',
    listed: true,
    text: {
      en: {
        name: 'Yutub',
        summary: 'An immersive YouTube experience for Apple Vision Pro.',
        sections: [
          {
            heading: 'YouTube, made for visionOS',
            body: [
              'Yutub is a lightweight YouTube client built with SwiftUI and WebKit and tuned for visionOS. It gives Apple Vision Pro owners a native way to browse YouTube, with controls and customisations the browser version doesn’t have.',
            ],
          },
          {
            heading: 'What it adds',
            body: [],
            list: [
              'Tabs to switch between Home, Watch Later, Subscriptions and History',
              'Custom video controls that make play, pause, previous and next hard to miss',
              'A bigger progress-bar thumb, easier to grab in space',
              'Dark mode and autoplay control across every tab',
              'A native settings panel',
            ],
          },
          {
            heading: 'Open source',
            body: ['The whole app is on GitHub, with instructions to install it without a developer account.'],
          },
        ],
      },
    },
  },
  {
    slug: 'telegram-bot-instagram-preview',
    kinds: ['app'],
    platforms: ['Telegram'],
    theme: { bg: '#f3dbe9', fg: '#161719', accent: '#c4268a' },
    cover: 'bot-top',
    gallery: ['bg-bot', 'telegram-bot'],
    links: [
      {
        label: { en: 'Try @socialpreviewbot on Telegram', es: 'Prueba @socialpreviewbot en Telegram', ca: 'Prova @socialpreviewbot a Telegram' },
        href: 'https://t.me/socialpreviewbot',
      },
    ],
    scene: 'socialpreview',
    listed: true,
    text: {
      en: {
        name: 'Socialpreviewbot',
        summary: 'A Telegram bot that generates previews for Instagram links.',
        sections: [
          {
            heading: 'The problem',
            body: [
              'Instagram links don’t preview properly inside Telegram. Socialpreviewbot fixes that: it shows posts, stories and reels right in the chat, so nobody has to leave the conversation to open Instagram.',
            ],
          },
          {
            heading: 'Features',
            body: [],
            list: [
              'Instant previews of Instagram content',
              'Posts, stories and reels',
              'Works in private chats and groups',
              'Monthly and annual subscriptions',
              'An admin panel to manage subscriptions',
            ],
          },
          {
            heading: 'How it’s built',
            body: [
              'Built entirely in-house on the official Telegram Bot API, with a caching layer that keeps it fast and light on the server. It runs on a freemium model: free to try with limits, with everything unlocked by a monthly or annual subscription.',
            ],
          },
        ],
      },
    },
  },
  {
    slug: 'app-iphone-pong',
    kinds: ['app', 'game'],
    platforms: ['iPhone', 'iPad'],
    theme: { bg: '#0c160d', fg: '#d9ffdc', accent: '#3dff6e' },
    cover: 'pong-top',
    gallery: ['pong-capture', 'pong-ipad', 'pong-iphone', 'pong-box'],
    links: [],
    youtube: '9_xsibeqIqM',
    scene: 'retropong',
    listed: true,
    text: {
      en: {
        name: 'RetroPong',
        summary: 'A modern iOS take on Atari’s classic Pong.',
        sections: [
          {
            heading: 'An Atari contest',
            body: [
              'Atari ran an international contest to create the new version of Pong for iOS. More than a hundred teams entered; we passed two selection rounds and were chosen as finalists, which meant publication under the Atari brand.',
            ],
          },
          {
            heading: 'The game',
            body: [
              'RetroPong was made for iPhone and iPad. Beyond one and two players, the iPad version lets three or four people play at once.',
              'It has three modes: a story mode that takes you through levels, a battle mode to play remotely against others, and a multiplayer mode for up to four people on one screen.',
            ],
          },
        ],
      },
    },
  },
  {
    slug: 'youtube-mix-videos',
    kinds: ['web'],
    year: 2009,
    platforms: ['Web'],
    theme: { bg: '#12161b', fg: '#efece5', accent: '#ffb31a' },
    cover: 'mixmaster-top',
    gallery: ['mixmaster-capture'],
    links: [],
    youtube: 'lQNZzbK3S1s',
    press: [
      { name: 'Microsiervos', href: 'https://www.microsiervos.com/archivo/musica/mixmastertube-djs-youtube.html' },
      { name: 'Sicrono', href: 'https://sicrono.com/internet/crear-listas-y-mezclar-musica-con-videos-de-youtube/' },
      { name: 'Culpinak', href: 'https://culpinak.blogspot.com.es/2008/07/aparece-el-dj-mix-de-youtube.html' },
      { name: 'Tuexperto', href: 'https://www.tuexperto.com/2008/11/29/mixmaster-tube-mezcla-tus-videos-musicales/' },
    ],
    scene: 'mixmaster',
    listed: true,
    text: {
      en: {
        name: 'MixMasterTube',
        summary: 'A web app for mixing YouTube videos like a DJ.',
        sections: [
          {
            heading: 'Two decks, one crossfader',
            body: [
              'MixMasterTube treated YouTube music videos as DJ tracks: load one on each deck and crossfade between them. People could import their YouTube playlists, publish them for others, or build new ones on the site.',
            ],
          },
          {
            heading: 'What happened next',
            body: [
              'The launch was picked up by the press, and many people signed up and shared their playlists. A year later Spotify arrived and changed how people listened, and YouTube’s restrictions on music videos led us to put the project on hold.',
            ],
          },
        ],
      },
    },
  },

  // Open source for the Mac.
  {
    slug: 'abadia',
    kinds: ['app', 'game', 'open-source'],
    year: 2026,
    platforms: ['macOS'],
    theme: { bg: '#1f1712', fg: '#f2e7d0', accent: '#c9a764' },
    cover: 'abadia-remake',
    gallery: ['abadia-amstrad', 'abadia-icon'],
    links: [
      github('pballada/abadia'),
      { label: downloadLabel, href: 'https://github.com/pballada/abadia/releases/latest' },
    ],
    repo: 'pballada/abadia',
    listed: true,
    text: {
      en: {
        name: 'La abadía del crimen',
        summary: 'The 1987 Spanish classic, inspired by The Name of the Rose, as a native Mac app.',
        sections: [
          {
            heading: 'A mystery in seven days, on today’s Macs',
            body: [
              'La abadía del crimen, by Paco Menéndez and Juan Delcán, is one of the best-loved Spanish games of the 8-bit era. This version gives it a native home on macOS: a universal app for Apple silicon and Intel, signed and notarized by Apple, that keeps itself up to date.',
            ],
          },
          {
            heading: 'Two ways to see the abbey',
            body: ['Play with the 256-colour remake graphics, or switch to the original 1987 Amstrad CPC look with one menu command.'],
          },
          {
            heading: 'Preservation, done carefully',
            body: [
              'The app ships with no game data. When you ask, it downloads the original files (about 6 MB) from the Abbey project and checks every one. It’s a noncommercial project that builds on the C++ reconstruction by Manuel Abadía and the VIGASOCO team, Luzbel’s SDL adaptation, Antonio Giner’s remake graphics and the Abbey project.',
            ],
          },
        ],
      },
    },
  },
  {
    slug: 'shinymac',
    kinds: ['app', 'open-source'],
    year: 2026,
    platforms: ['macOS'],
    theme: { bg: '#1b1233', fg: '#f4efff', accent: '#c77dff' },
    cover: 'shinymac-smartcare',
    gallery: ['shinymac-uninstaller', 'shinymac-welcome', 'shinymac-icon'],
    links: [
      github('pballada/shinyMac'),
      { label: downloadLabel, href: 'https://github.com/pballada/shinyMac/releases/latest' },
    ],
    repo: 'pballada/shinyMac',
    listed: true,
    text: {
      en: {
        name: 'ShinyMac',
        summary: 'A free, open-source Mac cleaner with a native SwiftUI interface.',
        sections: [
          {
            heading: 'Keep a Mac clean and fast',
            body: [
              'ShinyMac cleans junk, uninstalls apps completely and keeps a Mac fast. Smart Care does it in one scan and one click: it removes system junk, empties the Trash and runs speed-up tasks, then points out updates, leftovers and large files worth a look.',
            ],
          },
          {
            heading: 'What it cleans',
            body: [],
            list: [
              'User caches and logs, Xcode DerivedData and simulators, and package-manager caches',
              'Large, long-unused files downloaded from iCloud Drive, Dropbox, Google Drive and other cloud services',
              'Apps, removed together with everything they left behind',
            ],
          },
          {
            heading: 'Native, free and private',
            body: [
              'Written in Swift and SwiftUI for macOS, with animated aurora backgrounds and Liquid Glass. Free and open source under the MIT licence, with no account and no telemetry. It also installs with Homebrew.',
            ],
          },
        ],
      },
    },
  },
  {
    slug: 'forest',
    kinds: ['app', 'open-source'],
    year: 2026,
    platforms: ['macOS'],
    theme: { bg: '#0f1c15', fg: '#e6f5ec', accent: '#3fbf75' },
    cover: 'forest-workspace',
    gallery: ['forest-changes', 'forest-review', 'forest-icon'],
    links: [
      github('pballada/forest'),
      { label: downloadLabel, href: 'https://github.com/pballada/forest/releases/latest' },
    ],
    repo: 'pballada/forest',
    listed: true,
    text: {
      en: {
        name: 'Forest',
        summary: 'One Mac window for your coding agents: their terminals, their changes and a native Git client.',
        sections: [
          {
            heading: 'Why we built it',
            body: [
              'Running several coding agents usually means a terminal tab per worktree, a Git app somewhere else and a diff tool on top. Forest puts them in one place, for Claude Code, Codex, Gemini CLI or any custom command.',
            ],
          },
          {
            heading: 'One window, three columns',
            body: [],
            list: [
              'Projects, their worktrees and each agent’s sessions, with a live sign of what every agent is doing and which ones are waiting for you',
              'A real Ghostty terminal per worktree, GPU-rendered, that keeps running while you switch',
              'Files appearing as the agent writes them, with Review and Merge one click away',
            ],
          },
          {
            heading: 'Made for the Mac',
            body: ['Written in Swift, native on Apple silicon, notarized and MIT licensed.'],
          },
        ],
      },
    },
  },

  // Client and studio work from earlier years.
  {
    slug: 'app-iphone-tv3',
    kinds: ['app'],
    platforms: ['iPhone'],
    theme: { bg: '#e7ecf3', fg: '#161719', accent: '#1d4fa3' },
    cover: 'tv3-top',
    gallery: ['tv3-capture'],
    links: [],
    listed: true,
    text: {
      en: {
        name: 'TV3 App',
        summary: 'The first official iPhone app for TV3.',
        sections: [
          {
            heading: 'Live television on a phone',
            body: [
              'Televisió de Catalunya asked us to design and build TV3’s first official iPhone app: bring in the information from their website and show their live video channels.',
              'It was the first mobile app in the Spanish market to offer live television. A later version of the app was made by another team.',
            ],
          },
        ],
      },
    },
  },
  {
    slug: 'app-iphone-futbol-club-barcelona-zigazaga',
    kinds: ['app'],
    platforms: ['iPhone'],
    theme: { bg: '#f0e6e9', fg: '#161719', accent: '#a50044' },
    cover: 'zigazaga-top',
    gallery: ['zigazaga-capture'],
    links: [],
    listed: true,
    text: {
      en: {
        name: 'ZigaZaga',
        summary: 'A studio app with FC Barcelona’s best moments.',
        sections: [
          {
            heading: 'Barça’s best moments',
            body: [
              'An unofficial app we designed and built for Barça fans, collecting some of the best moments of recent seasons from YouTube. It was free; because the videos were linked straight from YouTube, some of them may no longer play.',
            ],
          },
        ],
      },
    },
  },
  {
    slug: 'app-iphone-sumophoto',
    kinds: ['app'],
    platforms: ['iPhone'],
    theme: { bg: '#f4e9d8', fg: '#161719', accent: '#d6452c' },
    cover: 'sumo-top',
    gallery: ['sumo-capture'],
    links: [],
    listed: true,
    text: {
      en: {
        name: 'SumoPhoto',
        summary: 'A photo contest app of our own, from before Instagram.',
        sections: [
          {
            heading: 'Photos, in a sumo ring',
            body: [
              'SumoPhoto let people compete with their photos in set categories, before Instagram took off. To make it easy to see a lot of photos, it works like a sumo bout: two photos face each other and you pick the winner, again and again.',
              'Everything was made by our team, from the idea to the design and the code. Illustrations by Marc Mallafré, interface design by Marc Aguiló.',
            ],
          },
        ],
      },
    },
  },
  {
    slug: 'app-iphone-ipad-microsite',
    kinds: ['app', 'web'],
    platforms: ['iPhone', 'iPad', 'Android', 'Web'],
    theme: { bg: '#e9ecef', fg: '#161719', accent: '#e2001a' },
    cover: 'niessen-top',
    gallery: ['niessen-capture'],
    links: [],
    listed: true,
    text: {
      en: {
        name: 'Niessen',
        summary: 'An app for iPhone, iPad and Android, and a mobile microsite.',
        sections: [
          {
            heading: 'Try a switch on your own wall',
            body: [
              'We made an iPhone and iPad app, a special Android version and a responsive microsite for desktop, TV and tablet. The app shows Niessen’s ranges of switches and lets you try combinations, then place a switch on any wall through the camera to see how it would look installed.',
            ],
          },
        ],
      },
    },
  },
  {
    slug: 'app-iphone-bac',
    kinds: ['app'],
    platforms: ['iPhone'],
    theme: { bg: '#e3efe9', fg: '#161719', accent: '#1f8a5b' },
    cover: 'novoypedo-top',
    gallery: ['novoypedo-capture'],
    links: [],
    listed: true,
    text: {
      en: {
        name: 'NoVoyPedo',
        summary: 'An iPhone breathalyser you have to blow into.',
        sections: [
          {
            heading: 'Blow to see the result',
            body: [
              'A studio app that simulates a breathalyser. You enter how many drinks you’ve had and over how long, and it estimates your blood alcohol level from that and your weight.',
              'What set it apart: to see the result you have to blow at the iPhone, just like a real device. It was translated into more than six languages and appeared several times among the ten most downloaded apps.',
            ],
          },
        ],
      },
    },
  },
  {
    slug: 'gestor-de-contenidos-administrador',
    kinds: ['web'],
    platforms: ['Web'],
    theme: { bg: '#eceae6', fg: '#161719', accent: '#2b3bff' },
    cover: 'gestor-top',
    gallery: ['gestor-capture'],
    links: [],
    listed: true,
    text: {
      en: {
        name: 'Content manager',
        summary: 'Our own content manager, built for clients who update their sites themselves.',
        sections: [
          {
            heading: 'Built because nothing fitted',
            body: [
              'Clients kept asking to update their websites on their own. The managers we tried didn’t meet their needs, so we built one.',
              'It’s configured for each project and client, and includes statistics, multiple profiles and users, notifications, global search, word-processor-style editing, file uploads, image scaling and export to Excel.',
            ],
          },
        ],
      },
    },
  },
  ...(
    [
      ['crackovia', 'Crackòvia', 'An iPhone app for TV3’s show Crackòvia.', ['iPhone'], ['app'], 'crackovia-1', [], '#e8eef6', '#c8102e'],
      ['probrowser', 'ProBrowser', 'A studio browser that emulates Internet Explorer.', [], ['app'], 'probrowser-1', [], '#e6eef7', '#1e6fd9'],
      ['air-guitar', 'Air Guitar', 'The website for the Air Guitar Barcelona event.', ['Web'], ['web'], 'air-1', ['air-2'], '#f0e7dc', '#e04e1b'],
      ['tmb', 'TMB', 'A game for the Swimming World Championships.', ['Web'], ['web', 'game'], 'tmb-1', ['tmb-2', 'tmb-3'], '#e2f1f8', '#0078c1'],
      ['cruzcampo', 'Cruzcampo game', 'A game for Cruzcampo.', ['Web'], ['web', 'game'], 'cruzcampo-1', ['cruzcampo-2', 'cruzcampo-3'], '#f3e3df', '#b5121b'],
      ['mattel-pixelchix', 'Mattel Pixel Chix', 'The website for Mattel’s Pixel Chix toy.', ['Web'], ['web'], 'pixel-1', ['pixel-2'], '#f6e4f1', '#e0218a'],
      ['caravana-donettes', 'Caravana Donettes', 'A promotional site for Donettes.', ['Web'], ['web'], 'donettes-1', ['donettes-2', 'donettes-3'], '#f5ead9', '#d94f00'],
    ] as const
  ).map(
    ([slug, name, summary, platforms, kinds, cover, gallery, bg, accent]): Draft => ({
      slug,
      kinds: [...kinds],
      platforms: [...platforms],
      theme: { bg, fg: '#161719', accent },
      cover,
      gallery: [...gallery],
      links: [],
      listed: true,
      text: { en: { name, summary, sections: [] } },
    }),
  ),
  {
    slug: 'aplicacion-iphone-ahorro-scrush',
    kinds: ['app'],
    platforms: ['iPhone'],
    theme: { bg: '#e9eef0', fg: '#161719', accent: '#00a19a' },
    gallery: [],
    links: [],
    youtube: 'RFBQKFvjLcE',
    listed: false,
    text: {
      en: {
        name: 'Scrush',
        summary: 'A household savings app built in 24 hours at FinAppsParty.',
        sections: [
          {
            heading: 'Twenty-four hours',
            body: [
              'FinAppsParty, organised by bdigitalapps and La Caixa, gave teams 24 hours to build a financial app for smartphones. As well as the code, we came up with the idea, designed the screens and made a presentation video. More than 40 teams from several countries took part; we didn’t win, but learned a lot. Our team was the designer David Pareja and a PegPeg developer.',
            ],
          },
          {
            heading: 'The app',
            body: [
              'Scrush makes saving at home visual. You choose a style, cicada for one-off saving or ant for regular saving, and it tracks income and spending by month and by category, recommends how much to save and warns you when you go over.',
              'To help, it suggests discounts based on where you spend most, which you can also browse on a map.',
            ],
          },
        ],
      },
    },
  },
];

function translation(table: Record<string, ProjectText>, slug: string, locale: string): ProjectText {
  const text = table[slug];
  if (!text) throw new Error(`Project ${slug} has no ${locale} text`);
  return text;
}

export const projects: Project[] = drafts.map((p) => ({
  ...p,
  text: { en: p.text.en, es: translation(es, p.slug, 'es'), ca: translation(ca, p.slug, 'ca') },
}));
