const express  = require('express');
const { findById } = require('./users/model');
const Data = require('./users/model')

const server = express(); 
server.use(express.json())

//HELLO WORLD
server.get('/hello', (req, res) => {
    res.json({ message: 'howdy' })
})

//GET ALL USERS
server.get('/api/users', (req, res) => {
    Data.find()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            res.status(500).json({ 
                message: 'The users information could not be retrieved',
                error: err.message,
            })
        })
})

//GET USER BY ID
server.get('/api/users/:id', async (req, res) => {
    try {
        const user = await findById(req.params.id)
        if(!user) {
            res.status(404).json({ 
                message: 'The user with the specified ID does not exist'
            })
        }
        res.json(user)
    } catch (err) {
        res.status(500).json({ 
            message: 'The user information could not be retrieved',
            error: err.message,
        })
    }
})

//POST NEW USER
server.post('/api/users', (req, res) => {
    Data.insert(req.body)
        .then(newUser => {
            if(!req.body.name || !req.body.bio) {
                res.status(400).json({
                    message: 'Please provide name and bio for the user'
                })
            } else {
                res.status(201).json(newUser)
            }
        })
        .catch(err => {
            res.status(500).json({ 
                message: 'There was an error while saving the user to the database',
                error: err.message,
            })
        })
})

//EDIT(PUT) USER BY ID
server.put('/api/users/:id', (req, res) => {
    Data.update(req.params.id, req.body)
        .then(user => {
            if(!user) {
                res.status(404).json({
                    message: 'The user with the specified ID does not exist'
                })
            } else {
                if(!req.body.name || !req.body.bio) {
                    res.status(400).json({
                        message: 'Please provide name and bio for the user'
                    })
                } else {
                    res.status(200).json(user)
                }
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'The user information could not be modified',
                error: err.message
            })
        })
})

//DELETE USER BY ID
server.delete('/api/users/:id', async (req, res) => {
    try{
        const deletedUser = await Data.remove(req.params.id)
        if(!deletedUser) {
            res.status(404).json({
                message: 'The user with the specified ID does not exist'
            })
        } else {
            res.json(deletedUser)
        }
    } catch (err) {
        res.status(500).json({
            message: 'The user could not be removed',
            error: err.message
        })
    }
})

module.exports = server
