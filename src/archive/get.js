/** 
 * Special getter that efficiently gets file data from archives with hash caching
 */

const path = require('path')
const fs = require('fs-extra')
const parse = require('./parse')
const hashFile = require('../hash')

const archiveCache = new Map()
const archiveHashCache = new Map()

async function getArchive (archive) {
  if (!archive) archive = path.join(process.cwd(), '.moe-archive')

  if (await fs.pathExists(archive) === false) return []

  archive = path.resolve(archive)

  const archiveHash = hashFile(archive, 'md5')
  if (
    archiveHashCache.has(archive) && 
    archiveHashCache.get(archive) === archiveHash
  ) {
    return archiveCache.get(archive)
  } else {
    if (!await fs.pathExists(archive)) return []

    archiveHashCache.set(archive, archiveHash)
    let data = (await parse(await fs.readFile(archive, 'utf8'))).data
    archiveCache.set(archive, data)

    return data
  }
}

async function getByHash(archive, h) {
  data = await getArchive(archive)

  return data.find((file) => file.hash === h)
}

async function getByPath(archive, p) {
  data = await getArchive(archive)

  return data.find((file) => file.path === p)
}

module.exports = {
  archive: getArchive,
  byHash: getByHash,
  byPath: getByPath
}