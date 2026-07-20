import { pool } from "./database.js";
import { Strategy as GitHubStrategy } from 'passport-github2'

const options = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3001/auth/github/callback",
};

//verify callback function for OAuth 2.0 based strategies, like Github2, accepts four arguments:
//this function will verify the user is in our users table. if not, we will add a row with the user's credentials
const verify = async (accessToken, refreshToken, profile, callback) => {
  const { _json: { id, name, login, avatar_url } } = profile;

  const userData = {
    githubId: id,
    username: login,
    avatarUrl: avatar_url,
    accessToken,
  };

  try {
    const results = await pool.query(
      "SELECT * FROM users Where USERNAME = $1",
      [userData.username],
    );
    const user = results.rows[0];
    //If user is not found in our users table well will enter the user
    if (!user) {
      const results = await pool.query(
        "INSERT INTO users(githubId, username, avatarUrl, accessToken)VALUES($1, $2, $3, $4) RETURNING *",
        [userData.githubId, userData.username, userData.avatarUrl, accessToken],
      );
      const newUser = results.rows[0];
      return callback(null, newUser);
    }
    //if the user is found inour users table
    return callback(null, user);
  } catch (error) {
    return callback(error);
  }
};

export const Github = new GitHubStrategy(options, verify)