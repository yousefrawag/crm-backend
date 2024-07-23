const express = require('express')
const router = express.Router()
const Addmediator = require('../controler/mediator/Addmediator')
const Getallmediators = require("../controler/mediator/Getallmediators")
const Spasficmediator = require('../controler/mediator/Spasficmediator')
const updateMediator = require('../controler/mediator/updateMediator')
const Deletemediator = require('../controler/mediator/Deletemediator')
router.post("/add-mediator" , Addmediator)
router.get("/" , Getallmediators)
router.route('/:id').get(Spasficmediator).put(updateMediator).delete(Deletemediator)
module.exports = router