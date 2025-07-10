import { Sequelize } from "sequelize";
import { User, defineUserModel } from './User';
import { SlotRequest, defineSlotRequestModel } from './SlotRequest';
import { Calendar, defineCalendarModel } from './Calendar';
import { ComputingResource, defineComputingResourceModel } from './ComputingResource';

export class DatabaseConnector {
  private static instance: Sequelize;
  
  private constructor() {}

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

    return sequelize;
  }

  private static initSequelize(): Sequelize {
    return new Sequelize(
        process.env.POSTGRES_DB || "postgres",
        process.env.POSTGRES_USER || "admin",
        process.env.POSTGRES_PASSWORD || "password",
        {
          host: process.env.POSTGRES_HOST || "localhost",
          port: Number(process.env.POSTGRES_PORT || "5432"),
          dialect: "postgres",
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
    Calendar.hasOne(ComputingResource, { foreignKey: 'calendar', sourceKey: 'uuid' });

    // ComputingResource belongs to Calendar
    ComputingResource.belongsTo(Calendar, { foreignKey: 'calendar', targetKey: 'uuid' });
  }
}