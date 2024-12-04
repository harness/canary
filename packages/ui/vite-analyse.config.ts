import { mergeConfig } from 'vite'
import { analyzer } from 'vite-bundle-analyzer'

import config from './vite.config'

export default mergeConfig(config, { plugins: [analyzer()] })
