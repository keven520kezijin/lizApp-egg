/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;
  const Model = app.model.define('Tags', {
        tag_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        tag_name: {
            type: DataTypes.STRING(50),
        },
        is_hot: {
            type: DataTypes.INTEGER(1).UNSIGNED,
        },
        pid: {
            type: DataTypes.INTEGER(10).UNSIGNED,
        },
        update_time: {
            type: DataTypes.TIME
        },
        create_time: {
            type: DataTypes.DATE,
        }
    }, {
        tableName: 'szj_tags'
    });
    Model.associate = function() {

    }
    return Model;
};
