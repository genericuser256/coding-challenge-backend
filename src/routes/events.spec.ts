import { startOfTomorrow } from "date-fns";
import request from "supertest";
import { setupExpress } from "../express";
import { eventService } from "../services";
import {
    defaultPaginationOptions,
    wrapPaginatedData,
} from "../utils/pagination";

jest.mock("../services");

const mockedEventService = eventService as jest.Mocked<typeof eventService>;

describe("#events", () => {
    const app = setupExpress();

    describe("#getAllEvents", () => {
        beforeEach(() => {
            // need to reset the mock in between as the requests seem to be interleaving
            // in an unexpected way
            mockedEventService.getAllEvents.mockReset();
        });

        it.each([
            [
                "all default values",
                {},
                defaultPaginationOptions.offset,
                defaultPaginationOptions.limit,
            ],
            [
                "specifying from",
                { from: "1969-07-20" },
                defaultPaginationOptions.offset,
                defaultPaginationOptions.limit,
            ],
            [
                "specifying until",
                { until: startOfTomorrow().toISOString() },
                defaultPaginationOptions.offset,
                defaultPaginationOptions.limit,
            ],
            [
                "specifying from & until",
                { from: "1969-07-20", until: startOfTomorrow().toISOString() },
                defaultPaginationOptions.offset,
                defaultPaginationOptions.limit,
            ],
            ["specifying pagination", { offset: 1, limit: 42 }, 1, 42],
        ])(
            "passes the happy path with query params - %p",
            async (_, query, expectedOffset, expectedLimit) => {
                const returnedData = { count: 100, data: [] };
                mockedEventService.getAllEvents.mockResolvedValueOnce(
                    returnedData
                );

                const response = await request(app).get("/events").query(query);
                expect(response.status).toBe(200);
                expect(response.body).toEqual(
                    wrapPaginatedData(
                        returnedData.data,
                        expectedOffset,
                        expectedLimit,
                        returnedData.count
                    )
                );

                expect(mockedEventService.getAllEvents).toBeCalled();
            }
        );

        it.each([
            ["invalid from date", { from: "tomorrow" }, 400, "from is invalid"],
            [
                "invalid until date",
                { until: "tomorrow" },
                400,
                "until is invalid",
            ],
            [
                "invalid date range",
                { from: startOfTomorrow().toISOString(), until: "1969-07-20" },
                400,
                "until must be after from",
            ],
            // As we've tested the pagination validation on it's own, we can assume it works here
            // as long as we test that it's being applied correctly
            ["invalid limit", { limit: 101 }, 400, /LimitRange/],
        ])(
            "returns the expected errors for query params - %p",
            async (_, query, expectedStatus, expectedError) => {
                const returnedData = { count: 100, data: [] };
                mockedEventService.getAllEvents.mockResolvedValueOnce(
                    returnedData
                );

                const response = await request(app).get("/events").query(query);
                expect(response.status).toBe(expectedStatus);
                expect(response.body.error.message).toMatch(expectedError);

                expect(mockedEventService.getAllEvents).not.toBeCalled();
            }
        );

        it("returns the expected error when the service throws", async () => {
            mockedEventService.getAllEvents.mockRejectedValueOnce(
                new Error("oopsy")
            );

            const response = await request(app).get("/events");
            expect(response.status).toBe(500);
            expect(response.body.error.message).toMatch(/oopsy/);

            expect(mockedEventService.getAllEvents).toBeCalled();
        });
    });
});
