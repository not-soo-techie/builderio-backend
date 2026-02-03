import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import session from "express-session";
import cors from "cors";
import User from "./models/User.js";
import { assignTask, submitProject } from "./controllers/assign.controller.js";

dotenv.config({ override: true, silent: true });

const app = express();
const PORT = process.env.PORT || 3000;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true,
  })
);

app.use(
  session({
    secret: "mysecretkey", // normally from env
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60 * 60 * 1000 }, // secure: true only with https
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // OPTIONAL: domain restriction
        if (
          !email.endsWith("@adypu.edu.in") &&
          !email.endsWith("@newtonschool.co")
        ) {
          return done(null, false);
        }

        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email,
            photo: profile.photos[0].value,
          });
        }

        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
    // (request, accessToken, refreshToken, profile, done) => {
    //   console.log(profile);
    //   done(null, profile);
    // }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user); // now req.user is full object
  } catch (err) {
    done(err, null);
  }
});

function isLoggedIn(req, res, next) {
  req.user ? next() : res.redirect("/");
}

app.get("/", (req, res) => {
  res.send("<a href='/auth/google'>Login with Google</a>");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
    // successRedirect: `${process.env.FRONTEND_URL}/dashboard`,
  }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

app.get("/auth/me", (req, res) => {
  console.log("Req came");
  if (!req.user) {
    return res.status(401).json({ authenticated: false });
  }

  console.log("User", req.user);
  res.json({
    authenticated: true,
    user: {
      name: req.user.name,
      email: req.user.email,
      photo: req.user.photo,
      assignedProjectId: req.user.assignedProjectId,
      hasAssignedProject: req.user.hasAssignedProject,
      assignedAt: req.user.assignedAt,
      hasSubmittedProject: req.user.hasSubmittedProject,
      githubRepoUrl: req.user.githubRepoUrl,
    },
  });
});

app.get("/protected", isLoggedIn, (req, res) => {
  if (req.user) {
    res.send("You are authenticated!");
  } else {
    res.send("You are not authenticated!");
  }
});

app.get("/auth/failure", (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/`);
});

app.get("/auth/logout", (req, res) => {
  req.logout(() => {
    res.redirect(`${process.env.FRONTEND_URL}/`);
  });
});

app.post("/assign-task", isLoggedIn, assignTask);
app.post("/submit-project", isLoggedIn, submitProject);

// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}`);
// });

export default app;
