export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'fr',
  availableLocales: ['fr', 'en'],
  messages: {
    fr: {
      language: {
        fr: 'Français',
        en: 'Anglais'
      },
      common: {
        loading: 'Chargement...',
        error: 'Erreur',
        success: 'Succès',
        cancel: 'Annuler',
        create: 'Créer',
        edit: 'Modifier',
        delete: 'Supprimer',
        save: 'Enregistrer',
        confirm: 'Confirmer',
        actions: 'Actions'
      },
      auth: {
        login: 'Se connecter',
        register: 'Créer un compte',
        logout: 'Déconnexion',
        email: 'Email',
        password: 'Mot de passe',
        showPassword: 'Afficher le mot de passe',
        loginTitle: 'Connectez-vous à votre compte',
        registerTitle: 'Créez votre compte',
        passwordMinLength: 'Min. 6 caractères'
      },
      navigation: {
        settings: 'Paramètres',
        logout: 'Déconnexion'
      },
      servers: {
        gameServers: {
          title: 'Mes serveurs de jeux',
          new: 'Nouveau serveur',
          create: 'Créer un serveur',
          name: 'Nom du serveur',
          game: 'Jeu',
          searchGame: 'Rechercher un jeu...',
          port: 'Port',
          status: {
            running: 'En cours',
            stopped: 'Arrêté'
          },
          actions: {
            start: 'Démarrer',
            stop: 'Arrêter',
            restart: 'Redémarrer',
            delete: 'Supprimer'
          },
          noServers: {
            title: 'Aucun serveur de jeu',
            description: 'Commencez par créer votre premier serveur de jeu'
          }
        }
      }
    },
    en: {
      language: {
        fr: 'French',
        en: 'English'
      },
      common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        create: 'Create',
        edit: 'Edit',
        delete: 'Delete',
        save: 'Save',
        confirm: 'Confirm',
        actions: 'Actions'
      },
      auth: {
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        email: 'Email',
        password: 'Password',
        showPassword: 'Show password',
        loginTitle: 'Sign in to your account',
        registerTitle: 'Create your account',
        passwordMinLength: 'Min. 6 characters'
      },
      navigation: {
        settings: 'Settings',
        logout: 'Logout'
      },
      servers: {
        gameServers: {
          title: 'My Game Servers',
          new: 'New Server',
          create: 'Create Server',
          name: 'Server Name',
          game: 'Game',
          searchGame: 'Search for a game...',
          port: 'Port',
          status: {
            running: 'Running',
            stopped: 'Stopped'
          },
          actions: {
            start: 'Start',
            stop: 'Stop',
            restart: 'Restart',
            delete: 'Delete'
          },
          noServers: {
            title: 'No Game Servers',
            description: 'Start by creating your first game server'
          }
        }
      }
    }
  }
})) 