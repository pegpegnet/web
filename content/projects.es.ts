/** Spanish project texts, by slug. The same facts as the English, nothing added. */
import type { ProjectText } from './projects';

const short = (name: string, summary: string): ProjectText => ({ name, summary, sections: [] });

export const es: Record<string, ProjectText> = {
  'app-visionos-yutub': {
    name: 'Yutub',
    summary: 'Una experiencia inmersiva de YouTube para Apple Vision Pro.',
    sections: [
      {
        heading: 'YouTube, hecho para visionOS',
        body: [
          'Yutub es un cliente ligero de YouTube hecho con SwiftUI y WebKit y pensado para visionOS. Ofrece a quien tiene un Apple Vision Pro una forma nativa de navegar por YouTube, con controles y opciones que la versión del navegador no tiene.',
        ],
      },
      {
        heading: 'Qué añade',
        body: [],
        list: [
          'Pestañas para pasar de Inicio a Ver más tarde, Suscripciones e Historial',
          'Controles de vídeo propios con los que es difícil fallar al pausar, reproducir o saltar',
          'Un control de la barra de progreso más grande, fácil de coger en el espacio',
          'Modo oscuro y control de la reproducción automática en todas las pestañas',
          'Un panel de ajustes nativo',
        ],
      },
      {
        heading: 'Código abierto',
        body: ['Toda la app está en GitHub, con instrucciones para instalarla sin cuenta de desarrollador.'],
      },
    ],
  },
  'telegram-bot-instagram-preview': {
    name: 'Socialpreviewbot',
    summary: 'Un bot de Telegram que genera previsualizaciones de enlaces de Instagram.',
    sections: [
      {
        heading: 'El problema',
        body: [
          'Los enlaces de Instagram no se previsualizan bien en Telegram. Socialpreviewbot lo resuelve: muestra publicaciones, historias y reels en el propio chat, sin tener que salir de la conversación para abrir Instagram.',
        ],
      },
      {
        heading: 'Funciones',
        body: [],
        list: [
          'Previsualización instantánea de contenido de Instagram',
          'Publicaciones, historias y reels',
          'Funciona en chats individuales y en grupos',
          'Suscripciones mensuales y anuales',
          'Un panel de administración para gestionar las suscripciones',
        ],
      },
      {
        heading: 'Cómo está hecho',
        body: [
          'Lo desarrollamos íntegramente nosotros sobre la API oficial de bots de Telegram, con una caché que lo mantiene rápido y ligero para el servidor. Funciona con un modelo freemium: se puede probar gratis con límites, y una suscripción mensual o anual lo desbloquea todo.',
        ],
      },
    ],
  },
  'app-iphone-pong': {
    name: 'RetroPong',
    summary: 'Una versión moderna para iOS del clásico Pong de Atari.',
    sections: [
      {
        heading: 'Un concurso de Atari',
        body: [
          'Atari organizó un concurso internacional para crear la nueva versión de Pong para iOS. Se presentaron más de cien equipos; pasamos dos rondas de selección y quedamos finalistas, lo que suponía publicar el juego bajo la marca Atari.',
        ],
      },
      {
        heading: 'El juego',
        body: [
          'RetroPong se hizo para iPhone y iPad. Además de uno y dos jugadores, en el iPad pueden jugar tres o cuatro personas a la vez.',
          'Tiene tres modos: un modo historia que avanza por niveles, un modo batalla para jugar a distancia contra otras personas y un modo multijugador para hasta cuatro personas en la misma pantalla.',
        ],
      },
    ],
  },
  'youtube-mix-videos': {
    name: 'MixMasterTube',
    summary: 'Una web para mezclar vídeos de YouTube como un DJ.',
    sections: [
      {
        heading: 'Dos platos y un crossfader',
        body: [
          'MixMasterTube trataba los vídeos musicales de YouTube como pistas de DJ: cargabas uno en cada plato y hacías crossfade entre ellos. Se podían importar listas de YouTube, publicarlas para otras personas o crear listas nuevas en la web.',
        ],
      },
      {
        heading: 'Lo que vino después',
        body: [
          'El lanzamiento salió en la prensa y mucha gente se registró y compartió sus listas. Un año después llegó Spotify y cambió la forma de escuchar música, y las restricciones de YouTube a los vídeos musicales nos llevaron a aparcar el proyecto.',
        ],
      },
    ],
  },
  abadia: {
    name: 'La abadía del crimen',
    summary: 'El clásico español de 1987, inspirado en El nombre de la rosa, como app nativa para Mac.',
    sections: [
      {
        heading: 'Un misterio en siete días, en los Mac de hoy',
        body: [
          'La abadía del crimen, de Paco Menéndez y Juan Delcán, es uno de los juegos españoles más queridos de la época de los 8 bits. Esta versión le da un hogar nativo en macOS: una app universal para Apple silicon e Intel, firmada y notarizada por Apple, que se actualiza sola.',
        ],
      },
      {
        heading: 'Dos maneras de ver la abadía',
        body: ['Juega con los gráficos remasterizados de 256 colores o cambia al aspecto original de Amstrad CPC de 1987 con una sola opción del menú.'],
      },
      {
        heading: 'Preservación, con cuidado',
        body: [
          'La app no incluye los datos del juego. Cuando lo pides, descarga los archivos originales (unos 6 MB) del proyecto Abbey y comprueba cada uno. Es un proyecto sin ánimo de lucro que se apoya en la reconstrucción en C++ de Manuel Abadía y el equipo de VIGASOCO, la adaptación a SDL de Luzbel, los gráficos remasterizados de Antonio Giner y el proyecto Abbey.',
        ],
      },
    ],
  },
  shinymac: {
    name: 'ShinyMac',
    summary: 'Un limpiador para Mac gratuito y de código abierto, con una interfaz nativa en SwiftUI.',
    sections: [
      {
        heading: 'Un Mac limpio y rápido',
        body: [
          'ShinyMac limpia archivos innecesarios, desinstala apps por completo y mantiene el Mac ágil. Smart Care lo hace con un análisis y un clic: elimina la basura del sistema, vacía la papelera y ejecuta tareas de mantenimiento, y después señala actualizaciones, restos y archivos grandes que merece la pena revisar.',
        ],
      },
      {
        heading: 'Qué limpia',
        body: [],
        list: [
          'Cachés y registros del usuario, DerivedData y simuladores de Xcode, y cachés de gestores de paquetes',
          'Archivos grandes y sin usar descargados de iCloud Drive, Dropbox, Google Drive y otros servicios en la nube',
          'Apps, junto con todo lo que dejaron atrás',
        ],
      },
      {
        heading: 'Nativo, gratuito y privado',
        body: [
          'Escrito en Swift y SwiftUI para macOS, con fondos de aurora animados y Liquid Glass. Gratuito y de código abierto con licencia MIT, sin cuenta y sin telemetría. También se instala con Homebrew.',
        ],
      },
    ],
  },
  forest: {
    name: 'Forest',
    summary: 'Una sola ventana de Mac para tus agentes de programación: sus terminales, sus cambios y un cliente Git nativo.',
    sections: [
      {
        heading: 'Por qué lo hicimos',
        body: [
          'Trabajar con varios agentes de programación suele significar una pestaña de terminal por worktree, una app de Git en otro sitio y una herramienta de diff encima. Forest lo reúne todo, para Claude Code, Codex, Gemini CLI o cualquier comando propio.',
        ],
      },
      {
        heading: 'Una ventana, tres columnas',
        body: [],
        list: [
          'Proyectos, sus worktrees y las sesiones de cada agente, con una señal en directo de qué hace cada uno y cuáles te esperan',
          'Un terminal Ghostty real por worktree, acelerado por GPU, que sigue funcionando cuando cambias de uno a otro',
          'Los archivos apareciendo mientras el agente los escribe, con Revisar y Fusionar a un clic',
        ],
      },
      {
        heading: 'Hecho para Mac',
        body: ['Escrito en Swift, nativo en Apple silicon, notarizado y con licencia MIT.'],
      },
    ],
  },
  'app-iphone-tv3': {
    name: 'App de TV3',
    summary: 'La primera app oficial de TV3 para iPhone.',
    sections: [
      {
        heading: 'Televisión en directo en el móvil',
        body: [
          'Televisió de Catalunya nos encargó diseñar y desarrollar la primera app oficial de TV3 para iPhone: integrar la información de su web y mostrar sus canales de vídeo en directo.',
          'Fue la primera app móvil del mercado español en ofrecer televisión en directo. Una versión posterior de la app la hizo otro equipo.',
        ],
      },
    ],
  },
  'app-iphone-futbol-club-barcelona-zigazaga': {
    name: 'ZigaZaga',
    summary: 'Una app propia con los mejores momentos del FC Barcelona.',
    sections: [
      {
        heading: 'Los mejores momentos del Barça',
        body: [
          'Una app no oficial que diseñamos y desarrollamos para aficionados del Barça, con algunos de los mejores momentos de las últimas temporadas en YouTube. Era gratuita; como los vídeos se enlazaban directamente desde YouTube, puede que algunos ya no se reproduzcan.',
        ],
      },
    ],
  },
  'app-iphone-sumophoto': {
    name: 'SumoPhoto',
    summary: 'Una app propia de concursos de fotos, de antes de Instagram.',
    sections: [
      {
        heading: 'Fotos en un ring de sumo',
        body: [
          'SumoPhoto permitía competir con tus fotos en categorías predefinidas, antes del fenómeno Instagram. Para ver muchas fotos de forma sencilla, funciona como un combate de sumo: dos fotos frente a frente y tú eliges la ganadora, una y otra vez.',
          'Todo lo hizo nuestro equipo, de la idea al diseño y la programación. Ilustraciones de Marc Mallafré y diseño de interfaz de Marc Aguiló.',
        ],
      },
    ],
  },
  'app-iphone-ipad-microsite': {
    name: 'Niessen',
    summary: 'Una app para iPhone, iPad y Android, y un microsite para móviles.',
    sections: [
      {
        heading: 'Prueba un interruptor en tu propia pared',
        body: [
          'Hicimos una app para iPhone y iPad, una versión especial para Android y un microsite responsive para ordenador, TV y tableta. La app muestra las gamas de interruptores de Niessen, permite probar combinaciones y colocar un interruptor en cualquier pared a través de la cámara para ver cómo quedaría instalado.',
        ],
      },
    ],
  },
  'app-iphone-bac': {
    name: 'NoVoyPedo',
    summary: 'Un alcoholímetro para iPhone en el que hay que soplar.',
    sections: [
      {
        heading: 'Sopla para ver el resultado',
        body: [
          'Una app propia que simula un alcoholímetro. Introduces cuántas copas has tomado y en cuánto tiempo, y calcula una tasa aproximada de alcohol en sangre a partir de eso y de tu peso.',
          'Lo que la hacía distinta: para ver el resultado hay que soplar al iPhone, igual que con un aparato real. Se tradujo a más de seis idiomas y estuvo varias veces entre las diez apps más descargadas.',
        ],
      },
    ],
  },
  'gestor-de-contenidos-administrador': {
    name: 'Gestor de contenidos',
    summary: 'Nuestro propio gestor de contenidos, para clientes que actualizan su web ellos mismos.',
    sections: [
      {
        heading: 'Hecho porque nada encajaba',
        body: [
          'Los clientes nos pedían poder actualizar sus webs por su cuenta. Los gestores que probamos no cubrían sus necesidades, así que hicimos uno.',
          'Se configura para cada proyecto y cliente, e incluye estadísticas, varios perfiles y usuarios, notificaciones, búsqueda global, edición de texto como en un procesador, subida de archivos, escalado de imágenes y exportación a Excel.',
        ],
      },
    ],
  },
  crackovia: short('Crackòvia', 'Una app para iPhone del programa Crackòvia de TV3.'),
  probrowser: short('ProBrowser', 'Un navegador propio que emula Internet Explorer.'),
  'air-guitar': short('Air Guitar', 'La web del evento Air Guitar Barcelona.'),
  tmb: short('TMB', 'Un juego para el Campeonato Mundial de Natación.'),
  cruzcampo: short('Juego Cruzcampo', 'Un juego para Cruzcampo.'),
  'mattel-pixelchix': short('Mattel Pixel Chix', 'La web del juguete Pixel Chix de Mattel.'),
  'caravana-donettes': short('Caravana Donettes', 'Un portal promocional para Donettes.'),
  'aplicacion-iphone-ahorro-scrush': {
    name: 'Scrush',
    summary: 'Una app de ahorro doméstico hecha en 24 horas en la FinAppsParty.',
    sections: [
      {
        heading: 'Veinticuatro horas',
        body: [
          'La FinAppsParty, organizada por bdigitalapps y La Caixa, daba 24 horas a cada equipo para crear una app financiera para smartphones. Además del código, ideamos el concepto, diseñamos las pantallas y grabamos un vídeo de presentación. Participaron más de 40 equipos de varios países; no ganamos, pero aprendimos mucho. El equipo eran el diseñador David Pareja y un programador de PegPeg.',
        ],
      },
      {
        heading: 'La app',
        body: [
          'Scrush hace visual el ahorro en casa. Eliges un estilo, cigarra para ahorrar de vez en cuando u hormiga para ahorrar con regularidad, y sigue ingresos y gastos por mes y por categoría, recomienda cuánto ahorrar y avisa cuando te pasas.',
          'Para ayudarte, sugiere descuentos según dónde gastas más, que también puedes ver en un mapa.',
        ],
      },
    ],
  },
};
