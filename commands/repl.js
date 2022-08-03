import { exec } from 'child_process';
import repl from 'repl'
import chalk from 'chalk';
import { join } from 'path'
import * as url from 'url';
import fs from 'fs';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default (packageName, packageVersion) => {
    const folderName = (packageVersion ? `${packageName}@${packageVersion}` : `${packageName}`)
    if (fs.existsSync(folderName)) {
        console.log(chalk.red(`The folder ${folderName} already exists`))
    } else {
        exec(`${join(__dirname, 'scripts', 'installPackage')} ${folderName}`, function(err, stdout){
            if (err) {
                console.log(err)
                // If the folder was created before the error, remove the folder again
                if(fs.existsSync(`${folderName}`)) {
                    exec(`${join(__dirname, 'scripts', 'removeFolder')} ${folderName}`);
                }
                console.log(chalk.red(`The error was most likely caused by ${folderName} not being a valid package on npm.`))
            }
            else {
                console.log(chalk.green(chalk.bold(`\n${folderName} was successfully installed in the new folder 
                ${process.cwd()}/${folderName}/auxProject`))); 
                
                process.chdir(`./${folderName}/auxProject`);
                repl.start().write(`const lib = require('${process.cwd()}/node_modules/${packageName}')\r\n`)
            } 
        });
    }
  };
