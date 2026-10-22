import { describe, expect, it } from "vitest";
import { toNavUrl } from "./search-url";

describe("toNavUrl", () => {
  it("keeps addresses as addresses", () => {
    expect(toNavUrl("https://example.com/a", "kagi")).toBe("https://example.com/a");
    expect(toNavUrl("example.com", "kagi")).toBe("https://example.com");
    expect(toNavUrl("localhost:3000", "kagi")).toBe("https://localhost:3000");
  });

  it("searches anything else with the chosen engine", () => {
    expect(toNavUrl("rust borrow checker", "duckduckgo")).toBe(
      "https://duckduckgo.com/?q=rust%20borrow%20checker",
    );
    expect(toNavUrl("tauri", "google")).toBe("https://www.google.com/search?q=tauri");
  });
});
