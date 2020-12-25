var BH1750 = require('bh1750');
var light = new BH1750({
     //options
});
 
light.readLight(function(err, value){
    if (err) {
        console.log("light error: " + err);
        throw err;
    } else {
        console.log("light value is: ", value, "lx");
    }
});

setInterval(()=> {
    light.readLight(function(err, value){
        if (err) {
            console.log("light error: " + err);
            throw err;
        } else {
            console.log("light value is: ", value, "lx");
        }
    });
}, 800)