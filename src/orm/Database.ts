import { Sequelize, Model, ModelOptions, ModelStatic } from 'sequelize';
import { PostgresConnector } from './PostgresConnector';
import UserORM from './UserORM';
import RequestORM from './RequestORM';
import CalendarORM from './CalendarORM';
import ResourceORM from './ResourceORM';

type OrmDefiner = (sequelize: Sequelize, options: ModelOptions) => ModelStatic<Model<any, any>>;

export class Database {
  private readonly sequelize: Sequelize = PostgresConnector.getInstance();

  private readonly defaultModelOptions: Partial<ModelOptions> = {
    timestamps: true,
    createdAt: 'datetimeCreated',
    updatedAt: 'datetimeUpdated',
    deletedAt: 'datetimeDeleted',
    paranoid: true,
  }

  public User;
  public Request;
  public Calendar;
  public Resource;


  constructor() {




    this.User = this.define(UserORM)
    this.Request = this.define(RequestORM)
    this.Calendar = this.define(CalendarORM)
    this.Resource = this.define(ResourceORM)

    this.associate();
  }

  private define(orm: OrmDefiner, options: ModelOptions = this.defaultModelOptions) {
    return orm(this.sequelize, options)
  }

  private associate() {
    // request.model.ts
    this.Request.belongsTo(this.User, {
      foreignKey: 'user',
      targetKey: 'uuid',
    });

    this.Request.belongsTo(this.Calendar, {
      foreignKey: 'calendar',
      targetKey: 'uuid',
    });

    // user.model.ts
    this.User.hasMany(this.Request, {
      foreignKey: 'user',
      sourceKey: 'uuid',
    });

    // calendar.model.ts
    this.Calendar.hasMany(this.Request, {
      foreignKey: 'calendar',
      sourceKey: 'uuid',
    });

    this.Calendar.hasOne(this.Resource, {
      foreignKey: 'calendar',
      sourceKey: 'uuid',
    });

    // resource.model.ts
    this.Resource.belongsTo(this.Calendar, {
      foreignKey: 'calendar',
      targetKey: 'uuid',
});
  }
}