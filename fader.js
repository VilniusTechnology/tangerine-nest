const FaderAdvanced = require('./dist/effector/fader-advanced').FaderAdvanced;
const faderAdvanced = new FaderAdvanced();

const prUp = faderAdvanced.fadeUp(0, 100, 1, 10);

prUp.then((data) => {
    console.log('Splash DONE', data);
    fade();
});

function fade() {
    const faderAdvanced = new FaderAdvanced();
    const prUp = faderAdvanced.fadeUp(100, 255, 6, 1);

    let start = new Date().getTime()
    prUp.then((data) => {
        console.log('fadeUp Top LVL finished.', data);
    
        let finish = new Date().getTime();
        const execTime = finish - start;
    
        console.log(`EXEC TIME: ${execTime}`);
    
        // const prDown = faderAdvanced.fadeDown(255, 253, 1, 1);
        // prDown.then((data) => {
        //     console.log('fadeDown Top LVL finished.', data);
        // }).catch((data) => {
        //     console.log('fadeDown Top LVL finished with err.', data);
        // });
    
    }).catch((data) => {
        console.log('fadeUp Top LVL finished with err.', data);
    });
}

// const prDown = faderAdvanced.fadeDown(253, 0, 5, 1);
// prDown.then((data) => {
//     console.log('fadeDown Top LVL finished.', data);
// }).catch((data) => {
//     console.log('fadeDown Top LVL finished with err.', data);
// });