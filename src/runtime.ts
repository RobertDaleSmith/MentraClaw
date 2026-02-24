import type { PluginRuntime } from "openclaw/plugin-sdk";

let runtime: PluginRuntime | null = null;

export function setMentraOSRuntime(next: PluginRuntime) {
  runtime = next;
}

export function getMentraOSRuntime(): PluginRuntime {
  if (!runtime) {
    throw new Error("MentraOS runtime not initialized");
  }
  return runtime;
}
