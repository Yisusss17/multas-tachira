import {
    GetTicketDetailsByTicketId,
    GetTicketDetailById,
    AddTicketDetail,
    RemoveTicketDetail,
    RemoveAllTicketDetails,
    GetTotalUtByTicket
} from "../modules/ticketDetails.modules.js";

import {
    GetTicketById,
    UpdateTicketTotalUt
} from "../modules/tickets.modules.js";

import {
    GetInfractionById
} from "../modules/infractions.modules.js";

import {
    TicketDetailValidation
} from "../validates/ticketDetail.validation.js";


// ======================================
// Obtener detalles de una multa
// ======================================

export const GetTicketDetails = async (req, res, next) => {

    try{

        const { ticketId } = req.params;

        const ticket = await GetTicketById(ticketId);

        if(!ticket){

            req.message={
                type:"Not Found",
                message:"Multa no encontrada",
                status:404
            };

            return next();

        }

        const details=await GetTicketDetailsByTicketId(ticketId);

        req.message={
            type:"Successfully",
            message:details,
            status:200
        };

        return next();

    }catch(err){

        console.error(err);

        req.message={
            type:"Error",
            message:err.message,
            status:500
        };

        return next();

    }

};


// ======================================
// Agregar detalle
// ======================================

export const AddDetailToTicket = async(req,res,next)=>{

    try{

        const { error,value }=TicketDetailValidation.validate(req.body);

        if(error){

            req.message={
                type:"Validation",
                message:error.details,
                status:400
            };

            return next();

        }

        const ticket=await GetTicketById(value.id_ticket);

        if(!ticket){

            req.message={
                type:"Not Found",
                message:"Multa no encontrada",
                status:404
            };

            return next();

        }

        const infraction=await GetInfractionById(value.infraction_id);

        if(!infraction){

            req.message={
                type:"Not Found",
                message:"Infracción no encontrada",
                status:404
            };

            return next();

        }

        if(ticket.status==="Paid"){

            req.message={
                type:"Validation",
                message:"No se puede modificar una multa pagada.",
                status:400
            };

            return next();

        }

        const newDetail=await AddTicketDetail(value);

        // Calcular total automáticamente desde PostgreSQL
        const totalUt=await GetTotalUtByTicket(value.id_ticket);

        await UpdateTicketTotalUt(value.id_ticket,totalUt);

        req.message={
            type:"Successfully",
            message:newDetail,
            status:201
        };

        return next();

    }catch(err){

        console.error(err);

        req.message={
            type:"Error",
            message:err.message,
            status:500
        };

        return next();

    }

};


// ======================================
// Eliminar detalle
// ======================================

export const RemoveDetailFromTicket = async(req,res,next)=>{

    try{

        const { id_detail }=req.params;

        const detail=await GetTicketDetailById(id_detail);

        if(!detail){

            req.message={
                type:"Not Found",
                message:"Detalle no encontrado",
                status:404
            };

            return next();

        }

        const ticketId=detail.id_ticket;

        await RemoveTicketDetail(id_detail);

        // Recalcular total
        const totalUt=await GetTotalUtByTicket(ticketId);

        await UpdateTicketTotalUt(ticketId,totalUt);

        req.message={
            type:"Successfully",
            message:"Detalle eliminado correctamente",
            status:200
        };

        return next();

    }catch(err){

        console.error(err);

        req.message={
            type:"Error",
            message:err.message,
            status:500
        };

        return next();

    }

};