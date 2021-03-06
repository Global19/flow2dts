// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
})

function findTSError(line) {
  const match = line.match(/\bTS\d+\b/)
  return match && match[0]
}

const focusError = process.argv[2]
if (focusError) {
  // Show only specific errors
  readline.on("line", (line) => {
    const error = findTSError(line)
    if (error === focusError) {
      console.log(line)
    }
  })
} else {
  // Rank offences
  const errors = {}

  readline.on("line", (line) => {
    const error = findTSError(line)
    if (error) {
      errors[error] = (errors[error] || 0) + 1
    }
  })

  readline.on("close", () => {
    Array.from(Object.entries(errors))
      .sort((a, b) => b[1] - a[1])
      .forEach(([code, occurrences]) => {
        console.log(`${occurrences.toString().padStart(4, " ")} ${code}`)
      })
  })
}
