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
import { Event, EventId, IEventModel } from "./event.model";
import { IPersonModel, Person, PersonId } from "./person.model";

export enum InvitationStatus {
    Pending = "pending",
    Accepted = "accepted",
    Maybe = "maybe",
    Rejected = "rejected",
}

export type InvitationId = Id<"invitation">;

export interface IInvitationModel
    extends IBaseModel<InvitationId, "invitation"> {
    status: InvitationStatus;
    invitee: Omit<IPersonModel, "invitations">;
    event: Omit<IEventModel, "organizer" | "attendees">;
}

export interface IInvitationModelCreationAttr
    extends IBaseModelCreationAttr<InvitationId, "invitation"> {
    inviteeId: PersonId;
    eventId: EventId;
    status?: InvitationStatus;
}

@Table({ ...defaultTableOptions, tableName: "invitation" })
export class Invitation extends BaseModel<
    InvitationId,
    "invitation",
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
