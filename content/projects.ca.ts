/** Catalan project texts, by slug. The same facts as the English, nothing added. */
import type { ProjectText } from './projects';

const short = (name: string, summary: string): ProjectText => ({ name, summary, sections: [] });

export const ca: Record<string, ProjectText> = {
  'app-visionos-yutub': {
    name: 'Yutub',
    summary: 'Una experiència immersiva de YouTube per a Apple Vision Pro.',
    sections: [
      {
        heading: 'YouTube, fet per a visionOS',
        body: [
          'Yutub és un client lleuger de YouTube fet amb SwiftUI i WebKit i pensat per a visionOS. Ofereix a qui té un Apple Vision Pro una manera nativa de navegar per YouTube, amb controls i opcions que la versió del navegador no té.',
        ],
      },
      {
        heading: 'Què hi afegeix',
        body: [],
        list: [
          'Pestanyes per passar d’Inici a Mira-ho més tard, Subscripcions i Historial',
          'Controls de vídeo propis amb què és difícil fallar en posar en pausa, reproduir o saltar',
          'Un control de la barra de progrés més gran, fàcil d’agafar a l’espai',
          'Mode fosc i control de la reproducció automàtica a totes les pestanyes',
          'Un tauler de configuració natiu',
        ],
      },
      {
        heading: 'Codi obert',
        body: ['Tota l’app és a GitHub, amb instruccions per instal·lar-la sense compte de desenvolupador.'],
      },
    ],
  },
  'telegram-bot-instagram-preview': {
    name: 'Socialpreviewbot',
    summary: 'Un bot de Telegram que genera previsualitzacions d’enllaços d’Instagram.',
    sections: [
      {
        heading: 'El problema',
        body: [
          'Els enllaços d’Instagram no es previsualitzen bé a Telegram. Socialpreviewbot ho resol: mostra publicacions, històries i reels al mateix xat, sense haver de sortir de la conversa per obrir Instagram.',
        ],
      },
      {
        heading: 'Funcions',
        body: [],
        list: [
          'Previsualització instantània de contingut d’Instagram',
          'Publicacions, històries i reels',
          'Funciona en xats individuals i en grups',
          'Subscripcions mensuals i anuals',
          'Un tauler d’administració per gestionar les subscripcions',
        ],
      },
      {
        heading: 'Com està fet',
        body: [
          'El vam desenvolupar íntegrament nosaltres sobre l’API oficial de bots de Telegram, amb una memòria cau que el manté ràpid i lleuger per al servidor. Funciona amb un model freemium: es pot provar de franc amb límits, i una subscripció mensual o anual ho desbloqueja tot.',
        ],
      },
    ],
  },
  'app-iphone-pong': {
    name: 'RetroPong',
    summary: 'Una versió moderna per a iOS del clàssic Pong d’Atari.',
    sections: [
      {
        heading: 'Un concurs d’Atari',
        body: [
          'Atari va organitzar un concurs internacional per crear la nova versió de Pong per a iOS. S’hi van presentar més de cent equips; vam superar dues rondes de selecció i vam quedar finalistes, cosa que suposava publicar el joc amb la marca Atari.',
        ],
      },
      {
        heading: 'El joc',
        body: [
          'RetroPong es va fer per a iPhone i iPad. A més d’un i dos jugadors, a l’iPad hi poden jugar tres o quatre persones alhora.',
          'Té tres modes: un mode història que avança per nivells, un mode batalla per jugar a distància contra altres persones i un mode multijugador per a fins a quatre persones a la mateixa pantalla.',
        ],
      },
    ],
  },
  'youtube-mix-videos': {
    name: 'MixMasterTube',
    summary: 'Un web per barrejar vídeos de YouTube com un DJ.',
    sections: [
      {
        heading: 'Dos plats i un crossfader',
        body: [
          'MixMasterTube tractava els vídeos musicals de YouTube com a pistes de DJ: en carregaves un a cada plat i feies crossfade entre ells. Es podien importar llistes de YouTube, publicar-les per a altres persones o crear-ne de noves al web.',
        ],
      },
      {
        heading: 'El que va venir després',
        body: [
          'El llançament va sortir a la premsa i molta gent s’hi va registrar i va compartir les seves llistes. Un any després va arribar Spotify i va canviar la manera d’escoltar música, i les restriccions de YouTube als vídeos musicals ens van portar a aparcar el projecte.',
        ],
      },
    ],
  },
  abadia: {
    name: 'La abadía del crimen',
    summary: 'El clàssic espanyol de 1987, inspirat en El nom de la rosa, com a app nativa per a Mac.',
    sections: [
      {
        heading: 'Un misteri en set dies, als Mac d’avui',
        body: [
          'La abadía del crimen, de Paco Menéndez i Juan Delcán, és un dels jocs espanyols més estimats de l’època dels 8 bits. Aquesta versió li dona una llar nativa a macOS: una app universal per a Apple silicon i Intel, signada i notaritzada per Apple, que s’actualitza sola.',
        ],
      },
      {
        heading: 'Dues maneres de veure l’abadia',
        body: ['Juga amb els gràfics remasteritzats de 256 colors o canvia a l’aspecte original d’Amstrad CPC de 1987 amb una sola opció del menú.'],
      },
      {
        heading: 'Preservació, amb cura',
        body: [
          'L’app no inclou les dades del joc. Quan ho demanes, descarrega els fitxers originals (uns 6 MB) del projecte Abbey i els comprova un per un. És un projecte sense ànim de lucre que es basa en la reconstrucció en C++ de Manuel Abadía i l’equip de VIGASOCO, l’adaptació a SDL de Luzbel, els gràfics remasteritzats d’Antonio Giner i el projecte Abbey.',
        ],
      },
    ],
  },
  shinymac: {
    name: 'ShinyMac',
    summary: 'Un netejador per a Mac gratuït i de codi obert, amb una interfície nativa en SwiftUI.',
    sections: [
      {
        heading: 'Un Mac net i ràpid',
        body: [
          'ShinyMac neteja fitxers innecessaris, desinstal·la apps del tot i manté el Mac àgil. Smart Care ho fa amb una anàlisi i un clic: elimina la brossa del sistema, buida la paperera i executa tasques de manteniment, i després assenyala actualitzacions, restes i fitxers grans que val la pena revisar.',
        ],
      },
      {
        heading: 'Què neteja',
        body: [],
        list: [
          'Memòries cau i registres de l’usuari, DerivedData i simuladors d’Xcode, i memòries cau de gestors de paquets',
          'Fitxers grans i sense ús baixats d’iCloud Drive, Dropbox, Google Drive i altres serveis al núvol',
          'Apps, juntament amb tot el que van deixar enrere',
        ],
      },
      {
        heading: 'Natiu, gratuït i privat',
        body: [
          'Escrit en Swift i SwiftUI per a macOS, amb fons d’aurora animats i Liquid Glass. Gratuït i de codi obert amb llicència MIT, sense compte i sense telemetria. També s’instal·la amb Homebrew.',
        ],
      },
    ],
  },
  forest: {
    name: 'Forest',
    summary: 'Una sola finestra de Mac per als teus agents de programació: els seus terminals, els seus canvis i un client Git natiu.',
    sections: [
      {
        heading: 'Per què el vam fer',
        body: [
          'Treballar amb diversos agents de programació sol voler dir una pestanya de terminal per worktree, una app de Git en un altre lloc i una eina de diff a sobre. Forest ho reuneix tot, per a Claude Code, Codex, Gemini CLI o qualsevol ordre pròpia.',
        ],
      },
      {
        heading: 'Una finestra, tres columnes',
        body: [],
        list: [
          'Projectes, els seus worktrees i les sessions de cada agent, amb un senyal en directe del que fa cadascun i de quins t’esperen',
          'Un terminal Ghostty real per worktree, accelerat per GPU, que continua funcionant quan canvies de l’un a l’altre',
          'Els fitxers apareixent mentre l’agent els escriu, amb Revisa i Fusiona a un clic',
        ],
      },
      {
        heading: 'Fet per a Mac',
        body: ['Escrit en Swift, natiu a Apple silicon, notaritzat i amb llicència MIT.'],
      },
    ],
  },
  'lennon': {
    name: 'Lennon',
    summary: 'Un agent de codi a l’estil de Claude Code, escrit en Rust, que continua amb Codex o Gemini quan arribes a un límit d’ús.',
    sections: [
      {
        heading: 'Un company fidel per a la feina a mitges',
        body: [
          'Lennon s’assembla i es comporta com Claude Code: el mateix quadre de text, la mateixa transcripció, ordres amb barra, modes de permisos, dreceres i opcions de línia d’ordres. Quan Claude Code avisa d’un límit d’ús, Lennon desa la conversa i l’activitat d’eines que pot veure i continua la mateixa tasca amb el proveïdor següent, OpenAI Codex i després Gemini CLI per defecte, a la mateixa sessió i el mateix espai de treball.',
        ],
      },
      {
        heading: 'Com funciona',
        body: [],
        list: [
          'Fa servir els agents de codi que ja tens, amb els seus propis inicis de sessió, eines i sessions',
          'Un sol executable natiu: Lennon no necessita Node.js, cap entorn de JavaScript ni clau d’API',
          'Una implementació independent, no un fork de Claude Code',
        ],
      },
      {
        heading: 'Estat',
        body: [
          'Una alfa funcional per a macOS i Linux, de codi obert amb llicència MIT. Porta el nom de Lennon, un podenc negre de pèl dur, que també n’és la icona.',
        ],
      },
    ],
  },
  'mktagent': {
    name: 'mktagent',
    summary: 'Un equip de màrqueting autònom amb IA, fet amb el Claude Agent SDK.',
    sections: [
      {
        heading: 'Un equip de màrqueting que treballa cada dia',
        body: [
          'Dona un producte a mktagent i cada dia el seu equip planifica, crea i lliura feina de màrqueting: campanyes, bàners, publicacions a xarxes, vídeos curts, fitxes d’App Store, plans d’anuncis i dossiers de premsa. Tot arriba com a fitxers que tu revises i aproves.',
        ],
      },
      {
        heading: 'L’equip',
        body: [
          'Un agent CMO dirigeix onze especialistes. Llegeix la memòria de l’equip, decideix les prioritats del dia, reparteix la feina en paral·lel, ho passa tot per control de qualitat i escriu l’informe del dia.',
        ],
        list: [
          'Recerca, estratègia de creixement i optimització per a App Store',
          'Redacció, xarxes socials i premsa',
          'Disseny visual, producció de vídeo i campanyes de pagament',
          'Anàlisi de dades, i un guardià de marca per a la revisió final',
        ],
      },
      {
        heading: 'Peces reals, no només text',
        body: [
          'Les seves eines d’estudi generen bàners amb la marca del producte com a fitxers PNG en 19 mides predefinides, i vídeos MP4 verticals, quadrats o apaïsats amb tipografia animada, imatge de portada i subtítols SRT. De codi obert amb llicència MIT.',
        ],
      },
    ],
  },
  'instavision': {
    name: 'InstaVision',
    summary: 'Un visor natiu d’Instagram per a Apple Vision Pro, pensat per als Reels.',
    sections: [
      {
        heading: 'Primer, els Reels',
        body: [
          'InstaVision s’obre amb una graella dels teus Reels. Passa’ls en una finestra de reproducció vertical on el Reel visible es reprodueix en bucle, amb els m’agrada, els comentaris i el silenci en un ornament al costat. El Reel següent i l’anterior es carreguen per endavant, així que passar d’un a l’altre és instantani.',
        ],
      },
      {
        heading: 'Fet per a l’espai',
        body: [],
        list: [
          'Reels Theater: un espai immersiu que reprodueix Reels en una pantalla de 3,2 metres d’alt mentre l’habitació s’enfosqueix',
          'Gallery Wall: les teves 16 últimes publicacions penjades en una paret corba al teu voltant',
          'Les publicacions s’obren en finestres pròpies, per repartir-les per l’habitació',
          'Un mode demo per provar-ho tot sense compte',
        ],
      },
      {
        heading: 'Com està fet',
        body: [
          'SwiftUI, AVFoundation i RealityKit, amb el token d’accés desat al clauer i renovat automàticament. De codi obert amb llicència MIT, i sense relació amb Instagram ni Meta.',
        ],
      },
    ],
  },
  'whassap': {
    name: 'Whassap',
    summary: 'Un client no oficial de WhatsApp per a Apple Vision Pro.',
    sections: [
      {
        heading: 'WhatsApp com a app pròpia',
        body: [
          'Whassap permet fer servir WhatsApp al Vision Pro com una app pròpia, en lloc d’una pestanya del navegador, fins que hi hagi una app oficial. Embolcalla WhatsApp Web en una finestra nativa, així que hi ha tot el que WhatsApp Web permet, adaptat a visionOS.',
          'És no oficial i no té relació amb WhatsApp.',
        ],
      },
    ],
  },
  'swiftui-debug-tools': {
    name: 'SwiftUIDebugTools',
    summary: 'Una llibreria lleugera per depurar SwiftUI: veure el layout, inspeccionar vistes i vigilar el rendiment.',
    sections: [
      {
        heading: 'Una línia per començar',
        body: [
          'Afegeix el paquet, crida .debugEnvironment() a la vista arrel de la teva app i totes les vistes es poden depurar. Les eines viuen en un full inferior; al simulador d’iOS, ⌘⇧D el mostra i l’amaga.',
        ],
      },
      {
        heading: 'Les eines',
        body: [],
        list: [
          'Colors de fons aleatoris que revelen la jerarquia del layout',
          'Amplada i alçada superposades a cada vista',
          'Un monitor en directe de FPS i temps per fotograma',
          'Toca qualsevol vista per veure’n la mida, la posició i el marc',
          'Una graella amb regles de 5, 8 o 20 px',
        ],
      },
      {
        heading: 'Només en depuració',
        body: [
          'Tot va dins de #if DEBUG, així que les versions de publicació no en porten res.',
        ],
      },
    ],
  },
  'app-iphone-tv3': {
    name: 'App de TV3',
    summary: 'La primera app oficial de TV3 per a iPhone.',
    sections: [
      {
        heading: 'Televisió en directe al mòbil',
        body: [
          'Televisió de Catalunya ens va encarregar dissenyar i desenvolupar la primera app oficial de TV3 per a iPhone: integrar la informació del seu web i mostrar els seus canals de vídeo en directe.',
          'Va ser la primera app mòbil del mercat espanyol que oferia televisió en directe. Una versió posterior de l’app la va fer un altre equip.',
        ],
      },
    ],
  },
  'app-iphone-futbol-club-barcelona-zigazaga': {
    name: 'ZigaZaga',
    summary: 'Una app pròpia amb els millors moments del FC Barcelona.',
    sections: [
      {
        heading: 'Els millors moments del Barça',
        body: [
          'Una app no oficial que vam dissenyar i desenvolupar per a aficionats del Barça, amb alguns dels millors moments de les últimes temporades a YouTube. Era gratuïta; com que els vídeos s’enllaçaven directament des de YouTube, potser alguns ja no es reprodueixen.',
        ],
      },
    ],
  },
  'app-iphone-sumophoto': {
    name: 'SumoPhoto',
    summary: 'Una app pròpia de concursos de fotos, d’abans d’Instagram.',
    sections: [
      {
        heading: 'Fotos en un ring de sumo',
        body: [
          'SumoPhoto permetia competir amb les teves fotos en categories predefinides, abans del fenomen Instagram. Per veure moltes fotos de manera senzilla, funciona com un combat de sumo: dues fotos cara a cara i tu tries la guanyadora, una vegada i una altra.',
          'Ho va fer tot el nostre equip, de la idea al disseny i la programació. Il·lustracions de Marc Mallafré i disseny d’interfície de Marc Aguiló.',
        ],
      },
    ],
  },
  'app-iphone-ipad-microsite': {
    name: 'Niessen',
    summary: 'Una app per a iPhone, iPad i Android, i un microsite per a mòbils.',
    sections: [
      {
        heading: 'Prova un interruptor a la teva paret',
        body: [
          'Vam fer una app per a iPhone i iPad, una versió especial per a Android i un microsite responsive per a ordinador, TV i tauleta. L’app mostra les gammes d’interruptors de Niessen, permet provar combinacions i col·locar un interruptor a qualsevol paret a través de la càmera per veure com quedaria instal·lat.',
        ],
      },
    ],
  },
  'app-iphone-bac': {
    name: 'NoVoyPedo',
    summary: 'Un alcoholímetre per a iPhone en què cal bufar.',
    sections: [
      {
        heading: 'Bufa per veure el resultat',
        body: [
          'Una app pròpia que simula un alcoholímetre. Hi poses quantes copes has pres i en quant de temps, i calcula una taxa aproximada d’alcohol a la sang a partir d’això i del teu pes.',
          'El que la feia diferent: per veure el resultat cal bufar a l’iPhone, igual que amb un aparell real. Es va traduir a més de sis idiomes i va estar diverses vegades entre les deu apps més baixades.',
        ],
      },
    ],
  },
  'gestor-de-contenidos-administrador': {
    name: 'Gestor de continguts',
    summary: 'El nostre propi gestor de continguts, per a clients que actualitzen el seu web ells mateixos.',
    sections: [
      {
        heading: 'Fet perquè res no encaixava',
        body: [
          'Els clients ens demanaven poder actualitzar els seus webs pel seu compte. Els gestors que vam provar no cobrien les seves necessitats, així que en vam fer un.',
          'Es configura per a cada projecte i client, i inclou estadístiques, diversos perfils i usuaris, notificacions, cerca global, edició de text com en un processador, pujada de fitxers, escalat d’imatges i exportació a Excel.',
        ],
      },
    ],
  },
  crackovia: short('Crackòvia', 'Una app per a iPhone del programa Crackòvia de TV3.'),
  probrowser: short('ProBrowser', 'Un navegador propi que emula Internet Explorer.'),
  'air-guitar': short('Air Guitar', 'El web de l’esdeveniment Air Guitar Barcelona.'),
  tmb: short('TMB', 'Un joc per al Campionat del Món de Natació.'),
  cruzcampo: short('Joc Cruzcampo', 'Un joc per a Cruzcampo.'),
  'mattel-pixelchix': short('Mattel Pixel Chix', 'El web de la joguina Pixel Chix de Mattel.'),
  'caravana-donettes': short('Caravana Donettes', 'Un portal promocional per a Donettes.'),
  'aplicacion-iphone-ahorro-scrush': {
    name: 'Scrush',
    summary: 'Una app d’estalvi domèstic feta en 24 hores a la FinAppsParty.',
    sections: [
      {
        heading: 'Vint-i-quatre hores',
        body: [
          'La FinAppsParty, organitzada per bdigitalapps i La Caixa, donava 24 hores a cada equip per crear una app financera per a smartphones. A més del codi, vam idear el concepte, vam dissenyar les pantalles i vam gravar un vídeo de presentació. Hi van participar més de 40 equips de diversos països; no vam guanyar, però vam aprendre molt. L’equip el formaven el dissenyador David Pareja i un programador de PegPeg.',
        ],
      },
      {
        heading: 'L’app',
        body: [
          'Scrush fa visual l’estalvi a casa. Tries un estil, cigala per estalviar de tant en tant o formiga per estalviar amb regularitat, i segueix ingressos i despeses per mes i per categoria, recomana quant estalviar i avisa quan et passes.',
          'Per ajudar-te, suggereix descomptes segons on gastes més, que també pots veure en un mapa.',
        ],
      },
    ],
  },
};
