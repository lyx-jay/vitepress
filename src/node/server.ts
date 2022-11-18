import dns from 'dns'
import { createServer as createViteServer, ServerOptions } from 'vite'
import { resolveConfig } from './config'
import { createVitePressPlugin } from './plugin'

export async function createServer(
  root: string = process.cwd(),
  serverOptions: ServerOptions = {},
  recreateServer?: () => Promise<void>
) {
  console.log('createServer中的root', root)
  // root is docs
  const config = await resolveConfig(root)

  // 如果package.json中存在base选项，那么它的优先级会更高
  if (serverOptions.base) {
    config.site.base = serverOptions.base
    delete serverOptions.base
  }

  dns.setDefaultResultOrder('verbatim')

  return createViteServer({
    root: config.srcDir,
    base: config.site.base,
    // logLevel: 'warn',
    plugins: await createVitePressPlugin(config, false, {}, {}, recreateServer),
    server: serverOptions
  })
}
