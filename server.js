import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import dotenv from "dotenv";


const app= express();
const port= 3000;

dotenv.config();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

const appkey = process.env.API_key;

app.get("/", (req,res)=>{
    res.render("index.ejs",{error: null , city: null , main: null, description:null,
                            icon: null, temp: null, feelsLike:null
     });
})

app.get("/weather", async (req,res)=>{
    const city=req.query.city;
      try {  const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${appkey}`);
            //if (response.data.length === 0) { throw new Error("City not found");};
            const result= await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${response.data[0].lat}&lon=${response.data[0].lon}&appid=${appkey}`);
                res.render("index.ejs",{
                city : city,
                //content: JSON.stringify(result.data),
                main : result.data.weather[0].main,
                description: result.data.weather[0].description,
                icon: result.data.weather[0].icon,
                temp : (result.data.main.temp-273.15).toFixed(2),
                feelsLike: (result.data.main.feels_like-273.15).toFixed(2),
                humidity: result.data.main.humidity,
                sea: result.data.main.sea_level,
                ground: result.data.main.grnd_level,
                wind: result.data.wind.speed,

                error: null,
                });
        } catch (error) {
        console.error("Error fetching weather data:", error);
        res.render("index.ejs", {
            city: null,
            main: null,
            description: null,
            icon: null,
            temp: null,
            feelsLike: null,
            error: "City not found or API error.",
        });
    };
   
});

app.listen(port, ()=> {
    console.log(`Server is running at port : ${port}`);
})
