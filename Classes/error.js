class commanderError extends Error {
    constructor(mensaje){
        super(mensaje)

        this.name = "[HANDLER ERROR]"
    }
}

module.exports = { commanderError }