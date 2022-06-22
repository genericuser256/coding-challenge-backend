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

export type Id<Type extends string> = string & { type: Type };

export interface IBaseModel<IdType extends Id<Type>, Type extends string> {
    id: IdType;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export interface IBaseModelCreationAttr<
    IdType extends Id<Type>,
    Type extends string
> extends Optional<
        IBaseModel<IdType, Type>,
        "id" | "createdAt" | "updatedAt"
    > {}

export class BaseModel<
    IdType extends Id<Type>,
    Type extends string,
    TModelAttributes extends { [key: string]: any },
    TModelCreationAttributes extends { [key: string]: any }
> extends Model<
    TModelAttributes & IBaseModel<IdType, Type>,
    TModelCreationAttributes & IBaseModelCreationAttr<IdType, Type>
> {
    @AllowNull(false)
    @Default(DataType.UUIDV4)
    @PrimaryKey
    @Unique
    @Column(DataType.UUID)
    id!: IdType;

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

export const convertBaseModelToIBaseModel = <
    IdType extends Id<Type>,
    Type extends string
>(
    model: BaseModel<IdType, Type, any, any>
): IBaseModel<IdType, Type> => {
    return {
        id: model.id,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt,
        deletedAt: model.deletedAt,
    };
};
