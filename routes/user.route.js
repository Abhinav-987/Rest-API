const express = require('express')
const createError = require('http-errors')
const mongoose = require('mongoose')
const moment = require('moment-timezone');
const router = express.Router()

const User = require("../models/users.models")


router.get('/', async (req, res, next) => {
    try{
        const results = await User.find()
        res.send(results)
    }catch(error){
        console.log(error.message)
    }
})

router.post('/data', async (req, res, next) => {
    const { user_id } = req.body;
    try {
        const user = await User.findOne({ user_id: user_id });
        if (!user) {
            throw createError(404, 'User not found');
        }
        res.json({ name: user.name });
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const user = new User(req.body)
        const result = await user.save()
        console.log(user);
        console.log(result);
        res.send(result)
    }catch(error){
        console.log(error.message)
    }
})

//main logic
router.post('/func', async (req, res, next) => {
    const { sender_id, receiver_id } = req.body;
    console.log(req.body)
    try {
        if (!sender_id || !receiver_id) {
            return res.status(400).json({ error: 'Both sender_id and receiver_id are required' });
        }
        const sender = await User.findOne({ user_id: sender_id });
        const receiver = await User.findOne({ user_id: receiver_id });
        if (!sender || !receiver) {
            return res.status(404).json({ error: 'Sender or receiver user not found' });
        }
        // sender.connection = sender.connection || [];
        // receiver.connection = receiver.connection || [];
        // const currentDate = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
        // sender.connection.push({ user_id: receiver_id, connected_at: currentDate });
        // receiver.connection.push({ user_id: sender_id, connected_at: currentDate });
        const currentDate = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
        const updateorinsertConnection = (user, connectedUserId) => {
            let connectionExists = false;
            for (let connection of user.connection) {
                if (connection.user_id === connectedUserId) {
                    connection.connected_at = currentDate;
                    connectionExists = true;
                    break;
                }
            }
            if (!connectionExists) {
                user.connection.push({ user_id: connectedUserId, connected_at: currentDate });
            }
        };
        updateorinsertConnection(sender, receiver_id);
        updateorinsertConnection(receiver, sender_id);
        await sender.save();
        await receiver.save();
        res.status(200).json({ message: 'Connection populated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/empty-connection/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.connection = [];
        await user.save();
        res.status(200).json({ message: 'Connection array emptied successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/user-connections', async (req, res, next) => {
    const { user_id } = req.body;
    if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
    }
    try {
        const user = await User.findOne({ user_id: user_id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user.connection);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    // res.send('Getting a single product')
    const id = req.params.id
    try {
        const result = await User.findById(id)
        if(!result){
            throw createError(404, 'User Does Not exist')
        }
        res.send(result)    
    }catch(error){
        console.log(error.message)
        if(error instanceof mongoose.CastError){
            next(createError(400, "Invalid User id"))
            return
        }
        next(error)
    }

    // console.log(id)
    // res.send(id)
})

router.patch('/:id', async (req, res, next) => {
    // res.send('Updating a single product')
    const id = req.params.id
    try {
        const updates = req.body
        const result = await User.findByIdAndUpdate(id, updates)
        res.send(result)
    } catch(error) {
        console.log(error.message)
    }
    // console.log(id)
    // res.send(id)
})



router.delete('/:id', async (req, res, next) => {
    // res.send('Deleting a single product')
    const id = req.params.id
    try {
        const result = await User.findByIdAndDelete(id)
        res.send(result)
    } catch(error) {
        console.log(error.message)
    }
    // console.log(id)
    // res.send(id)
})

module.exports = router