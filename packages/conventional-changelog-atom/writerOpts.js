import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const dirname = fileURLToPath(new URL('.', import.meta.url))

function getWriterOpts () {
  return {
    transform: (commit) => {
      if (!commit.emoji || typeof commit.emoji !== 'string') {
        return
      }

      commit.emoji = commit.emoji.substring(0, 72)
      const emojiLength = commit.emoji.length

      if (typeof commit.hash === 'string') {
        commit.shortHash = commit.hash.substring(0, 7)
      }

      if (typeof commit.shortDesc === 'string') {
        commit.shortDesc = commit.shortDesc.substring(0, 72 - emojiLength)
      }

      return commit
    },
    groupBy: 'emoji',
    commitGroupsSort: 'title',
    commitsSort: ['emoji', 'shortDesc']
  }
}

export async function createWriterOpts () {
  const [template, header, commit] = await Promise.all([
    readFile(resolve(dirname, './templates/template.hbs'), 'utf-8'),
    readFile(resolve(dirname, './templates/header.hbs'), 'utf-8'),
    readFile(resolve(dirname, './templates/commit.hbs'), 'utf-8')
  ])
  const writerOpts = getWriterOpts()

  writerOpts.mainTemplate = template
  writerOpts.headerPartial = header
  writerOpts.commitPartial = commit

  return writerOpts
}
