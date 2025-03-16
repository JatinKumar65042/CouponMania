import { app } from "./app.js";
import connecttoDB from "./src/config/db.js";

connecttoDB()
.then(() => {
    app.on("error" , (error) => {
        console.log("Error : ", error) ;
        throw error ;
    })
    app.listen(process.env.PORT || 5000 , () => {
        console.log(`⚙️   Server is running on http://localhost:${process.env.PORT}/api/v1/`) ;
    })
})
.catch( (err) => {
    console.log("MONGODB Connection failed!!! ", err)
} )

