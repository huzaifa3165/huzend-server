import { google } from "googleapis";
import readline from "readline";

// create an oAuth client
const oAuth2Client = new google.auth.OAuth2(
  "21634077999-amfgn148ebi2qo0p7eis0ufoudv02bm8.apps.googleusercontent.com",
  "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",
  "http://localhost:5050"
);

// generate a url to get the authorization code
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/youtube"],
});

console.log("Authorize this app by visiting this url:", authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// use the authorization code to get the access and refresh token
export const getChannelWatchTime = (channelName) => {
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // create a youtube object
      const youtube = google.youtube({
        version: "v3",
        auth: oAuth2Client,
      });

      // request to youtube API
      youtube.channels.list(
        {
          part: "statistics",
          forUsername: channelName,
        },
        (err, res) => {
          if (err) return console.error(err);
          if (!res.data.items || !res.data.items[0])
            return console.log("channel not found");
          const watchTime = res.data.items[0].statistics.watchTime;
          console.log(watchTime);
        }
      );
    });
  });
};
