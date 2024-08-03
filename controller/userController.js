const userSchema = require("../model/userSchema");
const cloudinary = require("../middleware/cloudinary");
const bcrypt = require("bcrypt");
exports.getUsers = (req, res, next) => {
  userSchema
    .find({})
    .populate("role")
    .select("-password")
    .then((users) => {
      if (!users.length) {
        res.status(404).json({ message: "there is no users" });
      }
      res.status(200).json({ users });
    })
    .catch((err) => next(err));
};

exports.addUser = async (req, res, next) => {
  try {
    let user = new userSchema(req.body);
    if (req.file) {
      const { imageURL, imageID } = await cloudinary.upload(
        req.file.path,
        "userImages"
      );
      user.imageURL = imageURL;
      user.imageID = imageID;
    }
    await user.save();
    res.status(200).json({ action: "user added successfully" });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.body;
    const updateData = { ...req.body };
    let user = await userSchema.findById(id);
    if (!user) {
      return res.status(404).json({ message: "This user desn't exist" });
    }
    if (req.file) {
      await cloudinary.delete(user.imageID);
      const { imageURL, imageID } = await cloudinary.upload(
        req.file.path,
        "userImages"
      );
      updateData.imageURL = imageURL;
      updateData.imageID = imageID;
    }
    const updatedUesr = await userSchema.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    res.status(200).json({ message: "User updated successfully", updatedUesr });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = (req, res, next) => {
  const { id } = req.params;

  userSchema
    .findByIdAndDelete(id)
    .then(async (user) => {
      if (!user) {
        return res.status(404).json("User doesn't exist");
      }
      if (user.imageID) await cloudinary.delete(user.imageID);
      res.status(200).json({ message: "User deleted successfully" });
    })
    .catch((err) => next(err));
};

exports.getUserById = (req, res, next) => {
  const { id } = req.params;

  userSchema
    .findById(id)
    .populate("role")
    .select("-password")
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: "User doesn't exist" });
      }
      res.status(200).json({ user });
    })
    .catch((err) => next(err));
};

exports.changePassword = async (req, res, next) => {
  let { id, oldPassword, newPassword } = req.body;

  try {
    const user = await userSchema.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: "Incorrect password" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await userSchema.findByIdAndUpdate(id, { password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};