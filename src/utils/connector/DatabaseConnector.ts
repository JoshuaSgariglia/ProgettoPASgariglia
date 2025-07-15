import { Sequelize } from "sequelize";
import { User, defineUserModel } from '../../models/User';
import { SlotRequest, defineSlotRequestModel } from '../../models/SlotRequest';
import { Calendar, defineCalendarModel } from '../../models/Calendar';
import { ComputingResource, defineComputingResourceModel } from '../../models/ComputingResource';

export class DatabaseConnector {
  private static instance: Sequelize;

  private constructor() { }

  public static getInstance(): Sequelize {
    if (!DatabaseConnector.instance) {
      DatabaseConnector.instance = this.getDatabaseConnector();
    }
    return DatabaseConnector.instance;
  }

  private static getDatabaseConnector(): Sequelize {
    // Initialize Sequelize
    const sequelize: Sequelize = this.initSequelize();

    // Initialize models
    this.defineModels(sequelize);

    // Setup associations
    this.associateModels();

    // Set cascading behaviour for soft delete
    this.setHooks()

    return sequelize;
  }

  private static initSequelize(): Sequelize {
    return new Sequelize(
      process.env.POSTGRES_DB || "postgres",
      process.env.POSTGRES_USER || "db-admin",
      process.env.POSTGRES_PASSWORD || "password",
      {
        host: process.env.POSTGRES_HOST || "localhost",
        port: Number(process.env.POSTGRES_PORT || "5432"),
        dialect: "postgres",
        timezone: '+02:00',
        logging: false,
      }
    );
  }

  private static defineModels(sequelize: Sequelize): void {
    // Initialize models
    defineUserModel(sequelize);
    defineComputingResourceModel(sequelize);
    defineCalendarModel(sequelize);
    defineSlotRequestModel(sequelize);
  }

  private static associateModels(): void {
    // SlotRequest belongs to User and Calendar
    SlotRequest.belongsTo(User, { foreignKey: 'user', targetKey: 'uuid' });
    SlotRequest.belongsTo(Calendar, { foreignKey: 'calendar', targetKey: 'uuid' });

    // User has many SlotRequest
    User.hasMany(SlotRequest, { foreignKey: 'user', sourceKey: 'uuid' });

    // Calendar has many SlotRequest
    Calendar.hasMany(SlotRequest, { foreignKey: 'calendar', sourceKey: 'uuid' });

    // Calendar has one ComputingResource
    Calendar.belongsTo(ComputingResource, { foreignKey: 'resource', targetKey: 'uuid' });
  }

  private static setHooks(): void {
    // Hook to soft delete related requests when a calendar is soft-deleted
    Calendar.addHook('afterDestroy', async (calendar, options) => {
      const calendarUuid = calendar.getDataValue('uuid'); // Safely access UUID

      await SlotRequest.destroy({
        where: { calendar: calendarUuid },
        individualHooks: true,
        transaction: options.transaction, // best practice if using transactions
      });
    });
  }
}