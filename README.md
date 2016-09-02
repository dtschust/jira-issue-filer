# jira-issue-filer
Files jira issues for you from [redux-bug-reporter](https://github.com/dtschust/redux-bug-reporter)

# Usage
Deploy `jira-issue-filer` to heroku or wherever you'd prefer. For `jira-issue-filer` to work, a `config.js` file must exist at the root level. `config.js` needs to follow the formatted documented by `config.sample.js`, namely:
```js
module.exports = {
  jiraClientConfig: {
    host: 'HOST.atlassian.net',
    basic_auth: {
      username: 'USERNAME@EMAIL.COM',
      password: 'PASSWORD'
    }
  },
  jiraProjectKey: 'FOO'
}
```
`jiraClientConfig` is passed directly into `jira-connector`'s `new JiraClient` constructor. There are other ways to authenticate, see [jira-connector](https://github.com/floralvikings/jira-connector) for full documentation.

`jiraProjectKey` is the key for the project you wish to file a bug. The jira FOO-123 has a key of FOO.
