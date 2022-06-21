import { format } from "date-fns";
import fetch from "node-fetch";
import ono from "ono";

// Generally you don't do this and provide via secure configuration
const apiKey = "c97920c0b8af4fb89fb175941222106";

export interface IGetForecastResult {
    temperatureInDegreesCelsius: number;
    chanceOfRain: number;
}

// Note: there is a lot more data in the response but this is what we care about
interface IWeatherApiForecastday {
    date: string;
    day: {
        avgtemp_c: number;
        daily_chance_of_rain: number;
    };
}

interface IWeatherApiForecastResponse {
    forecast: {
        forecastday: IWeatherApiForecastday[];
    };
}

export interface IWeatherService {
    getForecast: (cityName: string, date: Date) => Promise<IGetForecastResult>;
}

export class WeatherService implements IWeatherService {
    async getForecast(city: string, date: Date): Promise<IGetForecastResult> {
        // If we were so inclined we could query only the number of days we need, but
        // easier to just pull 7 days and search for the right entry
        const { forecast } = await this.callForecastApi(city);
        const dateStr = format(date, "yyyy-MM-dd");

        // This looks like it's correctly indexed but I'm not sure that's true so search
        const foundForecast = forecast.forecastday.find(
            (day) => day.date === dateStr
        );

        if (!foundForecast) {
            throw ono(`no forecast found for ${dateStr}`);
        }

        return {
            temperatureInDegreesCelsius: foundForecast.day.avgtemp_c,
            chanceOfRain: foundForecast.day.daily_chance_of_rain,
        };
    }

    private async callForecastApi(city: string) {
        const resp = await fetch(
            encodeURI(
                `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`
            ),
            { method: "GET" }
        );

        return (await resp.json()) as IWeatherApiForecastResponse;
    }
}

export const weatherService = new WeatherService();
