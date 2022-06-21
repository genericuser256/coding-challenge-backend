import {
    AllowNull,
    Column,
    CreatedAt,
    DataType,
    Default,
    DeletedAt,
    Model,
    PrimaryKey,
    TableOptions,
    Unique,
    UpdatedAt,
} from "sequelize-typescript";
import { Optional } from "sequelize/types";

export type Id = string;

export interface IBaseModel {
    id: Id;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export interface IBaseModelCreationAttr
    extends Optional<IBaseModel, "id" | "createdAt" | "updatedAt"> {}

export class BaseModel<
    TModelAttributes extends { [key: string]: any },
    TModelCreationAttributes extends { [key: string]: any }
> extends Model<
    TModelAttributes & IBaseModel,
    TModelCreationAttributes & IBaseModelCreationAttr
> {
    @AllowNull(false)
    @Default(DataType.UUIDV4)
    @PrimaryKey
    @Unique
    @Column(DataType.UUID)
    id!: Id;

    @AllowNull(false)
    @CreatedAt
    @Column
    createdAt!: Date;

    @AllowNull(false)
    @UpdatedAt
    @Column
    updatedAt!: Date;

    @AllowNull(true)
    @DeletedAt
    @Column
    deletedAt?: Date;
}

export const defaultTableOptions: TableOptions = {
    timestamps: true,
    paranoid: true,
};

export const convertBaseModelToIBaseModel = (
    model: BaseModel<any, any>
): IBaseModel => {
    return {
        id: model.id,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
        deletedAt: model.deletedAt,
    };
};
