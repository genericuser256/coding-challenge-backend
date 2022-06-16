import { Table, Column } from "sequelize-typescript";
import {
    BaseModel,
    defaultTableOptions,
    IBaseModel,
    IBaseModelCreationAttr,
} from "./baseModel";

export interface IPersonModel extends IBaseModel {
    name: string;
}

export interface IPersonModelCreationAttr extends IBaseModelCreationAttr {
    name: string;
}

@Table({ ...defaultTableOptions, tableName: "person" })
export class Person extends BaseModel<IPersonModel, IPersonModelCreationAttr> {
    @Column
    name!: string;
}
