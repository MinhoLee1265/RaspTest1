var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', function(request, response) {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var html = `<h2>${title}</h2>${description}`

    response.send(html);
  });

  router.get('/:pageid', function (request, response) {

    console.log(request.params.pageid);
    var url_path = request.params.pageid;
    
    if(url_path=="temp")
    {
      response.writeHead(200,{"Content-Type":"text/html"}); 
      //fs.createReadStream(`./html/${url_path}.html`).pipe(response);
      fs.createReadStream(`./views/ridar.ejs`).pipe(response);
    }
    else{
      response.send('sorry');
    }

  });
  

  module.exports = router;