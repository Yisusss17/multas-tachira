const Messages = (req, res) => {
    const { type, message, status } = req.message

    res.status(status).json({
        status,
        type,
        message
    })
}

export default Messages