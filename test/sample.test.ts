import { afterAll, beforeAll, describe, test } from 'vitest'
import { preview, PreviewServer } from 'vite'
import { chromium, Browser, Page } from 'playwright'
import { expect } from '@playwright/test'

describe('sample', async () => {
  let server: PreviewServer
  let browser: Browser
  let page: Page

  beforeAll(async () => {
    server = await preview({ preview: { port: 3000 }, build: { outDir: 'public' } })
    browser = await chromium.launch()
    page = await browser.newPage()
  })

  afterAll(async () => {
    await browser.close()
    await new Promise<void>((resolve, reject) => {
      server.httpServer.close(error => error ? reject(error) : resolve())
    })
  })

  test('title', async () => {
    // setup
    await page.goto('http://localhost:3000')

    // verify
    const title = await page.title()
    expect(title).toBe('Vitest Test Page')
  }, 60_000)

  test('pagetitle', async () => {
    // setup
    await page.goto('http://localhost:3000')

    // verify
    const pagetitle = page.locator('#pagetitle')
    await expect(pagetitle).toHaveText('Vitest Test')
  }, 60_000)
})
