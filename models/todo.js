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
      // define association here
    }
  }
  Todo.init({
    name: DataTypes.STRING,
    isComplete: { 
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    } // 同 migration 新增 isComplete 欄位，對 db 做 query 才可以找尋相應欄位
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};