import { DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { UserRole } from '../utils/enums';


export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare uuid: CreationOptional<string>;
  declare username: string;
  declare email: string;
  declare name: string;
  declare surname: string;
  declare password: string;
  declare role: CreationOptional<UserRole>;
  declare tokenAmount: CreationOptional<number>;

  /* timestamps!
  declare datetimeCreated: CreationOptional<Date>;
  declare datetimeUpdated: CreationOptional<Date>;
  declare datetimeDeleted: CreationOptional<Date | null>;
  */
}

export function defineUserModel(sequelize: Sequelize): void {
  User.init(
    {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(32),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(64),
            allowNull: false,
        },
        surname: {
            type: DataTypes.STRING(64),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(512),
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM(...Object.values(UserRole)),
            allowNull: false,
            defaultValue: UserRole.User,
        },
        tokenAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 50,
        },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      createdAt: 'datetimeCreated',
      updatedAt: 'datetimeUpdated',
      deletedAt: 'datetimeDeleted',
      paranoid: true,
    }
  );
}