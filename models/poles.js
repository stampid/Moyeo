module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "poles",
    {
      poleTitle: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      roomId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      poleContent: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      expireTime: {
        type: DataTypes.DATE,
        allowNull: false
      },
      promiseTime: {
        type: DataTypes.DATE,
        allowNull: false
      },
      locationX: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      locationY: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      poleComplete: {
        type: DataTypes.BOOLEAN,
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
