'use strict'

const spawn = require('child_process').spawn

module.exports = startInBackground

const childProcesses = []

function startInBackground({ executable, args, waitFor, help }) {
  console.log(`Launching ${executable}...`)

  return new Promise((resolve, reject) => {
      let resolved = false

      const spawned = spawn(executable, args)
      childProcesses.push(spawned)

      let output = ''
      spawned.stdout.on('data', (data) => {
        if (resolved) {
          return
        }

        output += data
        process.stdout.write(data)

        if (output.indexOf(waitFor) !== -1) {
          resolved = true
          resolve()
        }
      })

      spawned.stderr.on('data', (data) => {
        if (resolved) {
          return
        }

        output += data
        process.stderr.write(data)
      })

      spawned.on('close', (code) => {
        console.error(`Failed to launch ${executable}!`)

        if (code === -2) { // ENOENT, no such executable
          console.error(help)
        }

        reject(new Error(`Failed to launch ${executable}!`))
      })
  })
}

process.on('exit', () => {
  childProcesses.forEach((p) => p.kill())
})
