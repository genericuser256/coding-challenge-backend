import httpError from "http-errors";
import {
    parseAndValidatePaginationQuery,
    wrapPaginatedData,
} from "./pagination";

describe("#pagination", () => {
    describe("#parseAndValidatePaginationQuery", () => {
        it.each([
            [
                { offset: 1, limit: 1 },
                { offset: 1, limit: 1 },
            ],
            [
                { offset: undefined, limit: 1 },
                { offset: 0, limit: 1 },
            ],
            [
                { offset: undefined, limit: undefined },
                { offset: 0, limit: 10 },
            ],
        ])(
            "handles valid data correctly, including providing defaults - %p, %p",
            (input, expected) => {
                expect(parseAndValidatePaginationQuery(input)).toEqual(
                    expected
                );
            }
        );

        it.each([
            [{ offset: -1 }, new httpError.BadRequest("OffsetRange")],
            [{ limit: -1 }, new httpError.BadRequest("LimitRange")],
            [{ limit: 101 }, new httpError.BadRequest("LimitRange")],
        ])("throws for invalid data - %p, %p", (input, expected) => {
            expect(() => parseAndValidatePaginationQuery(input)).toThrow(
                expected
            );
        });
    });

    describe("#wrapPaginatedData", () => {
        it.each([
            [0, 10, 100, 10],
            [0, 99, 100, 99],
            [0, 100, 100, null],
        ])(
            "wraps data and calculates next correctly - %p, %p, %p, %p",
            (offset, limit, total, expected) => {
                expect(wrapPaginatedData([], offset, limit, total)).toEqual({
                    offset,
                    limit,
                    next: expected,
                    total,
                    results: [],
                });
            }
        );
    });
});
