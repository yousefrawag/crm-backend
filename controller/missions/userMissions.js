const missionSchema = require("../../model/missionSchema");
const userMissions = async (req, res, next) => {
  try {
    const missions = await missionSchema
      .find({ assignedTo: req.params.id })
      .populate("assignedBy")
      .populate("project")
      .populate("assignedTo")
    res.json({ missions });
  } catch (error) {
    next(error);
  }
};
module.exports = userMissions;
