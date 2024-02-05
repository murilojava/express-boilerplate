import { expect, test } from "vitest";

const testURL = "http://localhost:3000"

test("app is running", async () => {  
  const app = await import("../app");

  const response = await fetch(testURL);

  expect(response.status).toBe(200);

  expect(await response.json()).toEqual({ message: "It's alive!" });
})