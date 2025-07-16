import { Sequelize } from "sequelize";
import { User, defineUserModel } from '../../models/User';
import { SlotRequest, defineSlotRequestModel } from '../../models/SlotRequest';
import { Calendar, defineCalendarModel } from '../../models/Calendar';
import { ComputingResource, defineComputingResourceModel } from '../../models/ComputingResource';
import { POSTGRES_DB, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER } from "../config";
import logger from "../logger";

/**
 * DatabaseConnector is used to connect to the database through Sequelize.
 * It encapsulates a Singleton instance of Sequelize to ensure a single DB connection throughout the app.
*/
export class DatabaseConnector {
  private static instance: Sequelize;

  // Private constructor to prevent instantiation from outside
  private constructor() { }

  // Public method to get the singleton Sequelize instance
  public static getInstance(): Sequelize {
    // If no instance exists yet, create one
    if (!DatabaseConnector.instance) {
      DatabaseConnector.instance = this.getDatabaseConnector();
    }
    return DatabaseConnector.instance;
  }

  // Internal method to initialize Sequelize, define models, associations, and hooks
  private static getDatabaseConnector(): Sequelize {
    // Initialize Sequelize connection with DB config
    const sequelize: Sequelize = this.initSequelize();

    logger.info("Sequelize instance initialized")

    // Define all data models on the Sequelize instance
    this.defineModels(sequelize);

    logger.info("Model classes properties defined")

    // Set up model associations
    this.associateModels();

    logger.info("Model classes associations defined")

    // Set hooks for cascading behavior on soft deletes
    this.setHooks();

    logger.info("Database hooks for cascading behaviour set")

    return sequelize;
  }

  // Initializes Sequelize instance with database credentials and options
  private static initSequelize(): Sequelize {
    return new Sequelize(
      POSTGRES_DB,
      POSTGRES_USER,
      POSTGRES_PASSWORD,
      {
        host: POSTGRES_HOST,
        port: POSTGRES_PORT,
        dialect: "postgres",                               
        timezone: '+02:00',                                
        logging: false,                                   
      }
    );
  }

  // Defines all models by calling their respective initialization functions with Sequelize instance
  private static defineModels(sequelize: Sequelize): void {
    defineUserModel(sequelize);
    defineComputingResourceModel(sequelize);
    defineCalendarModel(sequelize);
    defineSlotRequestModel(sequelize);
  }

  // Sets up associations between models
  private static associateModels(): void {
    // SlotRequest belongs to User via foreign key 'user' pointing to User's uuid
    SlotRequest.belongsTo(User, { foreignKey: 'user', targetKey: 'uuid' });

    // SlotRequest belongs to Calendar via foreign key 'calendar' pointing to Calendar's uuid
    SlotRequest.belongsTo(Calendar, { foreignKey: 'calendar', targetKey: 'uuid' });

    // User has many SlotRequests, linked by foreign key 'user'
    User.hasMany(SlotRequest, { foreignKey: 'user', sourceKey: 'uuid' });

    // Calendar has many SlotRequests, linked by foreign key 'calendar'
    Calendar.hasMany(SlotRequest, { foreignKey: 'calendar', sourceKey: 'uuid' });

    // Calendar belongs to ComputingResource via foreign key 'resource' pointing to ComputingResource's uuid
    Calendar.belongsTo(ComputingResource, { foreignKey: 'resource', targetKey: 'uuid' });
  }

  // Adds hooks to models for special behaviors like cascading soft deletes
  private static setHooks(): void {
    // When a Calendar is soft deleted, also soft delete all associated SlotRequests
    Calendar.addHook('afterDestroy', async (calendar, options) => {
      const calendarUuid = calendar.getDataValue('uuid');

      await SlotRequest.destroy({
        where: { calendar: calendarUuid },    // Target SlotRequests related to this Calendar
        individualHooks: true,                // Run hooks on each destroyed SlotRequest
        transaction: options.transaction      // Use transaction if available for atomic operation
      });
    });
  }
}
