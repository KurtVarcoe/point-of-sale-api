import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db";

interface SaleProductAttributes {
  id: number;
  saleId: number;
  productId: number;
  quantity: number;
  productName: string;
  productPrice: number;
}

interface SaleProductCreationAttributes extends Optional<SaleProductAttributes, 'id'> {}

export class SaleProduct
  extends Model<SaleProductAttributes, SaleProductCreationAttributes>
  implements SaleProductAttributes
{
  public id!: number;
  public saleId!: number;
  public productId!: number;
  public quantity!: number;
  public productName!: string;
  public productPrice!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}


SaleProduct.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    saleId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    quantity: {
      allowNull: false,
      type: DataTypes.INTEGER.UNSIGNED,
      unique: true,
    },
    productName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    productPrice: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
  },
  {
    sequelize,
    tableName: 'sale_products',
  }
);
