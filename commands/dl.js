import { exec } from 'child_process';
import chalk from 'chalk';
import { join } from 'path'
import * as url from 'url';
import fs from 'fs';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default (packageName, packageVersions) => {
    const packagesAdded = [];
    let packagesLeft = packageVersions.length
    for (let v of packageVersions) {
        const folderName = (v ? `${packageName}@${v}` : `${packageName}`)
        // Make sure the folder does not already exist
        if (fs.existsSync(folderName)) {
            console.log(chalk.red(`The folder ${folderName} already exists`))
            packagesLeft--;
        }
        else {
            exec(`${join(__dirname, 'scripts', 'installPackage')} ${folderName}`, function(err, stdout){
                if (err) {
                    console.log(err)
                    // If the folder was created before the error, remove the folder again
                    if(fs.existsSync(join(__dirname, `../${folderName}`))) {
                        exec(`${join(__dirname, 'scripts', 'removeFolder')} ${folderName}`);
                    };
                } else {
                    packagesAdded.push(`${folderName}`)
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
