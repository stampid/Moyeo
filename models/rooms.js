module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "rooms",
    {
      roomTitle: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      roomSize: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      region: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      category: {
        type: DataTypes.STRING(10),
        allowNull: false
      },
      poleId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      timestamps: false, // 타임스탬프 사용여부
      underscored: true, // snake case(true) / camle case(false) 권장 여부
      paranoid: true // 삭제일
    }
  );
};

// 연결로 필요한
