import type { Jar4PluginApi } from "../../src/plugins/types.js";

import { createLlmTaskTool } from "./src/llm-task-tool.js";

export default function register(api: Jar4PluginApi) {
  api.registerTool(createLlmTaskTool(api), { optional: true });
}
