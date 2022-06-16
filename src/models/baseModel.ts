import {
    Column,
    CreatedAt,
    DataType,
    Model,
    TableOptions,
    UpdatedAt,
} from "sequelize-typescript";
import { Optional } from "sequelize/types";

export type Id = string;

export interface IBaseModel {
    id: Id;
    createdAt: Date;
    updatedAt: Date;
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
    @Column({
        allowNull: false,
        primaryKey: true,
        unique: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    id!: Id;

    @Column({
        allowNull: false,
    })
    @CreatedAt
    createdAt!: Date;

    @Column({
        allowNull: false,
    })
    @UpdatedAt
    updatedAt!: Date;
}

export const defaultTableOptions: TableOptions = {
    timestamps: true,
};
