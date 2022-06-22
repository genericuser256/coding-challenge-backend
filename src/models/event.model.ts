import ono from "ono";
import {
    Table,
    Column,
    BelongsTo,
    HasMany,
    DataType,
    Index,
    AllowNull,
} from "sequelize-typescript";
import {
    BaseModel,
    convertBaseModelToIBaseModel,
    defaultTableOptions,
    IBaseModel,
    IBaseModelCreationAttr,
    Id,
} from "./baseModel";
import { Invitation } from "./invitation.model";
import { Person } from "./person.model";

export interface IEventModel extends IBaseModel {
    name: string;
    isOutside: boolean;
    location: string;
    date: Date;
    organizer: Person;
    attendees: Invitation[];
}

export interface IEventModelCreationAttr extends IBaseModelCreationAttr {
    name: string;
    isOutside: boolean;
    location: string;
    date: Date;
    organizerId: Id;
    attendeeIds?: Id[];
}

@Table({ ...defaultTableOptions, tableName: "event" })
export class Event extends BaseModel<IEventModel, IEventModelCreationAttr> {
    @AllowNull(false)
    @Column
    name!: string;

    @AllowNull(false)
    @Column
    isOutside!: boolean;

    @AllowNull(false)
    @Index("event_location")
    @Column
    location!: string;

    @AllowNull(false)
    @Index("event_date")
    @Column
    date!: Date;

    //
    // Virtual columns for association
    //

    @BelongsTo(() => Person, {
        foreignKey: "organizerId",
        keyType: DataType.UUID,
        onDelete: "CASCADE",
    })
    organizer?: Person;

    @HasMany(() => Invitation, {
        foreignKey: "eventId",
        keyType: DataType.UUID,
        onDelete: "CASCADE",
    })
    attendees?: Invitation[];
}

export const convertEventToIEventModel = (event: Event): IEventModel => {
    if (!event.organizer) {
        throw ono("event.organizer is undefined");
    }
    if (!event.attendees) {
        throw ono("event.attendees is undefined");
    }

    return {
        ...convertBaseModelToIBaseModel(event),
        name: event.name,
        isOutside: event.isOutside,
        location: event.location,
        date: event.date,
        organizer: event.organizer,
        attendees: event.attendees,
    };
};
