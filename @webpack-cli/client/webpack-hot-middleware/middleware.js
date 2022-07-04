module.exports = webpackHotMiddleware;

var helpers = require('./helpers');
var pathMatch = helpers.pathMatch;

// // 做兼容
function hook(compiler, hookName, pluginName, fn) {
  if (arguments.length === 3) {
    fn = pluginName;
    pluginName = hookName;
  }
  if (compiler.hooks) {
    compiler.hooks[hookName].tap(pluginName, fn);
  } else {
    compiler.plugin(pluginName, fn);
  }
}

var latestStats = null;
function webpackHotMiddleware(compiler, opts) {
  opts = opts || {};
  opts.log =
    typeof opts.log == 'undefined' ? console.log.bind(console) : opts.log;
  opts.path = opts.path || '/__webpack_hmr';
  opts.heartbeat = opts.heartbeat || 10 * 1000;

  var eventStream = createEventStream(opts.heartbeat);

  var closed = false;

  if (compiler.hooks) {
    // compiler.hooks.emit.tap('webpack-hot-middleware', (compilation) => {
    //   for (const name in compilation.assets) {
    //     if (compilation.assets.hasOwnProperty(name) && name.endsWith('.js')) {
    //       const contents = compilation.assets[name].source();
    //       const withoutComments = 'alert(1);' + '\n' + '\n' + contents;
    //       compilation.assets[name] = {
    //         source: () => withoutComments,
    //         size: () => withoutComments.length,
    //       };
    //     }
    //   }
    // });
    compiler.hooks.invalid.tap('webpack-hot-middleware', onInvalid);
    compiler.hooks.done.tap('webpack-hot-middleware', onDone);
  } else {
    compiler.plugin('invalid', onInvalid);
    compiler.plugin('done', onDone);
  }
  function onInvalid() {
    if (closed) return;
    if (opts.log) opts.log('webpack building...');
    eventStream.publish({ action: 'building' });
  }
  function onDone(statsResult) {
    if (closed) return;
    // Keep hold of latest stats so they can be propagated to new clients
    publishStats(statsResult, eventStream, opts.log);
  }
  var middleware = function (req, res, next) {
    if (closed) return next();
    if (!pathMatch(req.url, opts.path)) return next();
    eventStream.handler(req, res);
    if (latestStats) {
      eventStream.publish(latestStats);
    }
  };
  middleware.publish = function (payload) {
    if (closed) return;
    eventStream.publish(payload);
  };
  middleware.close = function () {
    if (closed) return;
    // Can't remove compiler plugins, so we just set a flag and noop if closed
    // https://github.com/webpack/tapable/issues/32#issuecomment-350644466
    closed = true;
    eventStream.close();
    eventStream = null;
  };
  return middleware;
}

function createEventStream(heartbeat) {
  var clientId = 0;
  var clients = {};
  function everyClient(fn) {
    Object.keys(clients).forEach(function (id) {
      fn(clients[id]);
    });
  }
  var interval = setInterval(function heartbeatTick() {
    everyClient(function (client) {
      client.write('data: \uD83D\uDC93\n\n');
    });
  }, heartbeat).unref();
  return {
    close: function () {
      clearInterval(interval);
      everyClient(function (client) {
        if (!client.finished) client.end();
      });
      clients = {};
    },
    handler: function (req, res) {
      var headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/event-stream;charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        // While behind nginx, event stream should not be buffered:
        // http://nginx.org/docs/http/ngx_http_proxy_module.html#proxy_buffering
        'X-Accel-Buffering': 'no',
      };

      var isHttp1 = !(parseInt(req.httpVersion) >= 2);
      if (isHttp1) {
        req.socket.setKeepAlive(true);
        Object.assign(headers, {
          Connection: 'keep-alive',
        });
      }

      res.writeHead(200, headers);
      res.write('\n');
      var id = clientId++;
      clients[id] = res;
      req.on('close', function () {
        if (!res.finished) res.end();
        delete clients[id];
      });
    },
    publish: function (payload) {
      everyClient(function (client) {
        client.write('data: ' + JSON.stringify(payload) + '\n\n');
      });
    },
  };
}

function publishStats(statsResult, eventStream, log) {
  var stats = statsResult.toJson({
    // all: false,
    // cached: true,
    // children: true,
    // modules: true,
    // timings: true,
    // hash: true,
  });

  if (statsResult.hasErrors()) {
    for (let item of stats.errors) {
      const {
        action = 'error',
        time,
        hash,
        warnings = [],
        message = [],
      } = item;
      latestStats = {
        name: '',
        action: action,
        time: time || '',
        hash: hash || '',
        warnings: warnings || [],
        errors: [message],
      };
      eventStream.publish(latestStats);
    }
  } else if (statsResult.hasWarnings()) {
    for (let item of stats.warnings) {
      const {
        action = 'warnings',
        time,
        hash,
        errors = [],
        message = [],
      } = item;
      latestStats = {
        name: '',
        action: action,
        time: time || '',
        hash: hash || '',
        warnings: [message] || [],
        errors: errors || [],
      };
      eventStream.publish(latestStats);
    }
  } else {
    latestStats = {
      name: '',
      action: 'success',
      time: '',
      hash: '',
      warnings: [],
      errors: [],
    };
    eventStream.publish(latestStats);
    latestStats = {
      ...latestStats,
      action: 'sync',
    };
  }
}
