import { DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { ResourceType } from '../utils/enums';
import { ComputingResourceConfig } from '../utils/config';


export class ComputingResource extends Model<InferAttributes<ComputingResource>, InferCreationAttributes<ComputingResource>> {
  declare uuid: CreationOptional<string>;
  declare model: string;
  declare serial: number;
  declare manufacturer: string;
  declare type: CreationOptional<ResourceType>;

}

export function defineComputingResourceModel(sequelize: Sequelize): void {
  ComputingResource.init(
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