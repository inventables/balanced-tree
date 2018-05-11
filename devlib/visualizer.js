
(function(port) {
  var visualize = require("../lib/visualize.js");

  var http = require('http'),
    open = require('open'),
    server;

  var shapes = [[{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}, {x: 0, y: 0}]];

  server = http.createServer(function(req, res) {

    res.writeHead(200, {
      'Content-Type': 'text/html'
    });

    var v = visualize.visualize({write: function(s) { res.end(s); }});
    v.addPolygon(shapes, "#00F", "#9F9", 1, 1, 0.4);
    v.generateSVG();

  });

  server.listen(port, '127.0.0.1', function() {
    open('http://127.0.0.1:' + port);
  });
})(1337);
