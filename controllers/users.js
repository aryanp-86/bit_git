import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
   
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();
    
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateProfile = async(req,res) => {
  try{
    const { id } = req.params;
    const {
      firstName,
      lastName,
      bio,
      picturePath,
      location,
      occupation,
    } = req.body;
    User.updateOne({ _id: id }, { $set: { firstName:firstName,lastName:lastName,bio:bio,picturePath:picturePath,location:location, occupation:occupation } })
  .then(result => {
    res.status(200).json(result)
  })
  .catch(error => {
    console.error(error);
  });
    

  }catch(err){
      res.status(500).json({err:err.message});
  }
};

export const reqFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const friend = await User.findById(friendId);
    if (!friend.reqFriends.includes(id)) {
      friend.reqFriends.push(id);
    }
    await friend.save();

  }catch(err){
      res.status(500).json({err:err.message})
  }
};

export const reqFriendAdd= async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
      friend.friends.push(id);
      user.reqFriends = user.reqFriends.filter((id)=>{id !== friendId})
      friend.reqFriends = friend.reqFriends.filter((id)=>{id !== id})
    } 
    await user.save();
    await friend.save();
    
  }catch(err){
      res.status(500).json({err:err.message})
  }
};


export const getUserFriendReq = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friendsReq = await Promise.all(
      user.reqFriends.map((id) => User.findById(id))
    );
    const formattedReqFriends = friendsReq.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedReqFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


export const reqFriendRemove = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const remUser = user.reqFriends.indexOf(friendId);
    console.log(remUser);
    // user.reqFriends = user.reqFriends.splice(remUser,1);
    await user.save();
  }catch(err){
      res.status(500).json({err:err.message})
  }
};

export const checkLive = async (req, res) => {
  try {
    const {id} = req.params;
    const user = await User.findById(id);
    const setTrue = user.isLive;
    User.findOneAndUpdate({_id: id},{$set:{isLive: !setTrue}})
    .then(result => {
      res.status(200).json(result)
    })
    .catch(error => {
      console.error(error);
    });

  }catch(err){
      res.status(500).json({err:err.message})
  }
};

