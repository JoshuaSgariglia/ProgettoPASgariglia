import { DataTypes, Sequelize, ModelOptions } from 'sequelize';


export default (sequelize: Sequelize, options: ModelOptions) =>
    sequelize.define('Calendar', {
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
    }, options);