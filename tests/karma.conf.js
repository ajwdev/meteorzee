basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  // stubs come first so they can be available when all the units need them
  'tests/rtd/lib/*-stubs.js',

  // simulate loading order of meteor folder structure
  'lib/**/*.js',
  'client/lib/**/*.js',
  'server/lib/**/*.js',
                  
  // Load meteor Underscore package
  '.meteor/local/build/static_cacheable/packages/underscore/*.js',

  // Load specs
  'tests/spec/**/*.js',
  'tests/spec/*.js',

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
