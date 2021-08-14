const express = require('express');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;

const router = new express.Router();

const User = require("../models/userSchema");
const Team = require("../models/teamsSchema");
const Poll = require("../models/pollsSchema");

const { requiredAuth, checkUser } = require("../auth/authMiddleware.js")

const oAuth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
)

oAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
})

const calendar = google.calendar({ 
    version: 'v3', 
    auth: oAuth2Client 
})

router.get("/teams/polls/google/:pid/:uid", requiredAuth, checkUser, async (req, res) => {
    const poll = await Poll.findById({ _id: req.params.pid })
    const user = await User.findById({ _id: req.params.uid })
    
    const event = {
        summary: poll.title,
        location: `From Poll Booth App`,
        description: `Deadline for the poll ${poll.title} - ${poll.description}`,
        colorId: 1,
        start: {
          dateTime: poll.deadline,
          timeZone: 'Asia/Kolkata'
        },
        end: {
          dateTime: poll.deadline,
          timeZone: 'Asia/Kolkata'
        },
      }

    try {
        await calendar.events.insert({ auth: oAuth2Client, calendarId: 'primary', resource: event })
        req.flash('message', 'Poll Deadline Event Updated Successfully to your Google Calender')
    } catch (err) {
        req.flash('message', 'Error to connect with your Google Calender (see console log)')
        console.log(err)
    }
    res.redirect('/teams/polls/vote/'+poll._id+'/'+user._id )
});

module.exports = router;