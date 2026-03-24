'use client'

import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { OptimizationSettings, PresetType } from '@/types'

interface ControlsPanelProps {
  settings: OptimizationSettings
  onSettingsChange: (settings: OptimizationSettings) => void
  onReset: () => void
  onApplyPreset: (preset: PresetType) => void
  isProcessing: boolean
}

const PRESET_LABELS: Record<PresetType, string> = {
  'max-compression': 'Max Compression',
  balanced: 'Balanced',
  quality: 'Quality',
}

export function ControlsPanel({
  settings,
  onSettingsChange,
  onReset,
  onApplyPreset,
  isProcessing,
}: ControlsPanelProps) {
  const update = (key: keyof OptimizationSettings, value: number | boolean) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  return (
    <Card>
      <CardHeader className="space-y-3 pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <CardTitle className="text-base sm:text-lg">Settings</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto min-h-10 w-full justify-center px-3 py-2.5 sm:w-auto sm:justify-start sm:py-2"
            onClick={onReset}
            disabled={isProcessing}
            title="Restore default optimization options (precision & toggles). Does not affect page appearance."
          >
            Reset options
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-2 pt-0 sm:grid-cols-3 sm:pt-1">
          {(['max-compression', 'balanced', 'quality'] as PresetType[]).map((preset) => (
            <Button
              key={preset}
              variant="outline"
              size="sm"
              className="min-h-10 w-full justify-center"
              onClick={() => onApplyPreset(preset)}
              disabled={isProcessing}
            >
              {PRESET_LABELS[preset]}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label>Precision (0–5)</Label>
          <div className="flex items-center gap-3">
            <Slider
              min={0}
              max={5}
              value={settings.precision}
              onValueChange={(v) => update('precision', v)}
              disabled={isProcessing}
            />
            <span className="w-6 text-sm text-muted-foreground">{settings.precision}</span>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { key: 'removeComments', label: 'Remove comments' },
            { key: 'removeMetadata', label: 'Remove metadata' },
            { key: 'minifyIds', label: 'Minify IDs' },
            { key: 'mergePaths', label: 'Merge paths' },
            { key: 'removeTitle', label: 'Remove title' },
            { key: 'removeDesc', label: 'Remove description' },
            { key: 'preserveViewBox', label: 'Preserve viewBox' },
            { key: 'collapseGroups', label: 'Collapse groups' },
            { key: 'convertToPath', label: 'Convert shapes to path' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between gap-3">
              <Label className="min-w-0 flex-1 text-sm font-normal leading-snug">{label}</Label>
              <Switch
                checked={settings[key as keyof OptimizationSettings] as boolean}
                onCheckedChange={(v) => update(key as keyof OptimizationSettings, v)}
                disabled={isProcessing}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
