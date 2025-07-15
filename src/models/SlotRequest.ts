import { DataTypes, Sequelize, InferAttributes, InferCreationAttributes, Model, CreationOptional } from 'sequelize';
import { RequestStatus } from '../utils/enums';
import { SlotRequestConfig } from '../utils/config';



export class SlotRequest extends Model<InferAttributes<SlotRequest>, InferCreationAttributes<SlotRequest>> {
  declare uuid: CreationOptional<string>;
  declare user: string;
  declare calendar: string;
  declare status: CreationOptional<RequestStatus>;
  declare datetimeStart: Date;
  declare datetimeEnd: Date;
  declare title: string;
  declare reason: string;
  declare refusalReason: CreationOptional<string | null>;

}

export function defineSlotRequestModel(sequelize: Sequelize) {
  SlotRequest.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      calendar: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(RequestStatus)),
        defaultValue: RequestStatus.Pending,
        allowNull: false,
      },
      datetimeStart: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      datetimeEnd: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(SlotRequestConfig.MAX_TITLE_LENGTH),
        allowNull: false,
      },
      reason: {
        type: DataTypes.STRING(SlotRequestConfig.MAX_REASON_LENGTH),
        allowNull: false,
      },
      refusalReason: {
        type: DataTypes.STRING(SlotRequestConfig.MAX_REFUSAL_REASON_LENGTH),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'SlotRequest',
      tableName: 'slot_requests',
      timestamps: true,
      createdAt: 'datetimeCreated',
      updatedAt: 'datetimeUpdated',
      deletedAt: 'datetimeDeleted',
      paranoid: true,
    }
  );
}