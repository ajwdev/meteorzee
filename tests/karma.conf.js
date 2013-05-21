basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  // stubs come first so they can be available when all the units need them
  'tests/rtd/lib/*-stubs.js',

  // the reason we load unit tests next is because they don't depend on the app. On the contrary,
  // they set mocks ahead of time for the units so they have to be loaded first
  'tests/spec/**/*.js',
  'tests/spec/*.js',

  '.meteor/local/build/static_cacheable/packages/underscore/*.js',

  // simulate loading order of meteor folder structure
  'lib/**/*.js',
  'client/lib/**/*.js',
  'server/lib/**/*.js',

  // now all the dependencies have been sorted, the app code can be loaded
  '*.js'
];

exclude = [
    'karma.conf.js',
    '.meteor/local'
];

autoWatch = true;
reporters = ['dots', 'growl'];
browsers  = ['PhantomJS'];
