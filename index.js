#!/usr/bin/env node

import { program } from 'commander';
import repl from './commands/repl.js';
import dl from './commands/dl.js';
import exec from './commands/exec.js'

program.description("Inspecting npm packages made easy")
       .name("package-inspector")
       .usage("<command>")
       .addHelpCommand(false);
       // TODO: better help desc.

program.command("repl")
       .argument("<package>", "name of the package you want to start a REPL for.")
       .argument("[version]", "version of the package") // if no version parsed, just use the newest version of the package.
       .description("Start a REPL with a specific package and version (e.g., package-inspector repl lodash 4).")
       .action(repl);

program.command("dl")
       .argument("<package>", "name of the package you want to create folders for.")
       .argument("<versions...>", "Versions of the packages.")
       .option("-c, --class", "Write all the package class interfaces to a seperate file")
       .description("Create folders for packages (e.g., package-inspector dl lodash 3 4).")
       .action(dl);

program.command("exec")
       .argument("<exp>", "expression/file.")
       .argument("<package>", "name of the package you want to use.")
       .argument("<versions...>", "Versions of the packages.")
       .option("-f, --file", "Execute a file containing multiple expressions (e.g., package-inspector exec exps.txt -f lodash 3 4).")
       .description("Run either a single expression or a file with expressions on each versions of the package (e.g., package-inspector exec exps.txt -f lodash 3 4).")
       .action(exec);

program.parse(process.argv);
