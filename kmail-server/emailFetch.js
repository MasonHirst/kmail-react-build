const fs = require('fs').promises
const path = require('path')
const process = require('process')
const { authenticate } = require('@google-cloud/local-auth')
const { google } = require('googleapis')

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json')
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json')

module.exports = {
  getLabels: async (req, response) => {
    /**
     * Reads previously authorized credentials from the save file.
     *
     * @return {Promise<OAuth2Client|null>}
     */
    async function loadSavedCredentialsIfExist() {
      try {
        const content = await fs.readFile(TOKEN_PATH)
        const credentials = JSON.parse(content)
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
    let labelsInfo
    async function listLabels(auth) {
      const gmail = google.gmail({ version: 'v1', auth })
      const response = await gmail.users.labels.list({
        userId: 'me',
      })
      const labels = response.data.labels
      if (!labels || labels.length === 0) {
        console.log('No labels found.')
        return
      }
      console.log('Labels:')
      labels.forEach((label) => {
        console.log(`- ${label.name}`)
      })
      res.status(200).send(labels)
    }

    authorize().then(listLabels).catch(console.error)
  },
}








let favoritesInfo
    async function listFavoriteEmails(auth) {
      await fs.writeFile(path.join(process.cwd(), 'authObject.json'), JSON.stringify(auth))
      const gmail = google.gmail({ version: 'v1', auth })
      const res = await gmail.users.messages.list({
        userId: 'me',
        q: 'is:starred',
      })
      const messages = res.data.messages
      if (!messages || messages.length === 0) {
        console.log('No favorite emails found.')
        return
      }
      const messageIds = messages.map((message) => message.id)
      const messagePromises = messageIds.map((id) =>
        gmail.users.messages.get({
          userId: 'me',
          id,
        })
      )
      const messageResponses = await Promise.all(messagePromises)
      const messagesData = messageResponses.map((res) => res.data)
      console.log('Favorite Emails:')
      messagesData.forEach((message) => {
        console.log(`- ${message.snippet}`)
      })
      favoritesInfo = messagesData
    }

    authorize().then(listFavoriteEmails).catch(console.error)
    res.status(200).send(favoritesInfo)







    let authObject = {
      _events: {},
      _eventsCount: 0,
      transporter: {},
      credentials: {
        refresh_token:
          token,
      },
      eagerRefreshThresholdMillis: 300000,
      forceRefreshOnFailure: false,
      certificateCache: {},
      certificateExpiry: null,
      certificateCacheFormat: 'PEM',
      refreshTokenPromises: {},
      _clientId:
        GMAIL_CLIENT_ID,
      _clientSecret: GMAIL_CLIENT_SECRET,
      _refreshToken:
        token,
    }