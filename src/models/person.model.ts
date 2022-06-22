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
} from "./baseModel";
import { Invitation } from "./invitation.model";

export interface IPersonModel extends IBaseModel {
    name: string;
    invitations: Invitation[];
}

export interface IPersonModelCreationAttr extends IBaseModelCreationAttr {
    name: string;
}

@Table({ ...defaultTableOptions, tableName: "person" })
export class Person extends BaseModel<IPersonModel, IPersonModelCreationAttr> {
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
