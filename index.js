const express = require('express');
const {connectToMongoDB} = require("./connect")
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const path = require("path");
const staticRoute = require("./routes/staticRouter");


const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views" , path.resolve("./views"));

connectToMongoDB("mongodb+srv://hr555724_db_user:0xdRDsAG2IvV9rfg@cluster0.tpajmj7.mongodb.net/?appName=Cluster0")
.then (() => console.log("connected to the Mongo DB database"));

app.use(express.json());
app.use(express.urlencoded({ extended : false}));

app.use("/url", urlRoute);

app.use("/", staticRoute);


app.get("/url/:shortId", async (req, res) => { 
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
    {
       shortId,
    }, 
    {
        $push : {
            visitHistory : {
                timestamp : Date.now(),
            },
        },
    }
);
res.redirect(entry.redirectURL);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    });
