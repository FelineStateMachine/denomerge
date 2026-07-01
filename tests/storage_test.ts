import { assertEquals } from "@std/assert"
import { createBrowserAutomergeRepo } from "../src/index.ts"

// createBrowserAutomergeRepo requires IndexedDB and can only be instantiated in a browser.
// Verify the export exists and has the expected signature.
Deno.test("createBrowserAutomergeRepo is exported as a function", () => {
  assertEquals(typeof createBrowserAutomergeRepo, "function")
})
