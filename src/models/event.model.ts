import {
    Table,
    Column,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import {
    BaseModel,
    defaultTableOptions,
    IBaseModel,
    IBaseModelCreationAttr,
    Id,
} from "./baseModel";
import { Person } from "./person.model";

export interface IEventModel extends IBaseModel {
    name: string;
    isOutside: boolean;
    location: string;
    date: Date;
    organizer: Person;
}

export interface IEventModelCreationAttr extends IBaseModelCreationAttr {
    name: string;
    isOutside: boolean;
    location: string;
    date: Date;
    organizerId: Id;
}

@Table({ ...defaultTableOptions, tableName: "event" })
export class Event extends BaseModel<IEventModel, IEventModelCreationAttr> {
    @Column
    name!: string;

    @Column
    isOutside!: boolean;

    @Column
    location!: string;

    @Column
    date!: Date;

    @Column
    @ForeignKey(() => Person)
    organizerId!: Id;

    @BelongsTo(() => Person, "organizerId")
    organizer!: Person;
}
