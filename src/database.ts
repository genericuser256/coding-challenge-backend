import { join } from "path";
import { Sequelize } from "sequelize-typescript";

let db: Sequelize;

const dbLocation = join(__dirname, "../data/myDb.db");
const modelLocation = join(__dirname, "./models/*.model.ts");

export const getDBConnection = async (): Promise<Sequelize> => {
    if (!db) {
        db = new Sequelize({
            dialect: "sqlite",
            storage: dbLocation,
            models: [modelLocation],
            modelMatch: (filename, member) => {
                return (
                    filename.substring(0, filename.indexOf(".model")) ===
                    member.toLowerCase()
                );
            },
            logging: false,
        });

        await db.sync();
    }
    return db;
};
