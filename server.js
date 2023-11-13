const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let cartoons = [
    {
        _id: 1,
        title: "American Dad",
        humor: "Satirical",
        animationStyle: "Traditional 2D",
        releaseYear: "2005",
        mainSetting: "Suburban America",
        notableCharacters: ["Roger", "Stan Smith", "Steve Smith", "Francine Smith", "Hayley Smith", "Klaus"]
    },
    {
        _id: 2,
        title: "South Park",
        humor: "Satirical, Dark",
        animationStyle: "Cut-out animation",
        releaseYear: "1997",
        mainSetting: "South Park, Colorado",
        notableCharacters: ["Eric Cartman", "Stan Marsh", "Kenny McCormick", "Kyle Broflovski", "Towlie", "Chef"]
    },
    {
        _id: 3,
        title: "Rick and Morty",
        humor: "Sci-fi, Dark",
        animationStyle: "Sci-fi 2D",
        releaseYear: "2013",
        mainSetting: "Earth C-137, multiverse",
        notableCharacters: ["Morty Smith", "Rick Sanchez", "Summer Smith", "Beth Smith", "Jerry Smith", "Birdperson"]
    },
    {
        _id: 4,
        title: "Bojack Horseman",
        humor: "Dark, Satirical",
        animationStyle: "Traditional 2D",
        releaseYear: "2014",
        mainSetting: "Hollywoo (yes, without the 'D'",
        notableCharacters: ["Bojack Horseman", "Todd Chavez", "Sarah Lynn", "Princess Carolyn", "Diane Nguyen", "Mr. Peanutbutter"]
    },
    {
        _id: 5,
        title: "The Simpsons",
        humor: "Satirical, Family-oriented",
        animationStyle: "Traditional 2D",
        releaseYear: "1989",
        mainSetting: "Springfield",
        notableCharacters: ["Homer Simpson", "Marge Simpson", "Bart Simpson", "Lisa Simpson", "Maggie Simpson", "Santas Little Helper"]
    }
];

app.get("/api/cartoons", (req, res) => {
    res.send(cartoons);
});

app.post("/api/cartoons", upload.single("cover"), (req, res) => {
    const result = validateCartoon(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const newId = cartoons.length > 0 ? cartoons[cartoons.length - 1]._id + 1 : 1; // Create a new ID
    const cartoon = {
        _id: newId, // Use the new ID for the posted cartoon
        title: req.body.title,
        humor: req.body.humor,
        animationStyle: req.body.animationStyle,
        releaseYear: req.body.releaseYear,
        mainSetting: req.body.mainSetting,
        notableCharacters: req.body.notableCharacters.split(",")
    }

    cartoons.push(cartoon);
    res.send(cartoons);
});

const validateCartoon = (cartoon) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        title: Joi.string().min(3).required(),
        humor: Joi.string().min(3).required(),
        releaseYear: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
        animationStyle: Joi.string().min(3).required(),
        mainSetting: Joi.string().min(5),
        notableCharacters: Joi.allow("") 
    });

    return schema.validate(cartoon);
};

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});