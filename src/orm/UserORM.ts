import { DataTypes, Sequelize, ModelOptions } from 'sequelize';


export default (sequelize: Sequelize, options: ModelOptions) =>
    sequelize.define('User', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(32),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(64),
            allowNull: false,
        },
        surname: {
            type: DataTypes.STRING(64),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(512), // allow long hashes
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM(...Object.values(UserRole)),
            allowNull: false,
            defaultValue: UserRole.User, // optional: default to 'user'
        },
        tokenAmount: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 50, // optional: default to '50'
        }
    }, options);