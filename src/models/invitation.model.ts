import {
    Table,
    Column,
    Default,
    DataType,
    BelongsTo,
    AllowNull,
} from "sequelize-typescript";
import {
    BaseModel,
    defaultTableOptions,
    IBaseModel,
    IBaseModelCreationAttr,
    Id,
} from "./baseModel";
import { Event } from "./event.model";
import { Person } from "./person.model";

export enum InvitationStatus {
    Pending = "pending",
    Accepted = "accepted",
    Maybe = "maybe",
    Rejected = "rejected",
}

export interface IInvitationModel extends IBaseModel {
    status: InvitationStatus;
    invitee: Person;
    event: Event;
}

export interface IInvitationModelCreationAttr extends IBaseModelCreationAttr {
    inviteeId: Id;
    eventId: Id;
    status?: InvitationStatus;
}

@Table({ ...defaultTableOptions, tableName: "invitation" })
export class Invitation extends BaseModel<
    IInvitationModel,
    IInvitationModelCreationAttr
> {
    @Default(InvitationStatus.Pending)
    @AllowNull(false)
    @Column(DataType.ENUM(...Object.values(InvitationStatus)))
    status!: InvitationStatus;

    //
    // Virtual columns for association
    //

    @BelongsTo(() => Person, {
        foreignKey: "inviteeId",
        keyType: DataType.UUID,
        onDelete: "CASCADE",
    })
    invitee?: Person;

    @BelongsTo(() => Event, {
        foreignKey: "eventId",
        keyType: DataType.UUID,
        onDelete: "CASCADE",
    })
    event?: Event;
}
