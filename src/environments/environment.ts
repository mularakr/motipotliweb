// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,

  //for live server 
  apiBaseUrl: 'https://www.motipotli.com/admin/api/v1.0/',
  shareBaseUrl: 'https://www.motipotli.com/',
  logoutUrl:'https://www.motipotli.com/',
  employerUrl:'https://www.motipotli.com/openJob',
  employeeUrl:'https://www.motipotli.com/employeeMyJobs',

  passSalt:'DYhG93b0qyJfmIxfd2fu2uuVoUubWwvniR2G0FgaC9mi',
};
