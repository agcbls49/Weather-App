import { useEffect, useState, type ChangeEvent } from 'react'
import { type ForecastItem } from './types/forecastitem';
import { type WeatherType } from './types/weathertype';
// import { Thermometer } from 'lucide-react';
import './App.css'

function App() {
  const API_KEY = import.meta.env.VITE_API_KEY;
  
  const [weatherData, setWeatherData] = useState<WeatherType | null>(null);
  const [city, setCity] = useState<string>("london")
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");

  
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

  return (
    <>
      {weatherData && weatherData.main && weatherData.weather && (
          <div className="justify justify-center text-center mt-25">
            <div className="mx-auto w-125 h-150 bg-white block max-w-sm p-6 rounded-lg rounded-base shadow-xs">
                {/* Search */}
                <form className="flex" onSubmit={handleSearch}>
                    <input type='text' value={searchInput} onChange={(e:ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)}
                    placeholder="Enter a City" className="rounded-s-md grow border border-gray-400 p-2 focus:outline-none"/>
                    <button type="submit" className="w-16 rounded-e-md bg-sky-900 text-white hover:bg-sky-800">
                        Search
                    </button>
                </form>
                <div className="mt-10">
                    <h1 className="text-3xl">{weatherData.name}</h1>
                    <h1 className="mt-10 text-3xl font-medium">{weatherData.main.temp}°F</h1>
                    <p className="mt-10 text-lg">{weatherData.weather[0].main}</p>
                    <div className="mt-5 flex space-x-45 justify-center">
                        <div>
                            Humidity
                            <p>{weatherData.main.humidity}%</p>
                        </div>
                        <div>
                            Wind Speed
                            <p>{weatherData.wind.speed}mph</p>
                        </div>
                    </div>
                    <br />
                    <hr />
                    {/* Forecasting */}
                    {forecast.length > 0 && (
                      <div className="mt-5 text-xl font-medium">
                        5-Day Forecast
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
                              <p>{Math.round(day.main.temp)}°F</p>
                            </div>
                          )}
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </>
  );
}

export default App
