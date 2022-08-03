import { exec, spawn } from 'child_process';
import chalk from 'chalk';
import { join } from 'path'
import * as url from 'url';
import fs from 'fs';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default (packageName, packageVersions, options) => {
    const packagesAdded = [];
    let classDefs = "" // Used when the -c/--class flag is set
    
    console.log("Estimated time: " + (2*packageVersions.length + " seconds"))
    // TODO: Give the user the option to choose a custom folder name
    // Make sure the folder does not already exist
    if (fs.existsSync(packageName)) {
        console.log(chalk.red(`The folder ${packageName} already exists`))
        return;
    }
    for (let v of packageVersions) {
        const folderName = (v ? `${packageName}@${v}` : `${packageName}`)
        exec(`mkdir ${packageName}`);
        exec(`cd ${packageName} && ${join(__dirname, 'scripts', 'installPackage')} ${folderName}`, function(err, stdout){
            if (err) {
                console.log(err)
                // If the folder was created before the error, remove the folder again
                if(fs.existsSync(`${packageName}/${folderName}`)) {
                    exec(`${join(__dirname, 'scripts', 'removeFolder')} ${packageName}/${folderName}`);
                };
                console.log(chalk.red(`The error was most likely caused by ${folderName} not being a valid package on npm.`))
            } else {
                packagesAdded.push(`${folderName}`)

                // If the -c/--class flag is used, we output the class defs. of the versions in a "classDefs" text file in the new shared folder.
                if (options.class) {
                    const nodeRepl = spawn('node', { cwd: `${packageName}/${folderName}/auxProject` });
                    nodeRepl.stdout.pipe(process.stdout);

                    nodeRepl.stdout.on('data', (data) => { classDefs += data; })
                    nodeRepl.stderr.on('data', (data) => { console.log(`stderr: ${data}`); })

                    nodeRepl.stdin.write(`const lib = require('${packageName}')\r\n`);
                    nodeRepl.stdin.write(`console.log("${folderName} class:")\r\n`);
                    nodeRepl.stdin.end('console.log(lib)\r\n');

                }
            }     
        });
    }

    // TODO: Since the program is currently asynchronous this last part would be executed before the packages was downloaded,
    // hence the timeout was used. Would be nice to make the program synchronous. (would also get faster runtimes)
    setTimeout(() =>{
        if (packagesAdded.length > 0) {
            for (const p of packagesAdded) {
                console.log(chalk.green(chalk.bold(`${p} was added to the new folder
                ${process.cwd()}/${packageName}/${p}/auxProject`)))
            }
            console.log("\n")
        }

        // If no version of the package was successfully downloaded, remove the folder.
        fs.readdir(packageName, (err, files) => {
            if (err) {
                console.log("Err: " + err)
            } else if (!files.length) {
                exec(`${join(__dirname, 'scripts', 'removeFolder')} ${packageName}`);
            } else {
                // Not empty = a package have been successfully downloaded

                // -c/--class flag
                if (options.class) {
                    fs.writeFile(`${packageName}/classDefs`, classDefs, err => {
                        if (err) {
                        console.error(err);
                        }
                        // file written successfully
                    });
                }
            }
        })


    }, 2000 * packageVersions.length); // We give the program 2s. to download pr. version 

  };
