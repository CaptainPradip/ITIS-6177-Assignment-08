const { check, validationResult } = require("express-validator");
const validateAgent = [
    check("agentName")
      .isString()
      .withMessage("Agent name should be string type")
      .exists()
      .isLength({ min: 2, max: 40 })
      .withMessage("Agent name length should between 2 to 40")
      .trim()
      .escape(),
    check("workingArea")
      .isString()
      .withMessage("working Area name should be string type")
      .exists()
      .isLength({ min: 2, max: 35 })
      .withMessage("working Area  length should between 2 to 35")
      .trim()
      .escape(),
    check("commission")
      .isFloat()
      .withMessage("commission must be float type")
      .exists(),
    check("phoneNo").isMobilePhone().withMessage("Not valid phone number"),
    check("country")
      .isString()
      .withMessage("country should be string type")
      .exists()
      .isLength({ min: 2, max: 25 })
      .withMessage("country length should between 2 to 25")
      .trim()
      .escape(),
  ];
  
  const validateAgentPatch = [
    check("agentName")
      .isString()
      .withMessage("Agent name should be string type")
      .isLength({ min: 2, max: 40 })
      .withMessage("Agent name length should between 2 to 40")
      .trim()
      .escape(),
    check("workingArea")
      .isString()
      .withMessage("working Area name should be string type")
      .isLength({ min: 2, max: 35 })
      .withMessage("working Area  length should between 2 to 35")
      .trim()
      .escape(),
    check("commission").isFloat().withMessage("commission must be float type"),
    check("phoneNo").isMobilePhone().withMessage("Not valid phone number"),
    check("country")
      .isString()
      .withMessage("country should be string type")
      .isLength({ min: 2, max: 25 })
      .withMessage("country length should between 2 to 25")
      .trim()
      .escape(),
  ];
exports.validateAgent = validateAgent;
exports.validateAgentPatch = validateAgentPatch;
