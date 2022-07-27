import { exec } from 'child_process';
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
                if(fs.existsSync(join(__dirname, `../${folderName}`))) {
                    exec(`${join(__dirname, 'scripts', 'removeFolder')} ${folderName}`);
                };
            }
            else {
                console.log(chalk.green(chalk.bold(`\n${folderName} was successfully installed in the new folder 
                ${process.cwd()}/${folderName}/auxProject`))); 
                
                // TODO: make this automatic, so the user does not have to copy/paste
                console.log("\nTo start the REPL copy/paste the following two lines into your console:");
                console.log(chalk.bold(`cd ${folderName}/auxProject && node`));
                console.log(chalk.bold(`const lib = require('${packageName}')`));
            } 
        });
    }
  };
