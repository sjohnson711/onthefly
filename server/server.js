import express from "express";
import cors from "cors";
import tripRoutes from "./routes/trips.js";
import activityRoutes from "./routes/activities.js";
import destinationRoutes from "./routes/destinations.js";
import tripsDestinationsRoutes from "./routes/trips_destinations.js";
import passport from 'passport'
import session from 'express-session'
import { Github } from './config/auth.js'
import authRoutes from './routes/auth.js'
import userTripRoutes from './routes/users-trips.js'

const app = express();

app.use(session({
  secret: 'codepath',
  resave: false,
  saveUninitialized: true
}))
//parsing json
app.use(express.json());

//cross-origin request on allows the host 5173 to make request such as get, post, put, delete and patch. The credentials must be included to block any random requests from unknown users. 
app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET, POST, PUT, DELETE, PATCH',
  credentials: true
}));


//sets up passport and adds its auth helpers to each request so login strategies (like GitHub) can run
app.use(passport.initialize())
//lets passport read the logged-in user from the express-session cookie on every request, so users stay signed in across requests
app.use(passport.session())
passport.use(Github)
passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((user, done) => {
  done(null, user)
})

app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      '<h1 style="text-align: center; margin-top: 50px;">✈️ On the Fly API</h1>',
    );
});

app.use("/api/trips", tripRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/trips_destinations", tripsDestinationsRoutes);
app.use('/users-trips', userTripRoutes);
app.use('/auth', authRoutes);

//PORT
const PORT = process.env.PORT || 3001;

app.listen(PORT, () =>
  console.log(`Server Running on http://localhost:${PORT}`),
);
