#!/usr/bin/env node

import { program } from 'commander';
import repl from './commands/repl.js';
import dl from './commands/dl.js';

program.description("Inspecting npm packages made easy")
       .name("package-inspector")
       .usage("<command>")
       .addHelpCommand(false);;
       // TODO: better help desc.

program.command("repl")
       .argument("<package>", "name of the package you want to start a REPL for.")
       .argument("[version]", "version of the package") // if no version parsed, just use the newest version of the package.
       .description("Start a REPL with a specific package and version (e.g., package-inspector repl lodash 4).")
       .action(repl);

program.command("dl")
       .argument("<package>", "name of the package you want to create folders for.")
       .argument("<versions...>", "Versions of the packages.")
       .description("Create folders for packages (e.g., package-inspector dl lodash 3 4).")
       .action(dl);

program.parse(process.argv);
