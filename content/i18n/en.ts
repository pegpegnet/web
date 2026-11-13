/** English copy. Other languages must provide the same keys (see content/i18n/index.ts). */
const en = {
  meta: {
    title: 'PegPeg: creative technology studio in Barcelona',
    description:
      'Independent creative technology studio in Barcelona. We design, develop and experiment with apps, websites, AI and immersive experiences.',
  },
  hero: {
    title: 'We make digital things come alive.',
    seeWork: 'See the work',
    drag: 'Drag to explore',
    dragCursor: 'Drag',
    talk: "Let's talk",
    lead: 'Independent creative technology studio in Barcelona. We design, develop, and experiment with apps, websites, AI, and immersive experiences.',
  },
  nav: {
    menu: 'Menu',
    close: 'Close',
    mainNav: 'Main',
    skip: 'Skip to content',
    work: 'Work',
    services: 'What we do',
    about: 'Studio',
    contact: 'Contact',
  },
  footer: {
    about: 'A small studio that designs and builds apps, websites and experiments, from the first sketch to the App Store.',
    studio: 'Studio',
    sitemap: 'Explore',
    follow: 'Follow',
  },
  projects: {
    title: 'Projects',
    lead: 'Apps, websites, games and experiments, from client work for TV3 and Niessen to our own open-source Mac apps.',
    filterLabel: 'Show projects of a kind',
    all: 'All',
    showing: '{n} projects',
  },
  project: {
    platforms: 'Runs on',
    year: 'Year',
    kind: 'What it is',
    links: 'Links',
    press: 'In the press',
    video: 'Play the video',
    next: 'Next project',
    all: 'All projects',
  },
  services: {
    title: 'What we do',
    lead: 'Five things we’re good at, often in the same project.',
    items: [
      {
        name: 'Native iOS and iPadOS',
        text: 'Apps that feel at home on Apple devices, written in Swift and SwiftUI and shipped through the App Store.',
      },
      {
        name: 'Cross-platform apps',
        text: 'One codebase for iPhone and Android when that’s the better deal: Flutter, React Native or Kotlin Multiplatform, chosen per project.',
      },
      {
        name: 'Web design and development',
        text: 'Fast, accessible websites and web apps, with a content manager when you’d rather update them yourself.',
      },
      {
        name: 'AI products',
        text: 'Assistants that know your documents, and AI features built into the apps and tools you already use.',
      },
      {
        name: 'Spatial and experimental',
        text: 'visionOS apps, 3D on the web and the odd experiment. This site is one of them.',
      },
    ],
  },
  about: {
    lines: ['Small studio.', 'Big ideas.', 'Beautifully engineered.'],
    intro:
      'PegPeg is a small studio in Barcelona. We’ve made the first app in Spain to show live television, reached the final of Atari’s Pong contest and built a breathalyser people actually blew into. Today we design and build apps for Apple platforms and Android, websites, AI tools and open-source software for the Mac.',
    principles: [
      {
        title: 'Design and code, together',
        text: 'The people who shape your product are the people who build it, so ideas survive contact with the code.',
      },
      {
        title: 'Engineering is part of the design',
        text: 'We care about frame rates, file sizes and accessibility as much as type and colour. How a thing feels depends on all of them.',
      },
      {
        title: 'Always an experiment going',
        text: 'Open-source Mac apps, a Vision Pro client, a Pong table on this page. Side projects keep the main ones sharp.',
      },
    ],
  },
  openSource: {
    title: 'Open source, made for the Mac',
    lead: 'Apps we build in the open. Free to download, free to read, and made with the same care as client work.',
    source: 'Source',
    download: 'Download',
    details: 'Details',
    cursor: 'Open',
  },
  work: {
    title: 'Selected work',
    lead: 'Things we’ve made and still love. Each one is a small world: move, drag and play.',
    view: 'View project',
    viewCursor: 'View',
    exploreCursor: 'Explore',
    playCursor: 'Play',
    mixCursor: 'Mix',
    kinds: { app: 'App', web: 'Web', game: 'Game', 'open-source': 'Open source' },
  },
  contact: {
    title: 'Have something interesting in mind?',
  },
};

export default en;
export type Dictionary = typeof en;
