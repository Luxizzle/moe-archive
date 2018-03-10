const fs = require('fs-extra')
const path = require('path')
const config = require('./config')

const defaultFilter = () => true

module.exports = async function(start, maxDepth = config.get('depth'), filter = defaultFilter) {
  let files = []
  let dirs = [start]
  let depth = 0

  async function fn(dir) {
    const fullPath = path.resolve(start, dir)
    const dirFiles = await fs.readdir(fullPath)

    for (let file of dirFiles) {
      if (filter(file, fullPath) === false) continue

      const filePath = path.resolve(fullPath, file)

      const stat = await fs.stat(filePath)
      const isDir = stat.isDirectory()

      if (isDir) {
        dirs.push(filePath)
      } else {
        files.push(path.relative(start, filePath))
      }
    }
  }

  while (depth <= maxDepth) {
    let tmp = Array.from(dirs)
    dirs = []
    for (let dir of tmp) {
      await fn(dir)
    }
    depth += 1
  }

  return files
}