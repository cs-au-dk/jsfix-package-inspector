import { exec } from 'child_process';
import chalk from 'chalk';
import { join } from 'path'
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


export default (packageName, packageVersions) => {
    // TODO: add fail-safe if a folder with a name packageName@packageVersions... already exists
    const packagesAdded = [];
    let packagesLeft = packageVersions.length
    const scriptPath = join(__dirname, 'scripts', 'dl')
    for (const v of packageVersions) {
        exec(`${scriptPath} ${packageName} ${v}`, function(err, stdout){
            if (err) {
                console.log(err)
            } else {
                console.log(stdout)
                packagesAdded.push(`${packageName}@${v}`)
            }
            packagesLeft--;
            // print result
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
  };