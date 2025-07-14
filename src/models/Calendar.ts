import { DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { CalendarConfig } from '../utils/config';


export class Calendar extends Model<InferAttributes<Calendar>, InferCreationAttributes<Calendar>> {
  declare uuid: CreationOptional<string>;
  declare resource: string;
  declare name: string;
  declare isArchived: CreationOptional<boolean>;
  declare tokenCostPerHour: CreationOptional<number>;
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
        type: DataTypes.STRING(CalendarConfig.MAX_NAME_LENGTH),
        allowNull: false,
      },
      isArchived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      tokenCostPerHour: {
        type: DataTypes.INTEGER,
        defaultValue: CalendarConfig.DEFAULT_TOKEN_COST_PER_HOUR,
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