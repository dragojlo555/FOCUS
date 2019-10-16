https://medium.com/@andrewoons/how-to-define-sequelize-associations-using-migrations-de4333bf75a7

sequelize db:migrate:undo --name 20190809074058-addUsername.js             ----brisanje konkretne migracije
sequelize model:generate --name Focus --attributes state:string            ----kreiranje novog modela
sequelize migration:create --name addUsername                              ----nova migracije
sequelize db:migrate  20190809074058-addUsername.js					----dodavanje konkretne migracije

