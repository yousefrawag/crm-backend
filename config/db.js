const db  = require('mongoose');
const conectDB = async () => {
try {
     await db.connect("mongodb://0.0.0.0:27017/crm")
  
} catch (error) {
    console.log(error);
}


}
module.exports = conectDB