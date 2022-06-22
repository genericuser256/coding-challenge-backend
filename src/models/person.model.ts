import {
    Table,
    Column,
    HasMany,
    DataType,
    NotEmpty,
    AllowNull,
} from "sequelize-typescript";
import {
    BaseModel,
    defaultTableOptions,
    IBaseModel,
    IBaseModelCreationAttr,
    Id,
} from "./baseModel";
import { IInvitationModel, Invitation } from "./invitation.model";

export type PersonId = Id<"person">;

export interface IPersonModel extends IBaseModel<PersonId, "person"> {
    name: string;
    invitations: Omit<IInvitationModel, "invitee" | "event">[];
}

export interface IPersonModelCreationAttr
    extends IBaseModelCreationAttr<PersonId, "person"> {
    name: string;
}

@Table({ ...defaultTableOptions, tableName: "person" })
export class Person extends BaseModel<
    PersonId,
    "person",
    IPersonModel,
    IPersonModelCreationAttr
> {
    @AllowNull(false)
    @NotEmpty
    @Column
    name!: string;

    //
    // Virtual columns for association
    //

    @HasMany(() => Invitation, {
        foreignKey: "inviteeId",
        keyType: DataType.UUID,
        onDelete: "CASCADE",
    })
    invitations?: Invitation[];
}
