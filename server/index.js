import express from 'express'
const app = express();
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors';
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url';

import Connection from './src/db/db.js';

// routes
import userRoute from './src/routes/users.js'
import authRoute from './src/routes/auth.js'
import postRoute from './src/routes/posts.js'
import conversationRoute from './src/routes/conversations.js'
import messageRoute from './src/routes/messages.js' 
import notificationRoute from './src/routes/notifications.js' 

dotenv.config();

// database connection
Connection()

// middleware
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

// cors
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
    methods: "*"
}
app.use(cors(corsOptions)); 
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});  

// file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
      return res.status(200).json("File uploded successfully");
    } catch (error) {
      console.error(error);
    }
});


// allow access of images folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/images", express.static(path.join(__dirname, "public/images")))

// routes
app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)
app.use("/api/conversations", conversationRoute)
app.use("/api/messages", messageRoute)
app.use("/api/notifications", notificationRoute)
 
const PORT = process.env.port || 5000 

app.get("/home", (req, res) => {
    res.send("<h1>home api</h1>")
})

app.listen(PORT, () => {
    console.log("App is running on the port:", PORT)
})