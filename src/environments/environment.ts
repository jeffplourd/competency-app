// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  graphcool: {
    ws: 'wss://subscriptions.us-west-2.graph.cool/v1/cj76ebg5r1g6y0156myese01j',
    simple: 'https://api.graph.cool/simple/v1/cj76ebg5r1g6y0156myese01j'
  },
  firebase: {
    functionsUrl: 'http://localhost:5000/competency-app-dev/us-central1/api'
  }
};
