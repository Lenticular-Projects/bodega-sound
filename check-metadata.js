const sharp = require('sharp');
const fs = require('fs');

const path = 'public/images/logo/bodegarotatinglogosmall-ezgif.com-video-to-webp-converter.webp';

sharp(path)
    .metadata()
    .then(metadata => {
        console.log('Width:', metadata.width);
        console.log('Height:', metadata.height);
        console.log('Pages:', metadata.pages); // Number of frames
        console.log('Loop:', metadata.loop);
        console.log('Delay:', metadata.delay);
    })
    .catch(err => {
        console.error(err);
    });
