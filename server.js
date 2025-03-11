const { PORT } = require("./src/config/config.js");
const app = require("./src/app.js");
const connectToDb = require("./src/index.js");

const cors = require("cors");
app.use(cors());


connectToDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
  