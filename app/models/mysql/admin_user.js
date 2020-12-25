/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('AdminUser', {
    admin_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(20),
    },
    password: {
      type: DataTypes.STRING(40),
    },
    update_time: {
      type: DataTypes.TIME
    },
    create_time: {
      type: DataTypes.DATE,
    }
  }, {
    tableName: 'szj_admin_user'
  });

  Model.associate = function() {

  }

  return Model;
};
