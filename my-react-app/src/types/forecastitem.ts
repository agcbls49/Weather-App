export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
  };
  weather: {
    icon: string;
    description: string;
    main: string;
  }[];
}