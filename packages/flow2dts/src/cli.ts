// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import yargs from "yargs"
import glob from "fast-glob"
import path from "path"
import chalk from "chalk"

import { convert } from "./convert"
import { initVisitorObjects, OverridesVisitor } from "./transform/applyOverridesVisitors"
import { ResolvedHintEntries, ResolvedHintFile } from "./transform/state"

const FLOW_EXTNAME = ".js.flow"
const TS_EXTNAME = ".d.ts"

async function run({
  rootDir,
  outDir,
  overridesPaths,
  hintPath,
  platform,
  patterns,
  cwd,
}: {
  rootDir: string
  outDir: string
  overridesPaths?: string[]
  hintPath?: string
  platform: string
  patterns: string[]
  cwd?: string
}): Promise<
  [
    numberOfFiles: number,
    successCount: number,
    overridesWithoutMatches: string[],
    wildcardOverridesWithSingleMatches: string[]
  ]
> {
  const overridesVisitors =
    overridesPaths === undefined
      ? undefined
      : overridesPaths.reduce<OverridesVisitor[]>(
          (all, overridesPath) => [...all, ...require(overridesPath).default],
          []
        )
  const overridesVisitorObjects = overridesVisitors && initVisitorObjects(overridesVisitors)
  const hintEntries = hintPath === undefined ? undefined : (require(hintPath) as ResolvedHintEntries)
  let successCount = 0
  const conversions: Array<Promise<void>> = []
  for await (const _filename of glob.stream(patterns, { absolute: true, cwd })) {
    const filename = _filename as string
    const matchedExtname = getExtname(filename, platform)
    if (matchedExtname) {
      let hintFile: ResolvedHintFile | undefined
      if (hintEntries) {
        const key = filename.substr(rootDir.length).replace(/\\/g, "/")
        hintFile = hintEntries.files[key]
        if (!hintFile) {
          throw new Error(`Missing hint file for ${key}`)
        }
      }
      const outFilename = getOutFilename(outDir, rootDir, filename, matchedExtname)
      const overrideFilename = overridesVisitors && getOverrideFilename(rootDir, filename)
      logStart(cwd, filename)
      conversions.push(
        convert({ rootDir, filename, outFilename, hintFile, overridesVisitorObjects, overrideFilename }).then(
          ([outFilename, success]) => {
            if (success) {
              successCount++
            }
            logEnd(cwd, outFilename, success)
          }
        )
      )
    }
  }
  await Promise.all(conversions)
  const overridesWithoutMatches = overridesVisitorObjects
    ? overridesVisitorObjects.filter((o) => o.madeChangesToNumberOfFiles === 0).map((o) => o.pathPattern)
    : []
  const wildcardOverridesWithSingleMatches = overridesVisitorObjects
    ? overridesVisitorObjects
        .filter((o) => o.madeChangesToNumberOfFiles === 1 && o.pathPattern.includes("*"))
        .map((o) => o.pathPattern)
    : []
  return [conversions.length, successCount, overridesWithoutMatches, wildcardOverridesWithSingleMatches]
}

function logEnd(cwd: string | undefined, outFilename: string, success: boolean) {
  const relativeOutFilename = relativePath(cwd, outFilename)
  console.log(success ? chalk.green(`✓ ${relativePath(cwd, outFilename)}`) : chalk.red(`‼️ ${relativeOutFilename}`))
}

function logStart(cwd: string | undefined, filename: string) {
  console.log(`⚒️ ${chalk.dim(relativePath(cwd, filename))}`)
}

function relativePath(cwd: string | undefined, filename: string) {
  return path.relative(cwd || ".", filename)
}

function getExtname(filename: string, platform: string) {
  const platformExtname = `.${platform}${FLOW_EXTNAME}`
  const basename = path.basename(filename)
  const extname = basename.substring(basename.indexOf("."))
  return extname === FLOW_EXTNAME ? FLOW_EXTNAME : extname === platformExtname ? platformExtname : null
}

function getOutFilename(outDir: string, rootDir: string, filename: string, matchedExtname: string) {
  return path.join(outDir, path.relative(rootDir, filename)).replace(matchedExtname, TS_EXTNAME)
}

function getOverrideFilename(rootDir: string, filename: string) {
  return path.relative(rootDir, filename).replace(FLOW_EXTNAME, TS_EXTNAME).replace(/\\/g, "/")
}

async function main() {
  const argv = yargs
    .scriptName("flow2dts")
    .usage(
      "$0 --root path/to/flow/inputs --out path/to/ts/outputs [FILES]\n\nFILES can be a list of include patterns or exclude by prepending the ! operator."
    )
    .options({
      rootDir: {
        nargs: 1,
        demandOption: true,
        describe: "The root directory of the Flow sources",
        type: "string",
      },
      outDir: {
        nargs: 1,
        demandOption: true,
        describe: "Where the TS sources should be written",
        type: "string",
      },
      platform: {
        nargs: 1,
        demandOption: true,
        describe: "Determines which platform specific files to include",
        type: "string",
        choices: ["ios", "android"],
      },
      cwd: {
        nargs: 1,
        demandOption: false,
        describe: "The working directory from which to expand relative paths",
        type: "string",
      },
      overrides: {
        demandOption: false,
        describe:
          "A file that exports a OverridesVisitor object used to provide project specific overrides where conversion cannot accurately be made",
        type: "string",
        array: true,
      },
      hint: {
        nargs: 1,
        demandOption: false,
        describe: "A file that provide hint for imported symbols",
        type: "string",
      },
    })
    .help().argv

  const cwd = argv.cwd
  const outDir = path.resolve(cwd || "", argv.outDir)
  const rootDir = path.resolve(cwd || "", argv.rootDir)
  const overridesPath = argv.overrides && argv.overrides.map((o) => path.resolve(cwd || "", o))
  const hintPath = argv.hint && path.resolve(cwd || "", argv.hint)
  const platform = argv.platform
  const patterns = argv._

  const [totalCount, successCount, overridesWithoutMatches, wildcardOverridesWithSingleMatches] = await run({
    cwd,
    outDir,
    rootDir,
    overridesPaths: overridesPath,
    hintPath,
    platform,
    patterns,
  })

  const overridesErrorsOccurred = overridesWithoutMatches.length > 0 || wildcardOverridesWithSingleMatches.length > 0
  if (overridesErrorsOccurred) {
    console.log("")
  }

  overridesWithoutMatches.forEach((pathPattern) => {
    console.error(chalk.red(`‼️ Override with path pattern '${pathPattern}' did not alter any files.`))
  })

  wildcardOverridesWithSingleMatches.forEach((pathPattern) => {
    console.error(
      chalk.red(
        `‼️ Override with wildcard path pattern '${pathPattern}' only altered a single file. Update the pattern to match a single file, if this was the intent.`
      )
    )
  })

  console.log(`\nSuccessfully converted ${successCount} of ${totalCount}\n`)

  process.exit(totalCount - successCount === 0 && !overridesErrorsOccurred ? 0 : 1)
}

main()
