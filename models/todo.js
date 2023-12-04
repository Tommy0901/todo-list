'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Todo.belongsTo(models.User, {
        foreignKey: "userId"
      }) // 此參數可以省略，因為未設定時，會利用關聯對象的 model 名稱(user) 加上 id 作為 FK
    }
  }
  Todo.init({
    name: DataTypes.STRING,
    isComplete: { 
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }, // 同 migration 新增 isComplete 欄位，對 db 做 query 才可以找尋相應欄位
    userId: { 
      type: DataTypes.INTEGER,
      allowNull: false
    } // 同 migration 新增 userId 欄位，對 db 做 query 才可以找尋相應欄位
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};