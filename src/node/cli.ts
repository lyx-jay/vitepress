import c from 'picocolors'
import minimist from 'minimist'
// minimist 是什么？
import { createServer, build, serve } from '.'
import { version } from '../../package.json'

// 从 package.json 中拿的文档站点信息
// 只有 docs 相关的命令才可以触发 cli 的执行
// pnpm docs-dev会触发执行cli
// console.log('命令行信息', process.argv)
const argv: any = minimist(process.argv.slice(2))

// console.log('argv', argv);

console.log(c.cyan(`vitepress v${version}`))

const command = argv._[0]
// console.log('command', command)
const root = argv._[command ? 1 : 0]
if (root) {
  argv.root = root
}

// console.log('root', root)

if (!command || command === 'dev') {
  const createDevServer = async () => {
    const server = await createServer(root, argv, async () => {
      await server.close()
      await createDevServer()
    })
    await server.listen()
    console.log()
    server.printUrls()
  }
  createDevServer().catch((err) => {
    console.error(c.red(`failed to start server. error:\n`), err)
    process.exit(1)
  })
} else if (command === 'build') {
  build(root, argv).catch((err) => {
    console.error(c.red(`build error:\n`), err)
    process.exit(1)
  })
} else if (command === 'serve') {
  serve(argv).catch((err) => {
    console.error(c.red(`failed to start server. error:\n`), err)
    process.exit(1)
  })
} else {
  console.log(c.red(`unknown command "${command}".`))
  process.exit(1)
}
