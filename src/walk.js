const fs = require('fs-extra-promise')
const path = require('path')

const defaultFilter = () => true

module.exports = async function(start, maxDepth = 5, filter = defaultFilter) {
  let files = []
  let dirs = [start]
  let depth = 0

  async function fn(dir) {
    const fullPath = path.resolve(start, dir)
    const dirFiles = await fs.readdirAsync(fullPath)

    for (let file of dirFiles) {
      if (filter(file) === false) continue

      const filePath = path.resolve(fullPath, file)

      const stat = await fs.statAsync(filePath)
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