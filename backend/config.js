export const dbURL = "mongodb://127.0.0.1:27017/t-corner";
export const JWT_SECRET = "112233445566778899sujitbarman112233445566778899";

import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the current module's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export { __dirname };
