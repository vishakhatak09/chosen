// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    hmr       : false,
    baseUrl: 'http://localhost:4200/',
    imageBaseUrl: 'http://localhost:4200/',
    serverBaseUrl: 'https://staging-api.chosenyou.com:3000/',
    serverImagePath: 'https://staging-api.chosenyou.com/dist/public/upload/',
    analyticsApiKey: 'AIzaSyBhqmTBy1mw-KnP7vN2-aF-kz_bt8xJVpM',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
