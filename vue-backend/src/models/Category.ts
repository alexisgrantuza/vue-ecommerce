import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export const Category = sequelize.define("Category", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

Category.sync({ alter: true });
