import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import { Category } from "./Category";

export const Product = sequelize.define("Product", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    images: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: []
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    rating: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0
    },
    num_reviews: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    discount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0
    },
    popular: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    onSale: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    }
});

Product.belongsTo(Category, { foreignKey: "category_id" });