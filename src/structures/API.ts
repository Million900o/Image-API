import config from '../config'

import path from 'path'
import express from 'express'

import { LoadRoutes as loadRoutes } from '@jpbberry/load-routes'
import { RestManager } from 'discord-rose'

import { Utils } from '../utils'

import { Cache } from './Cache'
import { Logger } from './Logger'

export class API {
  config = config

  app = express()

  logger = new Logger()
  utils = new Utils(this)
  cache = new Cache(this)
  discord = new RestManager(this.config.discord.token)
  urls: Array<[string, string]> = [
    ['teacup', 'https://img.terano.dev/N4_eb5YZ'],
    ['tomscott', 'https://img.terano.dev/s-0tjXwn'],
    ['drake', 'https://img.terano.dev/3ie1KoSD'],
    ['ussr', 'https://img.terano.dev/gFa5NJ8O'],
    ['chip-1', 'https://img.terano.dev/Fe8RI5yb'],
    ['chip-2', 'https://img.terano.dev/kk-EAtVA'],
    ['trash', 'https://img.terano.dev/ziQdiqDP'],
    ['trash-overlay', 'https://img.terano.dev/CiFV8EQu'],
    ['amiajoke', 'https://img.terano.dev/FctDm-AI'],
    ['buttons', 'https://img.terano.dev/e1jcZ8SE'],
    ['shit', 'https://img.terano.dev/TYBRMY-h']
  ]

  constructor () {
    this.app.set('trust-proxy', true)

    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.json())

    // This must be last
    loadRoutes(this.app, path.join(__dirname, '../routes'), this)

    // Cache some things
    void this.cacheUrls()

    this.app.listen(this.config.api.port, () => {
      this.logger.log('Started on port:', this.config.api.port)
    })
  }

  async cacheUrls (): Promise<void> {
    for (const url of this.urls) {
      try {
        const exists = await this.cache.redis.exists(url[0])
        if (exists) continue

        const buffer = await this.utils.fetchBuffer(url[1])
        await this.cache.redis.setBuffer(url[0], buffer)
      } catch { /* Voided */ }
    }
  }
}
