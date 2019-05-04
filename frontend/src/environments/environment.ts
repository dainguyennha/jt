// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiURL: 'http://localhost:5000',
  firebase: {
    apiKey: "AIzaSyCgsLG5a096GfcdafQn1QkiCYk_0Wd44FM",
    authDomain: "demoauthentication-6757f.firebaseapp.com",
    databaseURL: "https://demoauthentication-6757f.firebaseio.com",
    projectId: "demoauthentication-6757f",
    storageBucket: "demoauthentication-6757f.appspot.com",
    messagingSenderId: "851528908574"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
