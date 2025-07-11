import { DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';


export class Calendar extends Model<InferAttributes<Calendar>, InferCreationAttributes<Calendar>> {
  declare uuid: CreationOptional<string>;
  declare resource: string;
  declare name: string;
  declare isArchived: CreationOptional<boolean>;
}

export function defineCalendarModel(sequelize: Sequelize) {
  Calendar.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      resource: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      isArchived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Calendar',
      tableName: 'calendars',
      timestamps: true,
      createdAt: 'datetimeCreated',
      updatedAt: 'datetimeUpdated',
      deletedAt: 'datetimeDeleted',
      paranoid: true,
    }
  );
}