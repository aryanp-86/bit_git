import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  reqFriend,
  reqFriendAdd,
  reqFriendRemove,
  checkLive,
} from "../controllers/users.js";
import {updateProfile}  from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";
import { getUserFriendReq } from "../controllers/users.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.get("/:id/request", getUserFriendReq);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
router.patch("/:id/:friendId/request", verifyToken, reqFriend);
router.patch("/:id/:friendId/request/add", verifyToken, reqFriendAdd);
router.patch("/:id/:friendId/request/remove", verifyToken, reqFriendRemove);
router.patch("/:id", verifyToken, checkLive);




export default router;
