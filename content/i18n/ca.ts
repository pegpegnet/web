import type { Dictionary } from './en';

/** Catalan copy. */
const ca: Dictionary = {
  meta: {
    title: 'PegPeg: estudi de tecnologia creativa a Barcelona',
    description:
      'Estudi independent de tecnologia creativa a Barcelona. Dissenyem, desenvolupem i experimentem amb apps, webs, IA i experiències immersives.',
  },
  hero: {
    title: 'Fem que el digital cobri vida.',
    seeWork: 'Veure projectes',
    drag: 'Arrossega per explorar',
    dragCursor: 'Arrossega',
    talk: 'Parlem',
    lead: 'Estudi independent de tecnologia creativa a Barcelona. Dissenyem, desenvolupem i experimentem amb apps, webs, IA i experiències immersives.',
  },
  nav: {
    menu: 'Menú',
    close: 'Tanca',
    mainNav: 'Principal',
    skip: 'Vés al contingut',
    work: 'Projectes',
    services: 'Què fem',
    about: 'Estudi',
    contact: 'Contacte',
    language: 'Idioma',
  },
  footer: {
    about: 'Un estudi petit que dissenya i desenvolupa apps, webs i experiments, des del primer esbós fins a l’App Store.',
    studio: 'Estudi',
    sitemap: 'Explora',
    follow: 'Segueix-nos',
  },
  projects: {
    title: 'Projectes',
    lead: 'Apps, webs, jocs i experiments, des d’encàrrecs per a TV3 i Niessen fins a les nostres pròpies apps de codi obert per a Mac.',
    filterLabel: 'Mostra projectes d’un tipus',
    all: 'Tots',
    showing: '{n} projectes',
  },
  project: {
    platforms: 'Funciona a',
    year: 'Any',
    kind: 'Què és',
    links: 'Enllaços',
    press: 'A la premsa',
    video: 'Mira el vídeo',
    next: 'Següent projecte',
    all: 'Tots els projectes',
  },
  services: {
    title: 'Què fem',
    lead: 'Cinc coses que se’ns donen bé, sovint en el mateix projecte.',
    items: [
      {
        name: 'iOS i iPadOS natius',
        text: 'Apps que se senten a casa als dispositius d’Apple, escrites en Swift i SwiftUI i publicades a l’App Store.',
      },
      {
        name: 'Apps multiplataforma',
        text: 'Un sol codi per a iPhone i Android quan surt a compte: Flutter, React Native o Kotlin Multiplatform, segons el projecte.',
      },
      {
        name: 'Disseny i desenvolupament web',
        text: 'Webs i aplicacions web ràpides i accessibles, amb un gestor de continguts si prefereixes actualitzar-les tu.',
      },
      {
        name: 'Productes amb IA',
        text: 'Assistents que coneixen els teus documents i funcions d’IA dins de les apps i eines que ja fas servir.',
      },
      {
        name: 'Espacial i experimental',
        text: 'Apps per a visionOS, 3D al web i algun experiment. Aquest web n’és un.',
      },
    ],
  },
  about: {
    lines: ['Estudi petit.', 'Grans idees.', 'Enginyeria acurada.'],
    intro:
      'PegPeg és un estudi petit a Barcelona. Vam fer la primera app d’Espanya que emetia televisió en directe, vam arribar a la final del concurs de Pong d’Atari i vam crear un alcoholímetre en què calia bufar de debò. Avui dissenyem i desenvolupem apps per a plataformes d’Apple i Android, webs, eines d’IA i programari de codi obert per a Mac.',
    principles: [
      {
        title: 'Disseny i codi, junts',
        text: 'Qui dona forma al teu producte és qui el construeix, així les idees sobreviuen al contacte amb el codi.',
      },
      {
        title: 'L’enginyeria també és disseny',
        text: 'Ens importen els fotogrames per segon, el pes dels fitxers i l’accessibilitat tant com la tipografia i el color. Com se sent una cosa depèn de tot plegat.',
      },
      {
        title: 'Sempre hi ha un experiment en marxa',
        text: 'Apps de codi obert per a Mac, un client per a Vision Pro, una taula de Pong en aquesta pàgina. Els projectes propis mantenen esmolats els altres.',
      },
    ],
  },
  openSource: {
    title: 'Codi obert, fet per a Mac',
    lead: 'Apps que fem en obert. Gratuïtes per descarregar, gratuïtes per llegir i fetes amb la mateixa cura que els encàrrecs.',
    source: 'Codi',
    download: 'Descarrega',
    details: 'Detalls',
    cursor: 'Obre',
  },
  work: {
    title: 'Projectes destacats',
    lead: 'Coses que hem fet i que encara ens agraden. Cadascuna és un petit món: mou-lo, arrossega’l i juga.',
    view: 'Veure projecte',
    viewCursor: 'Mira',
    exploreCursor: 'Explora',
    playCursor: 'Juga',
    mixCursor: 'Barreja',
    kinds: { app: 'App', web: 'Web', game: 'Joc', 'open-source': 'Codi obert' },
  },
  contact: {
    title: 'Tens alguna cosa interessant al cap?',
    lead: 'Fem junts una cosa extraordinària.',
    talk: 'Parlem',
    boardCursor: 'Toca',
    pageTitle: 'Parlem',
    pageLead: 'Explica’ns què tens al cap i et respondrem.',
    name: 'El teu nom',
    email: 'Correu electrònic',
    message: 'En què estàs pensant?',
    required: 'obligatori',
    send: 'Envia el missatge',
    sending: 'Enviant…',
    where: 'On som',
    sentTitle: 'Missatge enviat',
    sentText: 'Gràcies. Hem rebut el teu missatge i et respondrem al correu que ens has indicat.',
    sentAction: 'Torna a l’inici',
    notSentTitle: 'El teu missatge no s’ha enviat',
    notSentText: 'Comprova que el nom, el correu i el missatge estan complets i torna-ho a provar.',
    notSentAction: 'Torna al formulari',
  },
};

export default ca;
