import baseLogger, { getLoggerChild } from "../logger";
import {
    convertRangeToQuery,
    defaultQueryOptions,
    ICountedData,
    IQueryOptions,
} from "./shared";
import ono from "ono";
import {
    IEventModel,
    Id,
    Event,
    Invitation,
    Person,
    convertEventToIEventModel,
} from "../models";

export interface IEventDao {
    getAllEvents: (
        from: Date,
        until?: Date,
        opt?: IQueryOptions
    ) => Promise<ICountedData<IEventModel>>;

    getEvent: (id: Id) => Promise<IEventModel>;
}

export class EventDao implements IEventDao {
    private logger: ReturnType<typeof getLoggerChild>;

    constructor() {
        this.logger = getLoggerChild(baseLogger, EventDao.name);
    }

    async getAllEvents(
        from: Date,
        until?: Date,
        opt: IQueryOptions = defaultQueryOptions
    ) {
        try {
            // Note: I'm counting here for the purposes of pagination, but the count itself can be pretty taxing
            // so as such we might want to break that out in future
            const { rows, count } = await Event.findAndCountAll({
                where: {
                    date: convertRangeToQuery(from, until),
                },
                // Note: Generally you might want to leave this to the user to decide for themselves what they
                // want included, but for simplicity again, just assume we always will want to load the relations
                include: [Invitation, Person],
                ...opt,
            });

            return {
                data: rows.map(convertEventToIEventModel),
                count,
            };
        } catch (e) {
            this.logger.warn(e, "encountered error in getAllEvents");
            throw ono(e as Error, "getAllEvents");
        }
    }

    async getEvent(id: string) {
        try {
            const data = await Event.findOne({
                where: {
                    id,
                },
                // Note: Generally you might want to leave this to the user to decide for themselves what they
                // want included, but for simplicity again, just assume we always will want to load the relations
                include: [Invitation, Person],
            });

            if (!data) {
                throw ono(`no model found for id ${id}`);
            }

            return convertEventToIEventModel(data);
        } catch (e) {
            this.logger.warn(e, "encountered error in getEvent");
            throw ono(e as Error, "getEvent");
        }
    }
}

export const eventDao = new EventDao();
