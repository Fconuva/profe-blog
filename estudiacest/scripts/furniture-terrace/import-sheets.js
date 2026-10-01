'use strict';
const path=require('node:path');
require('../furniture-october/import-sheets').importSheets(require('./assets.json'),path.join(__dirname,'source'),path.resolve(__dirname,'../../estudiantes/assets/pieza'))
  .catch(error=>{console.error(error.message);process.exitCode=1;});
