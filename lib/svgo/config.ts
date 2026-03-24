import type { Config } from 'svgo'
import type { OptimizationSettings } from '@/types'

export function getSvgoConfig(settings: OptimizationSettings): Config {
  const precision = settings.precision
  const floatPrecision = Math.pow(10, -precision)

  const config: Config = {
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: settings.preserveViewBox ? false : undefined,
            cleanupNumericValues: { floatPrecision },
            convertPathData: { floatPrecision },
            convertShapeToPath: settings.convertToPath ? {} : false,
            mergePaths: settings.mergePaths ? {} : false,
            collapseGroups: settings.collapseGroups ? undefined : false,
            removeTitle: settings.removeTitle ? undefined : false,
            removeDesc: settings.removeDesc ? undefined : false,
            cleanupIds: settings.minifyIds ? {} : false,
            removeComments: settings.removeComments ? undefined : false,
            removeMetadata: settings.removeMetadata ? undefined : false,
          },
        },
      },
    ],
  }

  return config
}
