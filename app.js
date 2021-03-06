import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import calendarRouter from "./routers/calendarRouter";
import promiseRouter from "./routers/promiseRouter";
import userRouter from "./routers/userRouter";
import globalRouter from "./routers/globalRouter";
import { localsMiddleware, isLogin, isLogOut } from "./middlewares";
import routes from "./routes";
import session from "express-session";
import passport from "passport";
import passportConfig from "./passport";
import MariaDBStore from "express-session-mariadb-store";
import flash from "express-flash";
import cors from "cors";

const corsOptions = {
	origin: process.env.HOST_URL,
    credentials: true
};

passportConfig();
var sequelize = require('./models').sequelize;
const app = express();
sequelize.sync();
// const MariaDBStore = require('express-session-mariadb-store')

app.use(cors(corsOptions));
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(morgan("dev"));
app.use(
    session({
      secret: process.env.COOKIE_SECRET,
      resave: true,
      saveUninitialized: false,
      store: new MariaDBStore({ 
            user: process.env.MARIA_USER,
            password: process.env.MARIA_PWD,
            database: process.env.MARIA_DB,
	          port: process.env.MARIA_PORT,
	          host: process.env.MARIA_URL
        })
    })
  );
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(localsMiddleware);
// app.use(isLogin);
// app.use(isLogOut);
//app.use(cors(corsOptions));
app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.promises, promiseRouter); 
app.use(routes.calendar, calendarRouter);

export default app;
