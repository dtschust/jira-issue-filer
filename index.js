var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var parser = require('ua-parser-js')

var jiraClientConfig = require('./config.js').jiraClientConfig
var jiraProjectKey = require('./config.js').jiraProjectKey

var JiraClient = require('jira-connector')

var jira = new JiraClient(jiraClientConfig)

app.use(bodyParser.json())
app.set('port', (process.env.PORT || 3001))

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.get('/', function (req, res) {
  res.status(200).end()
})

app.post('/', function (req, res) {
  let {useragent, notes, description, screenshotURL, reporter, actions, initialState, state, consoleErrors, meta, windowDimensions, windowLocation} = req.body
  try {
    actions = JSON.stringify(actions)
    state = JSON.stringify(state)
    initialState = JSON.stringify(initialState)
    meta = JSON.stringify(meta)
  } catch (e) {
    res.status(500).json({})
  }
  var { name: uaName, version: uaVersion } = parser(useragent).browser
  let summary = `${description}`
  let body = `h1. Notes
${notes}

h1. Meta information
_Bug filed by_: ${reporter}
_Screenshot URL (if added)_: ${screenshotURL}
_Console Errors_: {code:javascript}${consoleErrors}{code}
_URL_: ${windowLocation}
_Window Dimensions_: ${windowDimensions}
_Meta information_: ${meta}
_User Agent_: ${uaName} version ${uaVersion}

Playback script:
{code:javascript}window.bugReporterPlayback(${actions},${initialState},${state},100){code}

Bug submitted through [redux-bug-reporter|https://github.com/dtschust/redux-bug-reporter]
`
  let issue = {
    fields: {
      project: {
        key: jiraProjectKey
      },
      summary,
      description: body,
      issuetype: {
        name: 'Bug'
      }
    }
  }

  jira.issue.createIssue(issue, function (error, issue) {
    if (error) {
      res.status(500).json({})
    } else {
      res.status(200).json(issue)
    }
  })
})

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'))
})
