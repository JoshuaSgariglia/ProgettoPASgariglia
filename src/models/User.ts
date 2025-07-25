import { DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { UserRole } from '../utils/enums';
import { UserConfig } from '../utils/config';

/**
 * User model class that extends Sequelize's Model class.
 * "CreationOptional" marks properties that can be undefined during creation, since they have default values.
*/
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    // Properties declaration
    declare uuid: CreationOptional<string>;
    declare username: string;
    declare email: string;
    declare name: string;
    declare surname: string;
    declare password: string;
    declare role: CreationOptional<UserRole>;
    declare tokenAmount: CreationOptional<number>;

    // Override to remove "password"
    toJSON() {
        const { password, ...safeAttributes } = this.get();
        return safeAttributes;
    }
}

/**
 * Function that initializes the User class, defining the declared properties and the options.
 * Static class UserConfig (defined in config.ts) is used to get the default values.
 * "paranoid: true" ensures that soft deletion is enabled.
*/
export function defineUserModel(sequelize: Sequelize): void {
    User.init(
        // Properties characterization
        {
            uuid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING(UserConfig.MAX_USERNAME_LENGTH),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(UserConfig.MAX_EMAIL_LENGTH),
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(UserConfig.MAX_NAME_LENGTH),
                allowNull: false,
            },
            surname: {
                type: DataTypes.STRING(UserConfig.MAX_SURNAME_LENGTH),
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING(512), // Long string for hashes
                allowNull: false,
            },
            role: {
                type: DataTypes.ENUM(...Object.values(UserRole)),
                allowNull: false,
                defaultValue: UserRole.User,
            },
            tokenAmount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: UserConfig.INITIAL_TOKEN_AMOUNT,
            },
        },
        // Options
        {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            timestamps: true,
            createdAt: 'datetimeCreated',
            updatedAt: 'datetimeUpdated',
            deletedAt: 'datetimeDeleted',
            paranoid: true,
        }
    );
}