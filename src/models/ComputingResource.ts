import { DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { ResourceType } from '../utils/enums';
import { ComputingResourceConfig } from '../utils/config';

/*
 * ComputingResource model class that extends Sequelize's Model class.
 * "CreationOptional" marks properties that can be undefined during creation, since they have default values.
*/
export class ComputingResource extends Model<InferAttributes<ComputingResource>, InferCreationAttributes<ComputingResource>> {
  // Properties declaration
  declare uuid: CreationOptional<string>;
  declare model: string;
  declare serial: number;
  declare manufacturer: string;
  declare type: CreationOptional<ResourceType>;

}

/*
 * Function that initializes the ComputingResource class, defining the declared properties and the options.
 * Static class ComputingResourceConfig (defined in config.ts) is used to get the default values.
 * "paranoid: true" ensures that soft deletion is enabled.
*/
export function defineComputingResourceModel(sequelize: Sequelize): void {
  ComputingResource.init(
    // Properties characterization
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      model: {
        type: DataTypes.STRING(ComputingResourceConfig.MAX_MODEL_LENGTH),
        allowNull: false,
      },
      serial: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      manufacturer: {
        type: DataTypes.STRING(ComputingResourceConfig.MAX_MANUFACTURER_LENGTH),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(ResourceType)),
        allowNull: false,
        defaultValue: ResourceType.GPU,
      },
    },
    // Options
    {
      sequelize,
      modelName: 'ComputingResource',
      tableName: 'computing_resources',
      timestamps: true,
      createdAt: 'datetimeCreated',
      updatedAt: 'datetimeUpdated',
      deletedAt: 'datetimeDeleted',
      paranoid: true,
    }
  );
}