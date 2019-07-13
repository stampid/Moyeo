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

export const listRoom = (req, res) => {};
