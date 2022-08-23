import axios from 'axios'
import { exec } from 'child_process';

// TODO: for each run of the loop we seach for the string 
// "There aren’t any releases here" which means we are done with all the pages.
// Currently we always search 50 release pages...


export default (packageName) => { 

    exec(`npm view ${packageName} repository`, function(error, stdout, stderr){

        const repoUrl = stdout.slice(stdout.indexOf("+") + 1, stdout.indexOf(".git"));

        // Search for a changelog
        for(let i = 0; i <= 5; i++) {
            let testName = "Changelog.md"
            if (i === 1) { testName = "CHANGELOG.md"}
            if (i === 2) { testName = "Changelog"}
            if (i === 3) { testName = "CHANGELOG"}
            if (i === 4) { testName = "changelog"}
            if (i === 5) { testName = "changelog.md"}
            axios.get(`${repoUrl}/blob/-/${testName}`)
            .then(function() {
                console.log(`Changelog: ${repoUrl}/blob/-/${testName}`);
            })
            .catch(function(){
                // The url was not "valid", try the next...
            })
        }

        // Search for releases (only 50 pages)
        for (let i = 1; i <= 50; i++) {
            axios.get(`${repoUrl}/releases`, { params: { page: i }})
            .then(function (response) {
                if(response.data.indexOf("/tag/") != -1) {
                    const foundVersions = []
                    response.data.split("/tag/").forEach(v => {
                        foundVersions.push(v.slice(0,v.indexOf('"')))
                    })
                    foundVersions.slice(1).forEach( v => {
                        if (v.slice(v.indexOf(".")).slice(1,5) === "0.0") {
                            console.log(`Release page: ${repoUrl}/releases/tag/${v}`);
                        }
                    });
                }
            })
            .catch(function() {})
        }
    });
}
