export interface WeatherType {
  name: string;
  dt: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
}