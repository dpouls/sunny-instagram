//npm i axios express massive express-session react-router-dom gradient-string bcryptjs redux
require('dotenv').config()
const express = require('express'),
      massive = require('massive'),
      {SERVER_PORT, CONNECTION_STRING,SESSION_SECRET} = process.env,
      session = require('express-session'),
      pc = require('./controllers/postController'),
      ac = require('./controllers/authController'),
      cc = require('./controllers/commentController'),
      lc = require('./controllers/likeController'),
      uc = require('./controllers/userController'),
      fc = require('./controllers/followerController'),
      gradient = require('gradient-string'),
      app = express();

app.use(express.json())

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {maxAge: 1000 * 60 * 60 * 24}
}))



massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    console.log(gradient.instagram('db connected'))
})

//AUTH ENDPOINTS
app.post('/auth/login', ac.login)
app.post('/auth/register', ac.register);
app.post('/auth/logout', ac.logout);
app.get('/auth/currentuser', ac.currentUser)


//USER INFO ENDPOINTS

app.put('/api/editprofile', uc.editProfilePic)
app.post('/api/follow', fc.follow)
app.get('/api/getfollowers', fc.getFollowers)
app.get('/api/getfollowing', fc.getFollowing)
//POST ENDPOINTS

app.get('/api/posts',pc.getAllPosts)
app.get('/api/myposts/', pc.getMyPosts)
app.post('/api/add',pc.addPost)
app.delete('/api/delete/:post_id', pc.deletePost)
app.put('/api/editpost/:post_id', pc.editPost)

//LIKE ENDPOINTS
app.post('/api/like/:post_id',lc.addLike)
app.get('/api/likecount/:post_id', lc.getLikes)
app.get('/api/likers/:post_id',lc.getLikers)
app.delete('/api/unlike/:post_id', lc.unlike)

//COMMENT ENDPOINTS
app.get('/api/comments/:post_id',cc.getAllComments)
app.post('/api/addcomment/:post_id', cc.addComment)
app.delete('/api/deletecomment/:comment_id', cc.deleteComment)
app.put('/api/editcomment/:comment_id', cc.editComment)


const port = SERVER_PORT || 7000;
app.listen(port, () => console.log(gradient.instagram(`blazin on port ${port}`)))