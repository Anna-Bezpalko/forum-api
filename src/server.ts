import { createApp } from "./app.js";
import { config } from "./config.js";
import { createContainer } from "./container.js";

const container = createContainer();
const app = createApp(container);

app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});
