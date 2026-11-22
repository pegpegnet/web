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
  'lennon': {
    name: 'Lennon',
    summary: 'Un agente de código al estilo de Claude Code, escrito en Rust, que sigue con Codex o Gemini cuando llegas a un límite de uso.',
    sections: [
      {
        heading: 'Un compañero fiel para el trabajo a medias',
        body: [
          'Lennon se ve y se comporta como Claude Code: el mismo cuadro de texto, la misma transcripción, comandos con barra, modos de permisos, atajos y opciones de línea de comandos. Cuando Claude Code avisa de un límite de uso, Lennon guarda la conversación y la actividad de herramientas que puede ver y continúa la misma tarea con el siguiente proveedor, OpenAI Codex y después Gemini CLI por defecto, en la misma sesión y el mismo espacio de trabajo.',
        ],
      },
      {
        heading: 'Cómo funciona',
        body: [],
        list: [
          'Maneja los agentes de código que ya usas, con sus propios inicios de sesión, herramientas y sesiones',
          'Un único ejecutable nativo: Lennon no necesita Node.js, ningún entorno de JavaScript ni clave de API',
          'Una implementación independiente, no un fork de Claude Code',
        ],
      },
      {
        heading: 'Estado',
        body: [
          'Una alfa funcional para macOS y Linux, de código abierto con licencia MIT. Se llama como Lennon, un podenco negro de pelo duro, que también es su icono.',
        ],
      },
    ],
  },
  'mktagent': {
    name: 'mktagent',
    summary: 'Un equipo de marketing autónomo con IA, hecho con el Claude Agent SDK.',
    sections: [
      {
        heading: 'Un equipo de marketing que trabaja cada día',
        body: [
          'Dale un producto a mktagent y cada día su equipo planifica, crea y entrega trabajo de marketing: campañas, banners, publicaciones en redes, vídeos cortos, fichas de App Store, planes de anuncios y dosieres de prensa. Todo llega como archivos que tú revisas y apruebas.',
        ],
      },
      {
        heading: 'El equipo',
        body: [
          'Un agente CMO dirige a once especialistas. Lee la memoria del equipo, decide las prioridades del día, reparte el trabajo en paralelo, lo pasa todo por control de calidad y escribe el informe del día.',
        ],
        list: [
          'Investigación, estrategia de crecimiento y optimización para App Store',
          'Redacción, redes sociales y prensa',
          'Diseño visual, producción de vídeo y campañas de pago',
          'Análisis de datos, y un guardián de marca para la revisión final',
        ],
      },
      {
        heading: 'Piezas reales, no solo texto',
        body: [
          'Sus herramientas de estudio generan banners con la marca del producto como archivos PNG en 19 tamaños predefinidos, y vídeos MP4 verticales, cuadrados o apaisados con tipografía animada, imagen de portada y subtítulos SRT. De código abierto con licencia MIT.',
        ],
      },
    ],
  },
  'instavision': {
    name: 'InstaVision',
    summary: 'Un visor nativo de Instagram para Apple Vision Pro, pensado para los Reels.',
    sections: [
      {
        heading: 'Primero, los Reels',
        body: [
          'InstaVision se abre con una cuadrícula de tus Reels. Pásalos en una ventana de reproducción vertical donde el Reel visible se reproduce en bucle, con los me gusta, los comentarios y el silencio en un ornamento al lado. El Reel siguiente y el anterior se cargan por adelantado, así que pasar de uno a otro es instantáneo.',
        ],
      },
      {
        heading: 'Hecho para el espacio',
        body: [],
        list: [
          'Reels Theater: un espacio inmersivo que reproduce Reels en una pantalla de 3,2 metros de alto mientras la habitación se oscurece',
          'Gallery Wall: tus 16 últimas publicaciones colgadas en una pared curva a tu alrededor',
          'Las publicaciones se abren en sus propias ventanas, para repartirlas por la habitación',
          'Un modo demo para probarlo todo sin cuenta',
        ],
      },
      {
        heading: 'Cómo está hecho',
        body: [
          'SwiftUI, AVFoundation y RealityKit, con el token de acceso guardado en el llavero y renovado automáticamente. De código abierto con licencia MIT, y sin relación con Instagram ni Meta.',
        ],
      },
    ],
  },
  'whassap': {
    name: 'Whassap',
    summary: 'Un cliente no oficial de WhatsApp para Apple Vision Pro.',
    sections: [
      {
        heading: 'WhatsApp como app propia',
        body: [
          'Whassap permite usar WhatsApp en el Vision Pro como una app propia, en lugar de una pestaña del navegador, hasta que haya una app oficial. Envuelve WhatsApp Web en una ventana nativa, así que está todo lo que WhatsApp Web permite, adaptado a visionOS.',
          'Es no oficial y no tiene relación con WhatsApp.',
        ],
      },
    ],
  },
  'swiftui-debug-tools': {
    name: 'SwiftUIDebugTools',
    summary: 'Una librería ligera para depurar SwiftUI: ver el layout, inspeccionar vistas y vigilar el rendimiento.',
    sections: [
      {
        heading: 'Una línea para empezar',
        body: [
          'Añade el paquete, llama a .debugEnvironment() en la vista raíz de tu app y todas las vistas se pueden depurar. Las herramientas viven en una hoja inferior; en el simulador de iOS, ⌘⇧D la muestra y la oculta.',
        ],
      },
      {
        heading: 'Las herramientas',
        body: [],
        list: [
          'Colores de fondo aleatorios que revelan la jerarquía del layout',
          'Ancho y alto superpuestos en cada vista',
          'Un monitor en vivo de FPS y tiempo por fotograma',
          'Toca cualquier vista para ver su tamaño, posición y marco',
          'Una cuadrícula con reglas de 5, 8 o 20 px',
        ],
      },
      {
        heading: 'Solo en depuración',
        body: [
          'Todo va dentro de #if DEBUG, así que las versiones de publicación no llevan nada.',
        ],
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
