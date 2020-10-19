/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('UsersPhotos', {
    photo_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    image_url: {
      type: DataTypes.STRING(255),
    },
    user_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
    },
    update_time: {
      type: DataTypes.TIME
    },
    create_time: {
      type: DataTypes.DATE,
    }
  }, {
    tableName: 'szj_users_photos'
  });

  Model.associate = function() {

  }

  return Model;
};
