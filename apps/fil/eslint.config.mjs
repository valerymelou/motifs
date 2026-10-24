import angularConfig from '../../eslint.angular.config.mjs';

export default [
  ...angularConfig,
  // The code samples are the page's content, written for each language's
  // own conventions, not this app's.
  { ignores: ['src/app/code/samples/**'] },
];
