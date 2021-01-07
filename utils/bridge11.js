const ADS1115 = require('ads1115')

connection = [1, 0x48, 'i2c-bus'];

ADS1115.open(...connection).then(async (ads1115) => {
  ads1115.gain = 2;
  setInterval( 
    () => {
      ads1115.measure('0+GND').then((rs) =>{
        // console.log('0+GND: ', rs);
        if (rs > 20000) {
          console.log('HUMAN: ', rs, Date.now());
        }
        // ads1115.measure('1+GND').then((rs) =>{
        //   console.log('1+GND: ', rs)
        // });
      });
      // let y = await ads1115.measure('1+GND');
      // let z = await ads1115.measure('3+GND');
    }, 
    500
  );
});