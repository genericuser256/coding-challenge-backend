import { isBefore, isValid } from "date-fns";
import { Router } from "express";
import httpError from "http-errors";
import { IsUUID } from "sequelize-typescript";
import { Id } from "../models/baseModel";
import { IEventModel } from "../models/event.model";
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
    (req, res) => {
        const { from, until } = req.query;
        let fromDate: Date;
        let untilDate: Date | undefined;

        if (from) {
            fromDate = new Date(from);
            if (!isValid(fromDate)) {
                throw new httpError.BadRequest("from is invalid");
            }
        } else {
            fromDate = new Date();
        }

        if (until) {
            untilDate = new Date(until);
            if (!isValid(untilDate)) {
                throw new httpError.BadRequest("until is invalid");
            }
        }

        if (untilDate && isBefore(fromDate, untilDate)) {
            throw new httpError.BadRequest("until must be after from");
        }

        const { limit, offset } = parseAndValidatePaginationQuery(req.query);

        return res.json(wrapPaginatedData([], limit, offset, 100));
    }
);

interface IGetEventParams {
    id: Id;
}

interface IGetEventResponse extends IEventModel {}

eventsRouter.get<IGetEventParams, IGetEventResponse>(":id", (req, res) => {
    const { id } = req.params;

    // We'd want a better validation system than this since it's error-prone
    // to specify the version like this every time, but for this I'll allow it
    if (!IsUUID("4")(id)) {
        throw new httpError.BadRequest("id is not a valid uuid-v4");
    }
});
