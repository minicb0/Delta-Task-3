const express = require("express");
const router = new express.Router();

const mongoose = require('mongoose');
const DB = process.env.DATABASE
require('../db/mongoose');

const User = require("../models/userSchema");
const Team = require("../models/teamsSchema");
const Poll = require("../models/pollsSchema");

const { requiredAuth, checkUser } = require("../auth/authMiddleware.js")

// socket io
const io = require('socket.io')(5000);

const users = {}

io.on('connection', socket => {
    socket.on('new-user-joined', async (name, team) => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', { name: users[socket.id] })
    });

    socket.on('send-chat-message', async (message, team) => {
        // console.log(message)

        // saving to db
        const messageElement = {
            sendby: users[socket.id],
            message: message
        }
        await Team.findOneAndUpdate({ teamname: team }, {$push: { messages: messageElement }})
        
        socket.broadcast.emit('chat-message', { name: users[socket.id], message: message })

    });
})

// chating between teams
router.get('/teams/chat/:tid', requiredAuth, checkUser, async (req, res) => {
    const team = await Team.findById({ _id: req.params.tid })
    res.render('chat', { team, message: req.flash('message') })
})

module.exports = router