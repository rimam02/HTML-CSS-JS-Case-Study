const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(__dirname));

app.post("/register-seller", (req, res) => {

    const newShop = req.body;

    const data = fs.readFileSync("shops.json");
    const shops = JSON.parse(data);

    shops.push(newShop);

    fs.writeFileSync("shops.json", JSON.stringify(shops, null, 2));

    console.log("New shop registered:", newShop);

    res.send("Shop registered successfully");

});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});