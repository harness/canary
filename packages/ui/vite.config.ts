import { mergeConfig } from 'vite'
import dts from 'vite-plugin-dts'

import config from './vite-base.config'

export default mergeConfig(config, { plugins: dts({ rollupTypes: true }) })
