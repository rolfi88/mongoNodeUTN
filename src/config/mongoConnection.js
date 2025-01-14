const { default: mongoose } = require("mongoose");
const mongose = require ("mongoose");

const connectDB =  async (URI_DB) => {
    try {
        await mongoose.connect(URI_DB);
        console.log("Conexión a mongodb exitosa");
        } catch (error) {
            console.log("Conexión a mongodb rechazada");
            console.log(error);     
    }

    
}

module.exports=connectDB;