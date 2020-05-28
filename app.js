var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var compression = require('compression')
var indexRouter = require('./routes/index');
var ridar = require('./routes/ridar');

var http = require('http').Server(app);
var io = require('socket.io')(http);


const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('/dev/ttyUSB0');
const parser = new Readline();
port.pipe(parser);


//미들웨어
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());


//라우트
app.use('/', indexRouter);
app.use('/ridar', ridar);


parser.on('open', function() {
//   port.write('1', function(err) {
//     if (err) {
//       return console.log('Error on write: ', err.message);
//     }
//     console.log('1 written');
//   });
});
 
// open errors will be emitted as an error event
parser.on('error', function(err) {
  console.log('Error: ', err.message);
})
 
//연결이되면
io.on('connection', function(socket){

    var now_temp = "";
    var splitTest;
    // var i = '0';
    parser.on('data', function(data){
        var vDate = new Date();
        
        if(data!="")
            now_temp = vDate.toLocaleString() +" " + data;                        
            splitTest = data.split('/');
            io.to(socket.id).emit('receive message',data);
            console.log(splitTest[0] + "-" + splitTest[1]);
            
            // port.write(i.toString()+"\n");
            // if(i.toString()=='0')
            //   i=1;
            // else
            //   i=0;

    });
      //서버에서 받은 메세지.
      socket.on('send message', function(text){
        console.log(text + "1");
        // parser.write(text);
        port.write(text);
      });

    // console.log('user connected: ', socket.id);
    // if(now_temp!="")
    // {
    // console.log(now_temp);
    // io.to(socket.id).emit('receive message',now_temp);
    // }
   
  //연결 실패하면 log 띄움.
    socket.on('disconnect', function(){
      console.log('user disconnected: ', socket.id);
    });
  
  
  });
  

app.use(function(req, res, next) {
    res.status(404).send('Sorry cant find that!');
  });
  
app.use(function (err, req, res, next) {
   console.error(err.stack)
   res.status(500).send('Something broke!')
});
  
http.listen(3000, function() {
    console.log('Example app listening on port 3000!')
  });
  