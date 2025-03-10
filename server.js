const {PORT } = require("./src/config/config.js");
const app = require("./src/app.js");
const { connectToDb } = require("./src/index.js");


connectToDb((err) => {
    if (!err) {
        console.log("DB Connected Successfully.");
    }
    else {
        console.log("Error in DB connection.", err);
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
});

 

