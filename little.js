// http://gist.github.com/506790
function token(n){
    var salt = 'abcdefghijklmnopqrstuvwxyz0123456789', key = '', len = n || 6, length = salt.length, i = 0;
    if (length < len) {
    	while(salt.length < len) {
    		salt += salt;
    	}
    	length = salt.length;
    }
    for (; i<len; key+=salt.charAt(Math.floor(Math.random()*length)), i++);
    return key;
}

// http://gist.github.com/315070
function sprintf(){
	var args = Array.prototype.slice.call(arguments);
	return args.shift().replace(/%s/g, function(){
		return args.shift();
	});
}

var server = '127.0.0.1', port = 8204;

var http = require('http'), url = require('url'), fs = require('fs');

http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname.substr(1);
    if (!/^$/.test(uri) && /^([a-z0-9]{6})(\+)?$|^https?/.test(uri)) {
	    if (/^([a-z0-9]{6})(\+)?$/.test(uri)) {
			fs.readFile(sprintf('cache/%s', uri), function(err, data) {
				if (err) { throw err; }
				response.writeHead(302, {'Location':data});
				response.end(data);
				return;
			});
	    } else {
	    	var slug = token(6);
	    	// We're (lazily) not checking if an entry already exists, so a URL can be little'd multiple times.
	    	fs.writeFile(sprintf('cache/%s', slug), uri, function(err){
	    		if (err) { throw err; }
    			response.writeHead(200, {'Content-Type':'text/plain'});
    			response.end(sprintf('http://%s:%s/%s', server, port, slug));
    			return;
	    	});
	    }
    } else {
	    response.writeHead(200, {'Content-Type': 'text/plain'});
	    response.end('little.js\n');
    }
}).listen(port, server);
console.log(sprintf('Server running at http://%s:%s/', server, port));