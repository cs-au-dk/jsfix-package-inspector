# package-inspector

Save time inspecting npm packages by letting package-inspector do most of the work.

Package-inspector provides a cli, helping you to quickly install different versions of different npm packages.

## Installation

```sh
npm install -g package-inspector
```

## Usage

Package-inspector is made to be used on the command line, currently providing the commands `repl` and `dl`. Also you can always use the argument `-h/--help` to get help.

```console
$ package-inspector -h
Usage: package-inspector <command>

Inspecting npm packages made easy

Options:
  -h, --help                  display help for command

Commands:
  repl <package> [version]    Start a REPL with a specific package and version (e.g., package-inspector repl lodash 4).
  dl <package> <versions...>  Create folders for packages (e.g., package-inspector dl lodash 3 4).
```

### The `repl <package> [version]` command

The `repl` command is ment for quickly testing a single version of a package, providing easy access to this package in the node.js repl environment. `repl` takes two arguments, the package name and the version of the package. The second argument is optional, and the default value is the most recent version of the package provided. See the `-h` option for an example.

```console
$ package-inspector repl -h
Usage: package-inspector repl [options] <package> [version]

Start a REPL with a specific package and version (e.g., package-inspector repl lodash 4).

Arguments:
  package     name of the package you want to start a REPL for.
  version     version of the package

Options:
  -h, --help  display help for command
```

### The `dl <package> <versions...>` command

The `dl` command is ment for comparing two versions of the same npm package. By providing severel version arguments, package-inspector will create multiple new directories, with the specified versions installed in their own directory. The command takes two arguments, the first being the package name and the second being a list of version numbers. See the `-h` option for an example.

```console
$ package-inspector dl -h
Usage: package-inspector dl [options] <package> <versions...>

Create folders for packages (e.g., package-inspector dl lodash 3 4).

Arguments:
  package     name of the package you want to create folders for.
  versions    Versions of the packages.

Options:
  -h, --help  display help for command
```
