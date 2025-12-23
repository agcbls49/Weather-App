import { useEffect, useState, type ChangeEvent } from 'react'
import { type ForecastItem } from './types/forecastitem';
import { type WeatherType } from './types/weathertype';
import { Thermometer } from 'lucide-react';
import './App.css'

function App() {
  const API_KEY = import.meta.env.VITE_API_KEY;
  
  const [weatherData, setWeatherData] = useState<WeatherType | null>(null);
  const [city, setCity] = useState<string>("new%20york")
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [tempUnit, setTempUnit] = useState<string>("imperial");
  
  useEffect(() => {
    const fetchWeatherData = async(cityName:string):Promise<void> => {
      setCity(cityName);

      try {
        // pass the city and the api key then convert response to json data
        const url:string = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=imperial`;
        const response = await fetch(url);
        const data = await response.json();
        // set the response to the data state
        setWeatherData(data);

        // check the response in the console
        // console.log(data);

        // forecasting call
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=imperial`);
        const forecastData = await forecastResponse.json();

        const dailyForecast:ForecastItem[] = forecastData.list.filter((_item:ForecastItem, index:number) => index % 8 === 0);
        setForecast(dailyForecast);

      } catch (error) {
        console.log(error);
      }
    }
    fetchWeatherData(city);

  }, [city, API_KEY]);

  async function callSearchAPI(searchInput:string) {
    setCity(searchInput);

    // same code as before but without use effect
    try {
      // pass the city and the api key then convert response to json data
        const url:string = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${API_KEY}&units=imperial`;
        const response = await fetch(url);
        const data = await response.json();
        // set the response to the data state
        setWeatherData(data);
      
    } catch (error) {
      console.log(error);
    }
  }

  // for submitting the form for the search input and the search button
  function handleSearch(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    callSearchAPI(searchInput);
  }

  function convertTemp():void {
    if(tempUnit === "imperial") {
      setTempUnit("metric")
    } else {
      setTempUnit("imperial")
    }
  }

  return (
    <>
      {weatherData && weatherData.main && weatherData.weather && (
          <div className="justify justify-center text-center mt-25 selection:bg-sky-300">
            <div className="mx-auto w-100 bg-white block max-w-sm p-4 rounded-lg rounded-base shadow-xs">
              {/* Search */}
                <form className="flex" onSubmit={handleSearch}>
                    <input type='text' value={searchInput} onChange={(e:ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)}
                    placeholder="Enter a City" className="rounded-s-md grow border border-gray-400 p-2 focus:outline-none"/>
                    <button type="submit" className="w-16  bg-sky-600 text-white hover:bg-sky-700">
                        Search
                    </button>
                    {/* type button prevents form submission or reloading */}
                    <button type='button' onClick={convertTemp}
                    className='rounded-e-md bg-yellow-400 text-white hover:bg-yellow-500'>
                      <Thermometer/>
                    </button>
                </form>
            </div>
            <div className="mx-auto mt-2 w-100 h-95 bg-white block max-w-sm p-6 rounded-lg rounded-base shadow-xs">
                {/* temperature data */}
                <div className="mt-2">
                    <h1 className="text-3xl">{weatherData.name}</h1>
                    <h1 className="mt-10 text-3xl font-semibold">
                      {/* change the temperature when thermometer button is clicked */}
                      {tempUnit === "imperial" ? weatherData.main.temp : ((weatherData.main.temp - 32) * 5/9).toFixed(2)}
                      {tempUnit === "imperial" ? " °F" : " °C"}
                    </h1>
                    {/* this shows if weather is clear or foggy */}
                    <p className="mt-8 text-2xl font-medium">{weatherData.weather[0].main}</p>
                    <hr className='mt-5'/>
                    <h1 className='mt-2 text-lg'>Humidity</h1>
                    <p>{weatherData.main.humidity}%</p>
                    <h1 className='mt-3 text-lg'>Wind Speed</h1>
                    {/* change speed according to unit of temperature */}
                    {tempUnit === "imperial" ? weatherData.wind.speed : ((weatherData.wind.speed * 1.609).toFixed(2))}
                    {tempUnit === "imperial" ? " mph" : " km/h"}
                </div>
            </div>
            <div className="mx-auto mt-2 w-100 h-50 bg-white block max-w-sm p-6 rounded-lg rounded-base shadow-xs">
              {/* forecasting */}
              {forecast.length > 0 && (
                <div className="text-xl">
                  {/* 5 day weather forecast */}
                    <h1 className='font-semibold'>Weather Forecast</h1>
                      <div className="mt-5 text-lg flex flex-row space-x-8 justify-center">
                        {forecast.map((day, index:number) => 
                          <div key={index}>
                            <p>
                              {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                                weekday: "short",
                              })}
                            </p>
                            <img
                              src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                              alt={day.weather[0].description}
                            />
                            {/* change forecast to imperial or metric */}
                            <p>
                              {tempUnit === "imperial" ? (Math.round(day.main.temp)) : (Math.round(day.main.temp - 32) * 5/9).toFixed(0)}
                              {tempUnit === "imperial" ? " °F" : " °C"}
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                )}
            </div>
        </div>
      )}
    </>
  );
}

export default App
