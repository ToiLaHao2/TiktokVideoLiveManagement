const express = require("express");
const app = express();
// const fetch = require("node-fetch");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const { default: axios } = require("axios");
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());
app.listen(5000);

const CLIENT_KEY = "sbaw2wrjcijnvs4hjk"; // this value can be found in app's developer portal

app.get("/oauth", (req, res) => {
  const csrfState = Math.random().toString(36).substring(2);
  res.cookie("csrfState", csrfState, { maxAge: 60000 });

  let url = "https://www.tiktok.com/v2/auth/authorize/";

  // the following params need to be in `application/x-www-form-urlencoded` format.
  url += `?client_key=${CLIENT_KEY}`;
  url += "&scope=user.info.basic";
  url += "&response_type=code";
  url += "&redirect_uri=https://lr3t9s-5173.csb.app/";
  url += "&state=" + csrfState;

  res.redirect(url);
});

app.post("/token", async (req, res) => {
  const authorizationCode = req.body.code;
  const clientSecret = "CNQNhyDW6xAI76qxN8fF9HoO0hJun1vb";

  const params = new URLSearchParams();
  params.append("client_key", CLIENT_KEY);
  params.append("client_secret", clientSecret);
  params.append("code", authorizationCode);
  params.append("grant_type", "authorization_code");
  params.append("redirect_uri", "https://lr3t9s-5173.csb.app/");

  try {
    const response = await axios.post(
      "https://open.tiktokapis.com/v2/oauth/token/",
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching access token:", error.data);
    res.json(error.data);
  }
});
