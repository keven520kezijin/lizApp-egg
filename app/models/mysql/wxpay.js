/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('Wxpay', {
    wxpay_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    out_trade_no: {
      type: DataTypes.CHAR(20),
      unique: true
    },
    total_fee: {
      type: DataTypes.INTEGER(10).UNSIGNED,
    },
    trade_type: {
      type: DataTypes.STRING(20),
    },
    transaction_id: {
      type: DataTypes.STRING(35),
    },
    time_end: {
      type: DataTypes.STRING(30),
    },
    openid: {
      type: DataTypes.STRING(40),
    },
    is_subscribe: {
      type: DataTypes.INTEGER(1).UNSIGNED,
    },
    fee_type: {
      type: DataTypes.STRING(30),
    },
    bank_type: {
      type: DataTypes.STRING(30),
    },
    cash_fee: {
      type: DataTypes.INTEGER(10).UNSIGNED,
    },
    user_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
    },
    scene: {
      type: DataTypes.STRING(30),
    },
    remarks: {
      type: DataTypes.STRING(255),
    },
    update_time: {
      type: DataTypes.TIME
    }
  }, {
    tableName: 'szj_wxpay'
  });

  Model.associate = function() {

  }

  return Model;
};
