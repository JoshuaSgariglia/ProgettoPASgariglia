import { DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { CalendarConfig } from '../utils/config';


/**
 * Calendar model class that extends Sequelize's Model class.
 * "CreationOptional" marks properties that can be undefined during creation, since they have default values.
*/
export class Calendar extends Model<InferAttributes<Calendar>, InferCreationAttributes<Calendar>> {
  // Properties declaration
  declare uuid: CreationOptional<string>;
  declare resource: string;
  declare name: string;
  declare isArchived: CreationOptional<boolean>;
  declare tokenCostPerHour: CreationOptional<number>;
}

/**
 * Function that initializes the Calendar class, defining the declared properties and the options.
 * Static class CalendarConfig (defined in config.ts) is used to get the default values.
 * "paranoid: true" ensures that soft deletion is enabled.
*/
export function defineCalendarModel(sequelize: Sequelize) {
  Calendar.init(
    // Properties characterization
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
    // Options
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