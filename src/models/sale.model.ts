import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db";

interface SaleAttributes {
  id: number;
  totalAmount: number;
}

interface SaleCreationAttributes extends Optional<SaleAttributes, 'id'> {}

export class Sale extends Model<SaleAttributes, SaleCreationAttributes> implements SaleAttributes {
  public id!: number;
  public totalAmount!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Sale.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    totalAmount: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
  },
  {
    sequelize,
    tableName: "sales",
  }
);
