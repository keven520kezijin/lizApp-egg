/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('Follow', {
    follow_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    author_id: {
      type: DataTypes.INTEGER(10).UNSIGNED
    },
    create_time: {
      type: DataTypes.TIME
    }
  }, {
    tableName: 'szj_follow'
  });

  Model.associate = function() {

  }

  return Model;
};
