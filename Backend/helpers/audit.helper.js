import { CreateAudit } from "../modules/audit.modules.js";

export const RegisterAudit = async ({
    id_user,
    module,
    action,
    description,
    reference_id = null
}) => {

    try {

        await CreateAudit({
            id_user,
            module,
            action,
            description,
            reference_id
        });

    } catch (error) {

        console.error("Error registrando auditoría:", error);

    }

};