const ExpressError = require('./expressError')
module.exports.validate =  schema =>{
    return (req, res, next) => {
        //checks the data using the schema
        const { error } = schema.validate(req.body)
        if (error) {
            //transform the array of errors into a single string that can be printed
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg, 400)
        }
        else {
            //moves to the next middleware
            next();
        }
    }
}


