import { eventDao, ICountedData, IEventDao, IQueryOptions } from "../dao";
import baseLogger, { getLoggerChild } from "../logger";
import { IEventModel, Id } from "../models";

export interface IEventService {
    getAllEvents: (
        from: Date,
        until?: Date,
        opt?: IQueryOptions
    ) => Promise<ICountedData<IEventModel>>;

    getEvent: (id: Id) => Promise<IEventModel>;
}

export class EventService implements IEventService {
    private logger: ReturnType<typeof getLoggerChild>;

    constructor(private readonly dao: IEventDao) {
        this.logger = getLoggerChild(baseLogger, EventService.name);
    }

    async getAllEvents(from: Date, until?: Date, opt?: IQueryOptions) {
        return await this.dao.getAllEvents(from, until, opt);
    }

    async getEvent(id: Id) {
        return await this.dao.getEvent(id);
    }
}

export const eventService = new EventService(eventDao);
