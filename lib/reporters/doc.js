
/**
 * Module dependencies.
 */

var Base = require('./base');

/**
 * Expose `Doc`.
 */

exports = module.exports = Doc;

/**
 * Initialize a new `Doc` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Doc(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , total = runner.total
    , indents = 2;

  function indent() {
    return Array(indents).join('  ');
  }

  runner.on('suite', function(suite){
    if (suite.root) return;
    ++indents;
    console.log('%s<section class="suite">', indent());
    ++indents;
    console.log('%s<h1>%s</h1>', indent(), suite.title);
    console.log('%s<dl>', indent());
  });

  runner.on('suite end', function(suite){
    if (suite.root) return;
    console.log('%s</dl>', indent());
    --indents;
    console.log('%s</section>', indent());
    --indents;
  });

  runner.on('pass', function(test){
    console.log('%s<dt>%s</dt>', indent(), test.title);
    var code = strip(test.fn.toString());
    console.log('%s<dd><pre><code>%s</code></pre></dd>', indent(), code);
  });

  runner.on('end', function(){
    process.exit(stats.failures);
  });
}

/**
 * Strip the function definition from `str`.
 */

function strip(str) {
  return str
    .replace(/^function *\(.*\) *{\s*/, '')
    .replace(/\s+\}$/, '');
}