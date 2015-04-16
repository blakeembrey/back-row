declare var __URL__: string

declare var process: Process

interface Process {
  env: {
    NODE_ENV: string
    TRAKT_TV_CLIENT_ID: string
    TRAKT_TV_CLIENT_SECRET: string
  }
}

declare function require (module: string): any
