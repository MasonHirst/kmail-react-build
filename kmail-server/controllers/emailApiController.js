const User = require('../models/users')
require('dotenv').config
const fs = require('fs').promises
const path = require('path')
const process = require('process')
const { authenticate } = require('@google-cloud/local-auth')
const { google } = require('googleapis')
const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET } = process.env

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json')
const TOKEN_PATH = path.join(process.cwd(), 'token.json')

module.exports = {
  getTestInfo: async (req, res) => {
    /**
     * Reads previously authorized credentials from the save file.
     *
     * @return {Promise<OAuth2Client|null>}
     */
    async function loadSavedCredentialsIfExist() {
      try {
        const content = await fs.readFile(TOKEN_PATH)
        const credentials = JSON.parse(content)
        console.log('credentials: ', credentials);
        return google.auth.fromJSON(credentials)
      } catch (err) {
        return null
      }
    }

    /**
     * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
     *
     * @param {OAuth2Client} client
     * @return {Promise<void>}
     */
    async function saveCredentials(client) {
      const content = await fs.readFile(CREDENTIALS_PATH)
      const keys = JSON.parse(content)
      const key = keys.installed || keys.web
      const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
      })
      await fs.writeFile(TOKEN_PATH, payload)
    }

    /**
     * Load or request or authorization to call APIs.
     *
     */
    async function authorize() {
      let client = await loadSavedCredentialsIfExist()
      if (client) {
        return client
      }
      client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
      })
      if (client.credentials) {
        await saveCredentials(client)
      }
      return client
    }

    /**
     * Lists the labels in the user's account.
     *
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    async function listLabels(auth) {
      let authObject = {
        "_events": {},
        "_eventsCount": 0,
        "transporter": {},
        "credentials": {
          "refresh_token": "1//06YmyhRGgveiUCgYIARAAGAYSNwF-L9IrqRhXBwq_6dZmvUrRGBt4fiiXUG5fw4zpc5-lfWrtuob2bV-CZ7A2gSowSKLzvDAWYIc"
        },
        "eagerRefreshThresholdMillis": 300000,
        "forceRefreshOnFailure": false,
        "certificateCache": {},
        "certificateExpiry": null,
        "certificateCacheFormat": "PEM",
        "refreshTokenPromises": {},
        "_clientId": "216906597130-r6il65eciv223evvi17h7d2u1u7l3sq1.apps.googleusercontent.com",
        "_clientSecret": "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",
        "_refreshToken": "1//06YmyhRGgveiUCgYIARAAGAYSNwF-L9IrqRhXBwq_6dZmvUrRGBt4fiiXUG5fw4zpc5-lfWrtuob2bV-CZ7A2gSowSKLzvDAWYIc"
      }
      
      // console.log('info: ', auth.UserRefreshClient);
      const gmail = google.gmail({ version: 'v1', auth: google.auth.fromJSON(authObject) })
      const response = await gmail.users.labels.list({
        userId: 'me',
      })
      const labels = response.data.labels
      if (!labels || labels.length === 0) {
        console.log('No labels found.')
        return
      }
      // console.log('Labels:')
      labels.forEach((label) => {
        // console.log(`- ${label.name}`)
      })
      res.status(200).send(labels)
    }

    authorize().then(listLabels).catch(console.error)
  },
}
