// const config = require("./index");

// module.exports = {
//   development: {
//     storage: config.dbFile,
//     dialect: "sqlite",
//     seederStorage: "sequelize",
//     logQueryParameters: true,
//     typeValidation: true,
//   },
//   production: {
//     use_env_variable: "DATABASE_URL",
//     dialect: "postgres",
//     seederStorage: "sequelize",
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false,
//       },
//     },
//     define: {
//       schema: process.env.SCHEMA,
//     },
//   },
// };


const config = require("./index");

module.exports = {
  development: {
    storage: process.env.DB_FILE, // Uses the dbFile defined in index.js
    dialect: "sqlite",
    seederStorage: "sequelize",
    logQueryParameters: true,
    typeValidation: true,
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    seederStorage: "sequelize",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    define: {
      schema: process.env.SCHEMA,
    },
  },
};
