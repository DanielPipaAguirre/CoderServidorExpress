process.on('message', max => {
    let element = {};
    for (let index = 0; index < max; index++) {  
        const random = Math.floor(Math.random() * 1000) + 1;
        if(!element[random]) {
            element[random] = 0
        }
        element[random] = element[random] + 1
    }
    process.send(element);
});