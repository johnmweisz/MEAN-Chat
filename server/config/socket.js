let express = require('express');
let app = express();

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

var mongoose = require('mongoose');
var Room = mongoose.model('Room');

io.on('connection', socket => {
    let previousId = 10101010101;
    let firstName = '';

    const safeJoin = currentId => {
        //leave previous room
        socket.leave(previousId, () => {
            console.log(`Socket ${socket.id} left room ${previousId}`)
            //join new room
            socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
            //sets previous room to current
            previousId = currentId;
        });
    }

    socket.on('addRoom', newRoom => {
        firstName = newRoom.admins[0].first_name;
        // create new room in db
        let new_Room = new Room(newRoom);
        new_Room.save()
        .then( newRoom => {
            //user joins new room
            safeJoin(newRoom._id);
            //send new room (data) to user
            socket.emit('ChatRoom', newRoom);
            // return list of rooms from db
            Room.find({})
            .then(updated_list => {
                //send update to all users
                io.emit('ChatRooms', updated_list);
            })
            .catch(err => {
                console.log(err);
            });
        })
        .catch(err => {
            console.log(err);
        });
    });

    socket.on('removeRoom', roomId => {
        //delete room from db
        Room.deleteOne({_id: roomId})
        .then( () => {
                //send all joined users a 'deleted' room
                let doomed_room = {
                    _id: 'deleted',
                    name: 'Please select a room',
                    admins: [{}],
                    messages: [{user: {first_name: 'server'}, message: `room has been deleted, please choose a new one`}]
                }
                io.to(roomId).emit('ChatRoom', doomed_room);
                //leave room (after room is cleared and sent to user so user sees its deleted)
                socket.leave(roomId)
                //send updated list to all users
                Room.find({})
                .then(updated_list => {
                    io.emit('ChatRooms', updated_list);
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch( err => 
            console.log(err)
        );
    });

    socket.on('joinRoom', data => {
        const savePrevious = previousId;
        firstName = data.firstName;
        // Join new room
        safeJoin(data.roomId);
        // Announce user has joined and send room data.
        Room.findOneAndUpdate(
            {_id: data.roomId},
            {$push:
                {messages: {user: {first_name: 'server'}, message: `${firstName} has joined`}}
            },
            {new:true})
        .then(updatedRoom => {
                io.to(data.roomId).emit('ChatRoom', updatedRoom);
            })
        .catch( err => {
            console.log(err);
        });
        // Leave previous room
        if ( savePrevious != '10101010101' && savePrevious != data.roomId) {
            Room.findOneAndUpdate(
                {_id: savePrevious},
                {$push:
                    {messages: {user: {first_name: 'server'}, message: `${firstName} has left`}}
                },
                {new:true})
            .then(updatedRoom => {
                    io.to(savePrevious).emit('ChatRoom', updatedRoom);
                })
            .catch( err => {
                console.log(err);
            });
        }
    });

    socket.on('leaveRoom', data => {
        const savePrevious = previousId;
        // Disconnect
        safeJoin(10101010101);
        // Leave previous room
        Room.findOneAndUpdate(
            {_id: savePrevious},
            {$push:
                {messages: {user: {first_name: 'server'}, message: `${firstName} has left`}}
            },
            {new:true})
        .then(updatedRoom => {
                io.to(savePrevious).emit('ChatRoom', updatedRoom);
            })
        .catch( err => {
            console.log(err);
        });
        //send user a 'deleted' room
        let disconnectedRoom = {
            _id: 'deleted',
            name: 'Please select a room',
            admins: [{}],
            messages: [{user: {first_name: 'server'}, message: `you have disconnected.`}]
        }
        io.emit('ChatRoom', disconnectedRoom);
    });

    socket.on('updateRoom', data => {// recived as an object roomId, message
        //push new message object into room object and emit updated room object to all users connected
        Room.findOneAndUpdate(
            {_id: data.roomId},
            {$push:
                {messages: data.message}
            },
            {new:true})
        .then(updatedRoom => {
                io.to(data.roomId).emit('ChatRoom', updatedRoom);
            })
        .catch(err => {
            console.log(err);
        });
    });

    socket.on('addAdmin', data => {// recived as an object roomId, admin (user object)
        //push new user object into room object and emit updated room object to all users connected
        Room.findOneAndUpdate(
            {_id: data.roomId},
            {$push:
                {admins: data.admin}
            },
            {new:true})
        .then(updatedRoom => {
                io.to(data.roomId).emit('ChatRoom', updatedRoom);
            })
        .catch(err => {
            console.log(err);
        });
    });

    socket.on('removeAdmin', data => {// recived as an object roomId, adminId
        //removes user object from room object and emit updated room object to all users connected
        Room.findOneAndUpdate(
            {_id: data.roomId},
            {$pull:
                {admins: {_id: data.adminId}}
            },
            {new:true})
        .then(updatedRoom => {
                io.to(data.roomId).emit('ChatRoom', updatedRoom);
            })
        .catch(err => {
            console.log(err);
        });
    });

    socket.on('clearRoom', roomId => {
        //overwrites room messages with a single delete notification
        Room.findOneAndUpdate(
            {_id: data.roomId},
            {$set:
                {messages: [{user: {first_name: 'server'}, message: `chat room has been cleared by admin`}]}
            },
            {new:true})
            .then(updatedRoom => {
                io.to(roomId).emit('ChatRoom', updatedRoom);
            })
            .catch( err => {
                console.log(err);
            });
    });

    socket.on('disconnect', () => {
        //destroys users chat room
        socket.emit('ChatRoom', {});
        //destroys users list of rooms
        socket.emit('ChatRooms', {});
        //user leaves room
        socket.leave(previousId, () => {
            console.log(`Socket ${socket.id} left room ${previousId}`)
            console.log(`Socket ${socket.id} has disconnected`);
            // Announce user left
            if ( previousId != '10101010101') {
                Room.findOneAndUpdate(
                    {_id: previousId},
                    {$push:
                        {messages: {user: {first_name: 'server'}, message: `${firstName} has left`}}
                    },
                    {new:true})
                .then(updatedRoom => {
                        io.to(previousId).emit('ChatRoom', updatedRoom);
                    })
                .catch( err => {
                    console.log(err);
                });
            }
        });
    });

    socket.on('getRooms', () => {
        //return list of all available chat rooms and emit to user
        Room.find({})
        .then( results => {socket.emit('ChatRooms', results)})
        .catch( err => {console.log(err)});
    });

    console.log(`Socket ${socket.id} has connected`);
});

const port = '3000';
server.listen(port, () => {console.log(`Socket listening on port ${port}`)});