import { useLayoutStore } from "@/features/layout/stores/layout-store";

/** Open `url` in the focused column's browser tab, opening one if there is
 *  none, and return the tab's id. */
export function openInBrowserTab(url: string): string {
  const layout = useLayoutStore.getState();
  const existing = layout.tabs.find(
    (t) => t.type === "browser" && (t.groupId ?? "main") === layout.focusedGroupId,
  );
  layout.actions.addTab({
    id: "browser",
    type: "browser",
    title: "Browser",
    closable: true,
    dirty: false,
    data: { url },
  });
  const tabId = useLayoutStore.getState().activeTabId ?? "browser";
  // A mounted browser tab read its URL once, when it mounted.
  if (existing)
    window.dispatchEvent(new CustomEvent("atlas:browser-navigate", { detail: { tabId, url } }));
  return tabId;
}

/**
 * Open a link the user clicked in a chat or the terminal where `linkTarget`
 * says: the system browser, or a browser tab inside Atlas. Only http(s) ever
 * reaches the in-app browser; anything else goes to the system's handler.
 */
export async function openLink(url: string): Promise<void> {
  // Loaded on click, not at import: the markdown renderer imports this, and
  // the settings store subscribes to Tauri events the moment it loads.
  const { useSettingsStore } = await import("@/features/settings/stores/settings-store");
  const inAtlas =
    useSettingsStore.getState().settings.linkTarget === "atlas" && /^https?:/i.test(url);
  if (inAtlas) {
    openInBrowserTab(url);
    return;
  }
  const { openUrl } = await import("@tauri-apps/plugin-opener");
  await openUrl(url);
}
