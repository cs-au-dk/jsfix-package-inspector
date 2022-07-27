import { exec } from 'child_process';
import chalk from 'chalk';
import { join } from 'path'
import * as url from 'url';
import fs from 'fs';

// The absolute path of this file (used when the package is installed globally)
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


export default (packageName, packageVersions) => {
    const packagesAdded = [];
    let packagesLeft = packageVersions.length
    let scriptPath = join(__dirname, 'scripts', 'dl')
    for (let v of packageVersions) {
        // Make sure the folder does not already exist
        if (fs.existsSync(`${packageName}@${v}`)) {
            console.log(chalk.red(`The folder ${packageName}@${v} already exists`))
            packagesLeft--;
        }
        else {
            exec(`${scriptPath} ${packageName} ${v}`, function(err, stdout){
                if (err) {
                    console.log(err)
                    // If the folder was created before the error, remove the folder again
                    if(fs.existsSync(join(__dirname, `../${packageName}@${v}`))) {
                        exec(`${join(__dirname, 'scripts', 'removeFolder')} ${packageName} ${v}`);
                    };
                } else {
                    packagesAdded.push(`${packageName}@${v}`)
                }
                packagesLeft--;
                if (packagesLeft <= 0) {
                    if (packagesAdded.length > 0) {
                        for (const p of packagesAdded) {
                            console.log(chalk.green(chalk.bold(`${p} was added to the new folder 
                            ${process.cwd()}/${p}/auxProject`)))
                        }
                        console.log("\n")
                    }
                }
                
            });
        }
    }
  };
