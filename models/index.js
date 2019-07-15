"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

require("dotenv").config();

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    process.env.DBPASSWORD,
    config
  );
}

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(file => {
    const model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require("./users")(sequelize, Sequelize);
db.Schedule = require("./schedules")(sequelize, Sequelize);
db.Room = require("./rooms")(sequelize, Sequelize);
db.UserRoom = require("./UserRoom")(sequelize, Sequelize);
db.Pole = require("./poles")(sequelize, Sequelize);
db.PoleUser = require("./pole_users")(sequelize, Sequelize);
db.UserSchedule = require("./UserSchedules")(sequelize, Sequelize);

db.Room.belongsToMany(db.User, { through: "UserRoom", as: "users" });
db.User.belongsToMany(db.Room, { through: "UserRoom", as: "rooms" });

db.Schedule.belongsToMany(db.User, { through: "UserSchedule" });
db.User.belongsToMany(db.Schedule, { through: "UserSchedule" });

module.exports = db;
