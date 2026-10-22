/**
 * Controls bound to one `config.toml` key: the value comes from the settings
 * store, and a change saves it. Rows use these instead of re-wiring
 * `updateSettings` by hand for every switch.
 */

import { Switch } from "@/ui/switch";
import { Select, type SelectOption } from "@/ui/select";
import type { AppSettings, BooleanSettingKey } from "../../lib/app-settings";
import { settingMeta } from "../../lib/settings-sections";
import { useScopedSetting } from "../../lib/use-scoped-setting";

/** "Needs you: System notification", not just "System notification": one page
 *  can hold several rows with the same title, one per section, and a screen
 *  reader moving between controls hears only this name. */
function accessibleName(setting: keyof AppSettings): string {
  const meta = settingMeta(setting);
  return `${meta.section}: ${meta.title}`;
}

export function SettingSwitch({
  setting,
  disabled,
  onChange,
}: {
  setting: BooleanSettingKey;
  disabled?: boolean;
  /** Runs after the value is saved — for a side effect the store can't own. */
  onChange?: (next: boolean) => void;
}) {
  const scoped = useScopedSetting(setting);
  return (
    <Switch
      checked={scoped.value}
      disabled={disabled || scoped.globalOnly}
      aria-label={accessibleName(setting)}
      onCheckedChange={(next) => {
        scoped.set(next);
        onChange?.(next);
      }}
    />
  );
}

type EnumKey = {
  [K in keyof AppSettings]: AppSettings[K] extends string
    ? string extends AppSettings[K]
      ? never
      : K
    : never;
}[keyof AppSettings];

/** A select over an enum key's values; `options` gives each value its label. */
export function SettingSelect<K extends EnumKey>({
  setting,
  options,
  disabled,
}: {
  setting: K;
  options: readonly SelectOption<AppSettings[K] & string>[];
  disabled?: boolean;
}) {
  const scoped = useScopedSetting(setting);
  return (
    <Select
      value={scoped.value as AppSettings[K] & string}
      options={options}
      disabled={disabled || scoped.globalOnly}
      aria-label={accessibleName(setting)}
      onValueChange={(next) => scoped.set(next as AppSettings[K])}
    />
  );
}
