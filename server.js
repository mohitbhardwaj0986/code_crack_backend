import app from "./app.js";
import DBconnection from "./src/db/db.js";

DBconnection()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`✅ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Mongo db connection fialed", err);
  });


  


