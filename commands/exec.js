import { exec, spawnSync } from 'child_process';
import chalk from 'chalk';
import { join } from 'path'
import * as url from 'url';
import fs from 'fs';
import tmp from 'tmp';
import { cwd } from 'process';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default (exp, packageName, packageVersion, options) => {
    
    const expToRUn = options.file ? 
        fs.readFileSync(exp, 'utf-8') :
        `const lib = require('${packageName}')\r\n ${exp}\r\n`;

    tmp.setGracefulCleanup();
    tmp.dir({unsafeCleanup: true}, function _dirSync(err, path) {
        if (err) throw err;

        process.chdir(path)

        for (const v of packageVersion) {

            const pNameAndVersion = `${packageName}@${v}`
            const versionFolder = `${v}.x`

            exec(`${join(__dirname, 'scripts', 'installPackage')} ${pNameAndVersion} ${versionFolder}`, function(err){
                if (err) {
                    console.log(chalk.red(chalk.bold(`Error occured when installing ${packageName}@${v}`)))
                    console.log(err)
                    console.log(chalk.red(chalk.bold(`The error was most likely caused by ${pNameAndVersion} not being a valid package on npm.`)))
                } else {

                    let waitTime = 0;
                    if (options.additionalPackages) {
                        waitTime = 2000 * Object.keys(options.additionalPackages).length; // 2s pr. additional package
                        for(const additionalPackage of options.additionalPackages) {
                            exec(`cd ${versionFolder} && npm install ${additionalPackage} `, function(err){ 
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log(`Successfully installed ${additionalPackage} before testing ${pNameAndVersion}`);
                                }
                            });
                        }
                    }

                    // setTimeout to make sure we install additional packages before we execute the expression(s)
                    setTimeout(() =>{
                        // Use sync to make sure output from each version can be distinguished from each other
                        const result = spawnSync('node', { 
                            cwd: `./${versionFolder}`,
                            stdio: ['pipe', 'pipe', 'inherit'],
                            encoding: 'utf-8',
                            shell: true,
                            input: expToRUn,
                        });
                        if (result.status > 0) { // Error occured 
                            console.log(chalk.red(chalk.bold(`Error occured when executing on ${packageName}@${v}`)))
                        } else {
                            // logs trying to seperate the results of the different versions
                            console.log(chalk.green(chalk.bold(`---------------------------------------------------------------------`)))
                            console.log(chalk.green(chalk.bold(`Executing on ${packageName}@${v} was successful`)))
                            console.log(result.stdout);
                            console.log(chalk.green(chalk.bold(`---------------------------------------------------------------------`)))
                        }
                
                    }, waitTime); // We give the program 2s. to download pr. version 
                }     
            });
            
        }

    });
};
