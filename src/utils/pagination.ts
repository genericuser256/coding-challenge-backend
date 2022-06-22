import httpError from "http-errors";

//
// Note:
// This structure is roughly based off of Spotify's pagination structure which I think is quite nice
// I didn't take the time to add things like the url generation and things like that, but
// if this was an actual product I would
//

export interface IPaginationOptions {
    offset: number;
    limit: number;
}

export interface IPaginationQuery extends Partial<IPaginationOptions> {}

export const defaultPaginationOptions: IPaginationOptions = {
    offset: 0,
    limit: 10,
};

export const parseAndValidatePaginationQuery = (query: IPaginationQuery) => {
    const {
        offset = defaultPaginationOptions.offset,
        limit = defaultPaginationOptions.limit,
    } = query;

    if (offset < 0) {
        throw new httpError.BadRequest("OffsetRange");
    }

    if (limit < 1 || limit > 100) {
        throw new httpError.BadRequest("LimitRange");
    }

    return { offset, limit };
};

export interface IPaginatedData<T> {
    offset: number;
    limit: number;
    next: number | null;
    total: number;
    results: T[];
}

export const wrapPaginatedData = <T>(
    data: T[],
    offset: number,
    limit: number,
    total: number
): IPaginatedData<T> => {
    const next = limit + offset >= total ? null : limit + offset;
    return {
        offset,
        limit,
        next,
        total,
        results: data,
    };
};
