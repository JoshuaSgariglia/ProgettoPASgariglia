import { DataTypes, Sequelize, ModelOptions } from 'sequelize';


export default (sequelize: Sequelize, options: ModelOptions) =>
    sequelize.define('Resource', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        model: {
            type: DataTypes.STRING(64),
            allowNull: false,
        },
        serial: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        manufacturer: {
            type: DataTypes.STRING(64),
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM(...Object.values(ResourceType)),
            allowNull: false,
            defaultValue: ResourceType.GPU, // optional: default to 'gpu'
        },
    }, options);