'use strict'

const expect = require('chai').expect
const webdriverio = require('webdriverio')
const webdrivercss = require('diosmosis2-webdrivercss')
const startInBackground = require('./utils/start-in-background')

const TEST_SITE_URL = 'https://benaka-moorthi.squarespace.com'
const LOCAL_URL = 'http://localhost:9000'

const INSTALL_SELENIUM_STANDALONE_HELP =
`selenium-standalone is required to run these tests. Install it with:

npm install -g selenium-standalone
selenium-standalone install
`

const INSTALL_SQUARESPACE_LOCAL_HELP =
`squarespace-server is required to run these tests. Install it with:

npm install -g @squarespace/squarespace-server`

describe('template', function () {
  this.timeout(180 * 1000)

  let browser
  before(function * () {
    yield startInBackground({
      executable: 'selenium-standalone',
      args: ['start'],
      waitFor: 'Selenium started',
      help: INSTALL_SELENIUM_STANDALONE_HELP
    })

    yield startInBackground({
      executable: 'squarespace-server',
      args: [TEST_SITE_URL],
      waitFor: 'Local Development Environment',
      help: INSTALL_SQUARESPACE_LOCAL_HELP
    })

    browser = webdriverio.remote({
      desiredCapabilities: {
        browserName: 'chrome',
      },
    })

    webdrivercss.init(browser, { screenWidth: 1200 })

    yield browser.init()
  })

  after(function * () {
    yield browser.end()
  })

  describe('homepage', function () {
    it('should display correctly', function * () {
      const result = yield browser
        .url(`${LOCAL_URL}`)
        .webdrivercss('homepage', {
          name: 'page'
        })

      expect(result.page[0].isWithinMisMatchTolerance).to.be.true
    })
  })

  describe('members directory', function () {
    it('should display correctly', function * () {
      // TODO
    })

    it('should display the list view correctly', function * () {
      // TODO
    })

    it('should launch a dialog when clicking on the list view', function * () {
      // TODO
    })
  })

  describe('normal pages', function * () {
    it('should display /join/ correctly', function * () {
      // TODO
    })

    it('should display /resources/ correctly', function * () {
      // TODO
    })

    it('should display /events/ correctly', function * () {
      // TODO
    })

    it('should display /space-rental/ correctly', function * () {
      // TODO
    })

    it('should display /contact/ correctly', function * () {
      // TODO
    })

    it('should display /about-us/ correctly', function * () {
      // TODO
    })
  })
})
