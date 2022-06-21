import httpError from "http-errors";

//
// Note:
// This structure is roughly based off of Spotify's pagination structure which I think is quite nice
// I didn't take the time to add things like the url generation and things like that, but
// if this was an actual product I would
//

export interface IPaginationReq {
    offset: number;
    limit: number;
}

export interface IPaginationQuery extends Partial<IPaginationReq> {}

export const defaultPaginationReq: IPaginationReq = {
    offset: 0,
    limit: 1,
};

export const parseAndValidatePaginationQuery = (query: IPaginationQuery) => {
    const {
        offset = defaultPaginationReq.offset,
        limit = defaultPaginationReq.limit,
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
    limit: number,
    offset: number,
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
