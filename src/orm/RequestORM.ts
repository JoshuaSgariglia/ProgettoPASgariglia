import { DataTypes, Sequelize, ModelOptions } from 'sequelize';


export default (sequelize: Sequelize, options: ModelOptions) =>
    sequelize.define('Request', {
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
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        reason: {
            type: DataTypes.STRING(512),
            allowNull: false,
        },
        refusalReason: {
            type: DataTypes.STRING(512),
            allowNull: true,
        },
        
    }, options);