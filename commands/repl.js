import { exec } from 'child_process';
import chalk from 'chalk';
import { join } from 'path'
import * as url from 'url';
import fs from 'fs';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default (packageName, packageVersion) => {
    const scriptPath = join(__dirname, 'scripts', 'repl')
    if(packageVersion) {
        if (fs.existsSync(`${packageName}@${packageVersion}`)) {
            console.log(chalk.red(`The folder ${packageName}@${packageVersion} already exists`))
        }
        else {
            exec(`${scriptPath} ${packageName} ${packageVersion}`, function(err, stdout){
                if (err) {
                    console.log(err)
                    // If the folder was created before the error, remove the folder again
                    if(fs.existsSync(join(__dirname, `../${packageName}@${packageVersion}`))) {
                        exec(`${join(__dirname, 'scripts', 'removeFolder')} ${packageName} ${packageVersion}`);
                    };
                }
                else {
                    console.log(chalk.green(chalk.bold(`\n${packageName}@${packageVersion} was successfully installed in the new folder 
                    ${process.cwd()}/${packageName}@${packageVersion}/auxProject`))); 
                    
                    // TODO: make this automatic, so the user does not have to copy/paste
                    console.log("\nTo start the REPL copy/paste the following two lines into your console:");
                    console.log(chalk.bold(`cd ${packageName}@${packageVersion}/auxProject && node`));
                    console.log(chalk.bold(`const lib = require('${packageName}')`));
                } 
            });
        }
    }
    else {
        if (fs.existsSync(`${packageName}`)) {
            console.log(chalk.red(`The folder ${packageName} already exists, consider giving the version argument`))
        }
        else {
            exec(`${scriptPath} ${packageName}`, function(err, stdout){
                if (err) {
                    console.log(err)
                    // If the folder was created before the error, remove the folder again
                    if(fs.existsSync(join(__dirname, `../${packageName}`))) {
                        exec(`${join(__dirname, 'scripts', 'removeFolder')} ${packageName}`);
                    };
                }
                console.log(stdout)
                console.log(chalk.green(chalk.bold(`\n${packageName} was successfully installed in the new folder 
                ${process.cwd()}/${packageName}/auxProject`))); 
                
                // TODO: make this automatic, so the user does not have to copy/paste
                console.log("\nTo start the REPL copy/paste the following two lines into your console:");
                console.log(chalk.bold(`cd ${packageName}/auxProject && node`));
                console.log(chalk.bold(`const lib = require('${packageName}')`));
            });
        }
    }
  };
