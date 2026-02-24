import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";
import { mentraosPlugin } from "./src/channel.js";
import { setMentraOSRuntime } from "./src/runtime.js";

const plugin: {
  id: string;
  name: string;
  description: string;
  configSchema: ReturnType<typeof emptyPluginConfigSchema>;
  register: (api: OpenClawPluginApi) => void;
} = {
  id: "mentraos-plugin",
  name: "MentraOS",
  description: "MentraOS smart glasses channel plugin for OpenClaw",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    setMentraOSRuntime(api.runtime);
    api.registerChannel({ plugin: mentraosPlugin });
  },
};

export default plugin;
