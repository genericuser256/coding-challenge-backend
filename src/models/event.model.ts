import {
    Table,
    Column,
    BelongsTo,
    HasMany,
    DataType,
} from "sequelize-typescript";
import {
    BaseModel,
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
    @Column
    name!: string;

    @Column
    isOutside!: boolean;

    @Column
    location!: string;

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
