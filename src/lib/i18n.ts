/**
 * Sistema de Internacionalización (i18n)
 * Contiene todas las traducciones en inglés y español para la aplicación.
 * Las claves están organizadas de forma jerárquica usando notación de puntos.
 */

// Cadenas de traducción para inglés y español
export const translations = {
  en: {
    // Navigation
    nav: {
      home: "Home",
      characters: "Characters",
      homebrew: "Homebrew",
      notes: "Notes",
      profile: "Profile",
    },
    // Hero Section
    hero: {
      title: "Welcome to D&D Character Workshop",
      description:
        "Create, manage, and track your D&D 5e characters with ease. Build characters following official rules with full customization.",
      createButton: "Create New Character",
      viewButton: "View My Characters",
    },
    // Features Section
    features: {
      title: "Features",
      characterCreation: {
        title: "Character Creation",
        description:
          "Use our step-by-step wizard to create D&D 5e characters with full class and subclass support.",
        link: "Create Character →",
      },
      characterManagement: {
        title: "Manage Characters",
        description:
          "View, edit, and organize all your characters in one place with multiclass support.",
        link: "View All →",
      },
      gameMode: {
        title: "Game Mode",
        description:
          "Track HP, death saves, initiative, and spell slots during combat and encounters.",
        link: "Play Now →",
      },
      spellTracking: {
        title: "Spell Tracking",
        description:
          "Manage spells, spell slots, and abilities for casters with real-time calculations.",
        link: "Learn More →",
      },
      notes: {
        title: "Notes",
        description:
          "Keep track of your campaign notes, character backstories, and house rules.",
        link: "Take Notes →",
      },
      profile: {
        title: "Profile",
        description:
          "Manage your account settings and view your character collection.",
        link: "Go to Profile →",
      },
    },
    // Coming Soon Section
    comingSoon: {
      title: "Coming Soon",
      homebrewSystem: {
        title: "🛠️ Homebrew System",
        description:
          "Create and manage custom classes, spells, and items. Design your own D&D content and share it with your community.",
        badge: "Coming Soon",
      },
      characterSharing: {
        title: "🔗 Character Sharing",
        description:
          "Share your characters with friends and other players. Export and import characters with ease, collaborate on campaigns.",
        badge: "Coming Soon",
      },
    },
    // Quick Stats
    quickStats: {
      edition: "D&D 5e",
      editionDesc: "Official rules and mechanics",
      classes: "12+ Classes",
      classesDesc: "All classes with subclasses",
      multiclass: "Multiclass",
      multiclassDesc: "Full multiclass support",
    },
    // Footer CTA
    footer: {
      cta: "Ready to start your adventure?",
      button: "Create Your First Character",
    },
    // Homebrew Page
    homebrew: {
      title: "Homebrew",
      subtitle: "Create and manage custom content",
      underConstruction: "Under Construction",
      constructionMsg: "The Homebrew system is being forged. Check back soon!",
    },
    // Profile Page
    profile: {
      title: "Profile",
      accountInfo: "Account Information",
      username: "Username",
      email: "Email",
      security: "Security",
      changePassword: "Change Password",
      logout: "Logout",
      editProfile: "Edit Profile",
      noUsernameSet: "No username set",
      noEmailSet: "No email set",
      editModal: {
        title: "Edit Profile",
        username: "Username",
        email: "Email",
        saveChanges: "Save Changes",
        cancel: "Cancel",
      },
      passwordModal: {
        title: "Change Password",
        current: "Current Password",
        new: "New Password",
        confirm: "Confirm New Password",
        mismatchError: "New passwords do not match",
        cancel: "Cancel",
        changePassword: "Change Password",
      },
      passwordChange: {
        title: "Change Password",
        current: "Current Password",
        new: "New Password",
        confirm: "Confirm New Password",
        cancel: "Cancel",
        save: "Change Password",
      },
    },
    // Notes Page
    notes: {
      title: "Notes",
      noNotes: "No notes yet. Create your first note!",
      newNote: "+ New Note",
      selectNote: "Select a note to view or create a new one",
      backToNotes: "← Back to Notes",
      noContent: "No content. Click Edit to add some notes.",
      created: "Created",
      updated: "Updated",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      deleteConfirm: "Are you sure you want to delete this note?",
      untitledNote: "Untitled Note",
      noteTitlePlaceholder: "Note title...",
      noteContentPlaceholder: "Start typing your note...",
    },
    // Character List Page
    characters: {
      title: "Manage Your Adventurers",
      createNew: "Create New Character",
      loading: "Loading characters...",
      noCharacters: "No characters yet",
      createFirst: "Create Your First Character",
      level: "Level",
      class: "Class",
      race: "Race",
      hp: "Hit Points",
      ac: "AC",
      initiative: "Initiative",
      bonus: "Bonus",
      edit: "Edit",
      delete: "Delete",
      play: "Play",
      details: "Details",
      deleteConfirm: "Are you sure you want to delete this character?",
      abilities: {
        strength: "STR",
        dexterity: "DEX",
        constitution: "CON",
        intelligence: "INT",
        wisdom: "WIS",
        charisma: "CHA",
      },
      error: "Error loading characters",
      createNewCharacter: "Create new character",
    },
    // Login Page
    auth: {
      login: {
        title: "Sign In",
        email: "Email",
        password: "Password",
        showPassword: "Show Password",
        signIn: "Sign In",
        noAccount: "Don't have an account?",
        register: "Register",
        loading: "Signing in...",
        emailPlaceholder: "your@email.com",
      },
      register: {
        title: "Create Account",
        username: "Username",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm Password",
        showPassword: "Show Password",
        signUp: "Sign Up",
        haveAccount: "Already have an account?",
        signIn: "Sign In",
        passwordMismatch: "Passwords do not match",
        loading: "Creating account...",
        usernamePlaceholder: "Choose a username",
        emailPlaceholder: "your@email.com",
      },
    },
    // Game Mode
    gameMode: {
      title: "Game Mode",
      level: "Level",
      exit: "Exit",
      characterDead: "Your character has died",
      revive: "Revive (1 HP)",
      loading: "Loading character...",
    },
    // Character Creation
    characterCreation: {
      title: "Create New Character",
      backgroundTab: "BACKGROUND",
      abilitiesTab: "ABILITIES",
      classesTab: "CLASSES",
      spellsTab: "SPELLS",
      backgroundDesc: "Choose your character's Name, Race, and Background.",
      abilitiesDesc: "Choose your character's Ability Scores.",
      classesDesc: "Choose your character's Class and Level.",
      spellsDesc: "Manage your character's spells and tricks.",
      characterName: "Character Name",
      characterNamePlaceholder: "Enter character name...",
      race: "Race",
      background: "Background",
      backgroundPlaceholder: "Select a background...",
      alignment: "Alignment",
      class: "Class",
      level: "Level",
      cancel: "Cancel",
      create: "Create Character",
      creating: "Creating...",
      error: "Error creating character",
      addSpell: "+ Add Spell",
      importSpells: "+ Import spell",
      noSpells: "No spells. Add some to get started.",
      spellLevel: "Level",
      spellName: "Name",
      prepared: "Prepared",
      close: "Close",
      allLevels: "All Levels",
      searchSpells: "Search spells...",
      noSpellsFound: "No spells found.",
      edition: "Edition",
    },
    // Character Detail
    characterDetail: {
      loading: "Loading character...",
      notFound: "Character not found",
      backToCharacters: "Back to Characters",
      save: "Save",
      cancel: "Cancel",
      play: "▶ Play",
      edit: "Edit",
      delete: "Delete",
      back: "Back",
      deleteConfirm: "Are you sure you want to delete this character?",
      confirmDelete: "Confirm Delete",
      yes: "Yes",
      no: "No",
      // Detail labels
      basicInfo: "Basic Information",
      abilityScores: "Ability Scores",
      combatStats: "Combat Statistics",
      hitPoints: "Hit Points",
      armorClass: "Armor Class",
      notes: "Notes",
      notesPlaceholder: "Add notes about your character...",
      noNotes: "No notes added",
      summary: "Summary",
      hp: "HP",
      ac: "AC",
      backgroundNone: "None",
      edition: "Edition",
    },
    // Errors
    errors: {
      mustBeLoggedIn: "You must be logged in to create a character",
      failedToCreateCharacter: "Failed to create character",
    },
  },
  es: {
    // Navigation
    nav: {
      home: "Inicio",
      characters: "Personajes",
      homebrew: "Contenido personalizado",
      notes: "Notas",
      profile: "Perfil",
    },
    // Hero Section
    hero: {
      title: "Bienvenido a D&D Character Workshop",
      description:
        "Crea, gestiona y rastrea tus personajes de D&D 5e con facilidad. Construye personajes siguiendo reglas oficiales con personalización completa.",
      createButton: "Crear Nuevo Personaje",
      viewButton: "Ver Mis Personajes",
    },
    // Features Section
    features: {
      title: "Características",
      characterCreation: {
        title: "Creación de Personajes",
        description:
          "Utiliza nuestro asistente paso a paso para crear personajes de D&D 5e con soporte completo de clases y subclases.",
        link: "Crear Personaje →",
      },
      characterManagement: {
        title: "Gestionar Personajes",
        description:
          "Ver, editar y organizar todos tus personajes en un solo lugar con soporte multiclase.",
        link: "Ver Todo →",
      },
      gameMode: {
        title: "Modo de Juego",
        description:
          "Rastrea puntos de vida, tiradas de muerte, iniciativa y espacios de hechizo durante combates y encuentros.",
        link: "Jugar Ahora →",
      },
      spellTracking: {
        title: "Seguimiento de Hechizos",
        description:
          "Gestiona hechizos, espacios de hechizo y habilidades para lanzadores con cálculos en tiempo real.",
        link: "Más Información →",
      },
      notes: {
        title: "Notas",
        description:
          "Mantén un registro de tus notas de campaña, historias de personajes y reglas personalizadas.",
        link: "Tomar Notas →",
      },
      profile: {
        title: "Perfil",
        description:
          "Gestiona la configuración de tu cuenta y visualiza tu colección de personajes.",
        link: "Ir al Perfil →",
      },
    },
    // Coming Soon Section
    comingSoon: {
      title: "Próximamente",
      homebrewSystem: {
        title: "🛠️ Sistema de Contenido Personalizado",
        description:
          "Crea y gestiona clases, hechizos y objetos personalizados. Diseña tu propio contenido de D&D y comparte con la comunidad.",
        badge: "Próximamente",
      },
      characterSharing: {
        title: "🔗 Compartir Personajes",
        description:
          "Comparte tus personajes con amigos y otros jugadores. Exporta e importa personajes fácilmente, colabora en campañas.",
        badge: "Próximamente",
      },
    },
    // Quick Stats
    quickStats: {
      edition: "D&D 5e",
      editionDesc: "Reglas y mecánicas oficiales",
      classes: "12+ Clases",
      classesDesc: "Todas las clases con subclases",
      multiclass: "Multiclase",
      multiclassDesc: "Soporte multiclase completo",
    },
    // Footer CTA
    footer: {
      cta: "¿Listo para comenzar tu aventura?",
      button: "Crear Tu Primer Personaje",
    },
    // Homebrew Page
    homebrew: {
      title: "Contenido Personalizado",
      subtitle: "Crea y gestiona contenido personalizado",
      underConstruction: "En Construcción",
      constructionMsg:
        "El sistema de contenido personalizado está siendo forjado. ¡Vuelve pronto!",
    },
    // Profile Page
    // Página de Perfil
    profile: {
      title: "Perfil",
      accountInfo: "Información de la Cuenta",
      username: "Nombre de Usuario",
      email: "Correo Electrónico",
      security: "Seguridad",
      changePassword: "Cambiar Contraseña",
      logout: "Cerrar Sesión",
      editProfile: "Editar Perfil",
      noUsernameSet: "Sin nombre de usuario",
      noEmailSet: "Sin correo electrónico",
      editModal: {
        title: "Editar Perfil",
        username: "Nombre de Usuario",
        email: "Correo Electrónico",
        saveChanges: "Guardar Cambios",
        cancel: "Cancelar",
      },
      passwordModal: {
        title: "Cambiar Contraseña",
        current: "Contraseña Actual",
        new: "Nueva Contraseña",
        confirm: "Confirmar Nueva Contraseña",
        mismatchError: "Las nuevas contraseñas no coinciden",
        cancel: "Cancelar",
        changePassword: "Cambiar Contraseña",
      },
      passwordChange: {
        title: "Cambiar Contraseña",
        current: "Contraseña Actual",
        new: "Nueva Contraseña",
        confirm: "Confirmar Nueva Contraseña",
        cancel: "Cancelar",
        save: "Cambiar Contraseña",
      },
    },
    // Notes Page
    notes: {
      title: "Notas",
      noNotes: "Sin notas aún. ¡Crea tu primera nota!",
      newNote: "+ Nueva Nota",
      selectNote: "Selecciona una nota para ver o crea una nueva",
      backToNotes: "← Volver a Notas",
      noContent: "Sin contenido. ¡Haz clic en Editar para añadir notas!",
      created: "Creada",
      updated: "Actualizada",
      edit: "Editar",
      delete: "Eliminar",
      save: "Guardar",
      cancel: "Cancelar",
      deleteConfirm: "¿Estás seguro de que deseas eliminar esta nota?",
      untitledNote: "Nota Sin Título",
      noteTitlePlaceholder: "Título de la nota...",
      noteContentPlaceholder: "Comienza a escribir tu nota...",
    },
    // Character List Page
    characters: {
      title: "Administra tus Aventureros",
      createNew: "Crear Nuevo Personaje",
      loading: "Cargando personajes...",
      noCharacters: "Sin personajes aún",
      createFirst: "Crea Tu Primer Personaje",
      level: "Nivel",
      class: "Clase",
      race: "Raza",
      hp: "Puntos de Vida",
      ac: "CA",
      initiative: "Iniciativa",
      bonus: "Bonificación",
      edit: "Editar",
      delete: "Eliminar",
      play: "Jugar",
      details: "Detalles",
      deleteConfirm: "¿Estás seguro de que deseas eliminar este personaje?",
      abilities: {
        strength: "FUE",
        dexterity: "DES",
        constitution: "CON",
        intelligence: "INT",
        wisdom: "SAB",
        charisma: "CAR",
      },
      error: "Error al cargar personajes",
      createNewCharacter: "Crear nuevo personaje",
    },
    // Login Page
    auth: {
      login: {
        title: "Iniciar Sesión",
        email: "Correo Electrónico",
        password: "Contraseña",
        showPassword: "Mostrar Contraseña",
        signIn: "Iniciar Sesión",
        noAccount: "¿No tienes cuenta?",
        register: "Registrarse",
        loading: "Iniciando sesión...",
        emailPlaceholder: "tu@correo.com",
      },
      register: {
        title: "Crear Cuenta",
        username: "Nombre de Usuario",
        email: "Correo Electrónico",
        password: "Contraseña",
        confirmPassword: "Confirmar Contraseña",
        showPassword: "Mostrar Contraseña",
        signUp: "Registrarse",
        haveAccount: "¿Ya tienes cuenta?",
        signIn: "Iniciar Sesión",
        passwordMismatch: "Las contraseñas no coinciden",
        loading: "Creando cuenta...",
        usernamePlaceholder: "Elige un nombre de usuario",
        emailPlaceholder: "tu@correo.com",
      },
    },
    // Game Mode
    gameMode: {
      title: "Modo de Juego",
      level: "Nivel",
      exit: "Salir",
      characterDead: "Tu personaje ha muerto",
      revive: "Revivir (1 HP)",
      loading: "Cargando personaje...",
    },
    // Character Creation
    characterCreation: {
      title: "Crear Nuevo Personaje",
      backgroundTab: "TRASFONDO",
      abilitiesTab: "HABILIDADES",
      classesTab: "CLASES",
      spellsTab: "HECHIZOS",
      backgroundDesc: "Elige el Nombre, Raza y Trasfondo de tu personaje.",
      abilitiesDesc: "Elige las puntuaciones de habilidad de tu personaje.",
      classesDesc: "Elige la Clase y Nivel de tu personaje.",
      spellsDesc: "Gestiona los hechizos y trucos de tu personaje.",
      characterName: "Nombre del Personaje",
      characterNamePlaceholder: "Ingresa el nombre del personaje...",
      race: "Raza",
      background: "Trasfondo",
      backgroundPlaceholder: "Selecciona un trasfondo...",
      alignment: "Alineación",
      class: "Clase",
      level: "Nivel",
      cancel: "Cancelar",
      create: "Crear Personaje",
      creating: "Creando...",
      error: "Error al crear personaje",
      addSpell: "+ Añadir Hechizo",
      importSpells: "+ Importar hechizo",
      noSpells: "Sin hechizos. Añade algunos para comenzar.",
      spellLevel: "Nivel",
      spellName: "Nombre",
      prepared: "Preparado",
      close: "Cerrar",
      allLevels: "Todos los Niveles",
      searchSpells: "Buscar hechizos...",
      noSpellsFound: "No se encontraron hechizos.",
      edition: "Edición",
    },
    // Character Detail
    characterDetail: {
      loading: "Cargando personaje...",
      notFound: "Personaje no encontrado",
      backToCharacters: "Volver a Personajes",
      save: "Guardar",
      cancel: "Cancelar",
      play: "▶ Jugar",
      edit: "Editar",
      delete: "Eliminar",
      back: "Atrás",
      deleteConfirm: "¿Estás seguro de que deseas eliminar este personaje?",
      confirmDelete: "Confirmar Eliminación",
      yes: "Sí",
      no: "No",
      // Detail labels
      basicInfo: "Información Básica",
      abilityScores: "Puntuaciones de Habilidad",
      combatStats: "Estadísticas de Combate",
      hitPoints: "Puntos de Vida",
      armorClass: "Clase de Armadura",
      notes: "Notas",
      notesPlaceholder: "Añade notas sobre tu personaje...",
      noNotes: "Sin notas",
      summary: "Resumen",
      hp: "HP",
      ac: "CA",
      backgroundNone: "Ninguno",
    },
    // Errors
    errors: {
      mustBeLoggedIn: "Debes iniciar sesión para crear un personaje",
      failedToCreateCharacter: "Error al crear el personaje",
    },
  },
};

export type Language = "en" | "es";

export const getTranslation = (lang: Language, key: string): string => {
  const keys = key.split(".");
  let value: any = translations[lang];

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      return key; // Return the key if translation not found
    }
  }

  return typeof value === "string" ? value : key;
};

/**
 * Hook para usar el sistema de idioma
 * @param {Language} lang - Idioma actual (en|es)
 * @returns {Function} Función traductora con el idioma preseleccionado
 */
export const useLanguage = (lang: Language) => {
  return (key: string) => getTranslation(lang, key);
};
