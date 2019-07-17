import sequelize from "sequelize";
import { User, Room, UserRoom } from "../../models/index";

export const createRoom = (req, res) => {
  const { roomTitle, roomSize, region, category, poleId, userId } = req.body;
  const result = {
    success: null,
    data: null,
    createdAt: null
  };

  Room.create({
    roomTitle,
    roomSize,
    region,
    category,
    poleId,
    permissionId: userId
  })
    .then(data => {
      UserRoom.create({
        roomId: data.id,
        userId
      })
        .then(roomUser => {
          result.success = true;
          result.data = data;
          result.createdAt = roomUser.createdAt;
          res.status(200);
          res.send(result);
        })
        .catch(err => {
          result.success = false;
          res.status(404);
          res.send(result);
        });
    })
    .catch(err => {
      result.success = false;
      res.status(4040);
      res.send(result);
    });
};

export const roomList = (req, res) => {
  const { roomId, region, category } = req.query;
  let { limit, roomTitle } = req.query;
  roomTitle = roomTitle === undefined ? "" : roomTitle;

  const where = {
    id: { [sequelize.Op.lt]: roomId },
    [sequelize.Op.and]: {
      region,
      category,
      roomTitle: { [sequelize.Op.like]: `%${roomTitle}%` }
    }
  };

  const result = { success: null, data: null };

  limit = Number(limit);

  if (roomId === undefined) {
    delete where.id;
  }

  Room.findAll({
    order: [["id", "DESC"]],
    limit,
    where
  })
    .then(data => {
      result.success = true;
      result.data = data;
      res.status(200);
      res.send(result);
    })
    .catch(err => {
      res.status(404);
      res.send(err);
    });
};

export const member = (req, res) => {
  const { roomId } = req.query;
  const result = { success: null, data: null };

  Room.findAll({
    where: { id: roomId },
    include: [
      {
        model: User,
        as: "users",
        through: {
          required: true
        }
      }
    ]
  }).then(data => {
    result.success = true;
    result.data = data[0].users;
    res.status(200);
    res.send(result);
  });
};
