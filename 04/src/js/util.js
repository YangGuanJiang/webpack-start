console.log('util.js !?')

export function print() {
  console.log.apply(console, arguments)
}