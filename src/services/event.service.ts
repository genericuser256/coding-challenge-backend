import { addDays, isWithinInterval } from "date-fns";
import { eventDao, ICountedData, IEventDao, IQueryOptions } from "../daos";
import baseLogger, { getLoggerChild } from "../logger";
import { IEventModel, EventId } from "../models";
import { getCityFromLocation } from "../utils/event";
import {
    IGetForecastResult,
    IWeatherService,
    weatherService,
} from "./weather.service";

export interface IEventService {
    getAllEvents: (
        from: Date,
        until?: Date,
        opt?: IQueryOptions
    ) => Promise<ICountedData<IEventModel>>;

    getEvent: (id: EventId) => Promise<IEventModel>;
}

export interface IEventModelWithForecast extends IEventModel {
    weather?: IGetForecastResult;
}

export class EventService implements IEventService {
    private logger: ReturnType<typeof getLoggerChild>;

    constructor(
        private readonly dao: IEventDao,
        private readonly weatherService: IWeatherService
    ) {
        this.logger = getLoggerChild(baseLogger, EventService.name);
    }

    async getAllEvents(from: Date, until?: Date, opt?: IQueryOptions) {
        return await this.dao.getAllEvents(from, until, opt);
    }

    async getEvent(id: EventId) {
        //
        // Note: it probably makes sense to have this as another method that takes an event and
        // adds the forecast to it, so say the controller can decide if it wants the forecast or not,
        // but simplicity wins out again here
        //

        // Cast to add the optional forecast to the event
        const event = (await this.dao.getEvent(id)) as IEventModelWithForecast;

        // Get the weather
        const dateInterval: Interval = {
            start: new Date(),
            end: addDays(new Date(), 7),
        };
        if (event.isOutside && isWithinInterval(event.date, dateInterval)) {
            // Making a decision here that if the weather api is down for whatever reason,
            // it's better to still return the event and pretend there's no forecast
            try {
                const city = getCityFromLocation(event.location);
                const forecast = await this.weatherService.getForecast(
                    city,
                    event.date
                );
                event.weather = forecast;
            } catch (e) {
                this.logger.info(e, `failed to fetch forecast for event ${id}`);
            }
        }

        return event;
    }
}

export const eventService = new EventService(eventDao, weatherService);
