const customerSchema = require("../../model/customerSchema");
const GetallCustomer = async (req, res, next) => {
  try {
    const Customers = await customerSchema.find({});
    res.status(200).json({ Customers });
  } catch (error) {
    next(error);
  }
};
module.exports = GetallCustomer;
