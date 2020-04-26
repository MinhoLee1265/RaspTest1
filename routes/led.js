var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    res.render('led', {title: 'LED Control'});
});

router.get('/:switch', function(req, res, next){
    var onoff = req.params.switch;
    if(onoff === 'redon') setLED(1);
    else if(onoff === 'redoff') setLED(0);
    else if(onoff === 'yellowon') setLED(2);
    else if(onoff === 'yellowoff') setLED(3);
    else if(onoff === 'greenon') setLED(4);
    else if(onoff === 'greenoff') setLED(5);
    
    res.render('led', { title: 'LED Control : ' + req.params.switch});
});

module.exports = router;

// LED 제어 function
function setLED(flag) {
    var fs = require('fs');
	fs.open('/dev/ttyUSB0','a', 666, function(e, fd) {
		//fs.write(fd, flag ? '1' : '0', null, null, null, function() {
        console.log("FLAG : " + flag);        
        fs.write(fd, String(flag), null, null, (err) => {  
            if(err) {
                fs.close(fd, function() { });
            } 
        });	
	});
}
