import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db";

interface ProductAttributes {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description?: string;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: number;
  public name!: string;
  public price!: number;
  public quantity!: number;
  public description?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getUpsells!: () => Promise<Product[]>;
  public addUpsell!: (arg: Product) => Promise<Product[]>;
  public removeUpsell!: (arg: Product) => Promise<number>;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    price: { 
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    quantity: {
      allowNull: false,
      type: DataTypes.INTEGER.UNSIGNED
    },
    description: {
      type: DataTypes.STRING
    },
  },
  {
    sequelize,
    tableName: 'products',
  }
)

Product.belongsToMany(Product, { as: 'Upsells', through: 'product_upsells', foreignKey: 'productId', otherKey: 'upsellProductId' })
