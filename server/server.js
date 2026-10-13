require('dotenv').config();


const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());




const API_KEY = process.env.CARSXE_API_KEY;

if (!API_KEY) {
    console.error("Missing CARSXE_API_KEY environment variable");
}



app.get("/", (req, res) => {
    res.send("JB Dealership Backend is Working!");
});



app.get("/api/car", async (req, res) => {

    const { name, model, year } = req.query;


  
    if (!name || !model || !year) {

        return res.status(400).json({
            success: false,
            message: "Make, model and year are required"
        });

    }


    const url =
        `https://api.carsxe.com/v1/ymm` +
        `?key=${API_KEY}` +
        `&year=${encodeURIComponent(year)}` +
        `&make=${encodeURIComponent(name)}` +
        `&model=${encodeURIComponent(model)}`;


    try {

        const response = await fetch(url);

        const data = await response.json();

        console.log("CAR DATA:", data);


        res.json(data);


    } catch (error) {

        console.error("Car API Error:", error);


        res.status(500).json({

            success: false,

            message: "Unable to fetch car information"

        });

    }

});




app.get("/api/car-image", async (req, res) => {

    const { make, model, year } = req.query;


    if (!make || !model || !year) {

        return res.status(400).json({

            success: false,

            message: "Make, model and year are required"

        });

    }


    const url =
        `https://api.carsxe.com/images` +
        `?key=${API_KEY}` +
        `&make=${encodeURIComponent(make)}` +
        `&model=${encodeURIComponent(model)}` +
        `&year=${encodeURIComponent(year)}` +
        `&photoType=exterior` +
        `&size=Large`;


    try {

        const response = await fetch(url);

        const data = await response.json();

        console.log("IMAGE DATA:", data);


        res.json(data);


    } catch (error) {

        console.error("Image API Error:", error);


        res.status(500).json({

            success: false,

            message: "Unable to fetch car image"

        });

    }

});



const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("JB Dealership Backend");
    console.log(`Server running on port ${PORT}`);
});