const { handleValidationErrors } = require('./validation');
const { check } = require('express-validator');


// on spots route
// const validateQuery = (req, res, next) => {
//     const validators = [
//         check('page')
//             .exists({ checkFalsy: true })
//             .isInt({ min: 1 })
//             .withMessage('Page must be greater than or equal to 1'),
//         check('size')
//             .exists({ checkFalsy: true })
//             .isInt({ min: 1, max: 20 })
//             .withMessage('Size must be between 1 and 20'),
//         check('maxLat')
//             .optional()
//             .isFloat({ min: -90, max: 90 })
//             .withMessage('Maximum latitude is invalid'),
//         check('minLat')
//             .optional()
//             .isFloat({ min: -90, max: 90 })
//             .withMessage('Minimum latitude is invalid'),
//         check('minLng')
//             .optional()
//             .isFloat({ min: -180, max: 180 })
//             .withMessage('Minimum longitude is invalid'),
//         check('maxLng')
//             .optional()
//             .isFloat({ min: -180, max: 180 })
//             .withMessage('Maximum longitude is invalid'),
//         check('minPrice')
//             .optional()
//             .isFloat({ min: 0 })
//             .withMessage('Minimum price must be greater than or equal to 0'),
//         check('maxPrice')
//             .optional()
//             .isFloat({ min: 0 })
//             .withMessage('Maximum price must be greater than or equal to 0'),
//         handleValidationErrors
//     ]
//     if (validators) {
//         next(validators)
//     } else { next() };
// };

const validateQuery = (queryList) => {

     let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = queryList


    const err = new Error('Bad Request');
    err.status = 400;
    err.title = 'Bad Request';

    let storedErrors = {}

    page = parseInt(page)
    size = parseInt(size)
    minLat = parseInt(minLat)
    maxLat = parseInt(maxLat)
    minLng = parseInt(minLng)
    maxLng = parseInt(maxLng)
    minPrice = parseInt(minPrice)
    maxPrice = parseInt(maxPrice)

    if ((Number.isNaN(page) || page < 1) && !isNaN(page)) {
        storedErrors.page = "Page must be greater than or equal to 1";
    };

    if ((Number.isNaN(size) || size < 1 || size > 20) && !isNaN(size)) {
        storedErrors.size = "Size must be between 1 and 20";
    };

    if ((Number.isNaN(maxLat) || maxLat < -90 || maxLat > 90) && !isNaN(maxLat)) {
        storedErrors.maxLat = "Maximum latitude is invalid";
    };

    if ((Number.isNaN(minLat) || minLat < -90 || minLat > 90) && !isNaN(minLat)) {
        storedErrors.minLat = "Minimum latitude is invalid";
    };

    if ((Number.isNaN(minLng) || minLng < -180 || minLng > 180) && !isNaN(minLng)) {
        storedErrors.minLng = "Minimum longitude is invalid";
    };

    if ((Number.isNaN(maxLng) || maxLng < -180 || maxLng > 180) && !isNaN(maxLng)) {
        storedErrors.maxLng = "Maximum longitude is invalid";
    };

    if ((Number.isNaN(maxPrice) || maxPrice < 0) && !isNaN(maxPrice)) {
        storedErrors.maxPrice = "Maximum price is invalid";
    };

    if ((Number.isNaN(minPrice) || minPrice < 0) && !isNaN(minPrice)) {
        storedErrors.minPrice = "Minimum price is invalid";
    };

    if (Object.keys(storedErrors).length > 0) {
        err.errors = storedErrors;
        return err
    };
};



module.exports = { validateQuery }