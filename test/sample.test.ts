import { afterAll, beforeAll, describe, test, expect } from 'vitest'
import { preview, PreviewServer } from 'vite'
import { chromium, Browser, Page } from 'playwright'
import { expect as expectEx } from '@playwright/test'
import { toMatchImageSnapshot } from 'jest-image-snapshot'

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchImageSnapshot(): R
    }
  }
}

expect.extend({ toMatchImageSnapshot })

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
    expect(await page.content()).toMatchSnapshot()
    expect(await page.screenshot()).toMatchImageSnapshot()
    expect(title).toBe('Vitest Test Page')
  })

  test('pagetitle', async () => {
    // setup
    await page.goto('http://localhost:3000')

    // verify
    const pagetitle = page.locator('#pagetitle')
    expect(await pagetitle.innerText()).toBe('Vitest Test')
    await expectEx(pagetitle).toHaveText('Vitest Test')
    expect(await page.screenshot()).toMatchImageSnapshot()
  })
})
