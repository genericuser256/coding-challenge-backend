import { isAfter, isValid } from "date-fns";
import { Router } from "express";
import httpError from "http-errors";
import ono from "ono";
import { IEventModel, EventId } from "../models";
import { eventService, IEventModelWithForecast } from "../services";
import {
    IPaginatedData,
    IPaginationQuery,
    parseAndValidatePaginationQuery,
    wrapPaginatedData,
} from "../utils/pagination";

export const eventsRouter = Router();

interface IGetEventsQuery extends IPaginationQuery {
    from?: string | number;
    until?: string | number;
}

interface IGetEventsEvent extends IEventModel {}

interface IGetEventsResponse extends IPaginatedData<IGetEventsEvent> {}

eventsRouter.get<never, IGetEventsResponse, never, IGetEventsQuery>(
    "",
    async (req, res, next) => {
        const { from, until } = req.query;
        let fromDate: Date;
        let untilDate: Date | undefined;

        if (from) {
            fromDate = new Date(from);
            if (!isValid(fromDate)) {
                next(new httpError.BadRequest("from is invalid"));
                return;
            }
        } else {
            fromDate = new Date();
        }

        if (until) {
            untilDate = new Date(until);
            if (!isValid(untilDate)) {
                next(new httpError.BadRequest("until is invalid"));
                return;
            }
        }

        if (untilDate && isAfter(fromDate, untilDate)) {
            next(new httpError.BadRequest("until must be after from"));
            return;
        }

        try {
            const { limit, offset } = parseAndValidatePaginationQuery(
                req.query
            );

            const { data, count } = await eventService.getAllEvents(
                fromDate,
                untilDate,
                { limit, offset }
            );

            return res.json(wrapPaginatedData(data, offset, limit, count));
        } catch (e) {
            next(ono(e as Error, "encountered error in getAllEvents"));
            return;
        }
    }
);

interface IGetEventParams {
    id: EventId;
}

interface IGetEventResponse extends IEventModelWithForecast {}

eventsRouter.get<IGetEventParams, IGetEventResponse>(
    "/:id",
    async (req, res) => {
        const { id } = req.params;

        // We'd want a better validation system than this since it's error-prone
        // to specify the version like this every time, but for this I'll allow it
        if (!id) {
            throw new httpError.BadRequest("id is not a valid uuid-v4");
        }

        const data = await eventService.getEvent(id);

        return res.json(data);
    }
);
