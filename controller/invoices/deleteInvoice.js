const invoiceSchema = require("../../model/invoiceSchema");
const deleteInvoice = async (req, res, next) => {
  const { id } = req.params;
  try {
    const invoice = await invoiceSchema.findByIdAndDelete(id);
    if (!invoice) {
      res.status(404).json({ message: "Invoice doesn't exist" });
    }
    res.status(200).json({ message: "invoce deleted successfully" });
  } catch (error) {
    next(error);
  }
};
module.exports = deleteInvoice;
