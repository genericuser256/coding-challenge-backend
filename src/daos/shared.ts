import { FindOptions, WhereAttributeHashValue, Op } from "sequelize";
import { defaultPaginationOptions } from "../utils/pagination";

export interface IQueryOptions extends Omit<FindOptions, "where"> {}

export const defaultQueryOptions: IQueryOptions = {
    ...defaultPaginationOptions,
};

export const convertRangeToQuery = <T>(
    from?: T,
    to?: T,
    inclusive = true
): WhereAttributeHashValue<T> => {
    const res: Record<symbol, T> = {};
    if (from) {
        if (inclusive) {
            res[Op.gte] = from;
        } else {
            res[Op.gt] = from;
        }
    }
    if (to) {
        if (inclusive) {
            res[Op.lte] = to;
        } else {
            res[Op.lt] = to;
        }
    }
    return res;
};

export interface ICountedData<T> {
    count: number;
    data: T[];
}
