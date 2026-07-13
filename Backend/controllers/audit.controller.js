import { GetAudits } from "../modules/audit.modules.js";

export const GetAllAudits = async (req, res, next) => {

    try {

        const audits = await GetAudits();

        req.message = {
            type: "Successfully",
            message: audits,
            status: 200
        };

        return next();

    } catch (err) {

        console.error(err);

        req.message = {
            type: "Error",
            message: err.message,
            status: 500
        };

        return next();

    }

};