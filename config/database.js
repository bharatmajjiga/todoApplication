if(process.env.NODE_ENV === 'production'){
    module.exports = {
        mongoURI : 'mongodb://bharat:bharat15@ds113853.mlab.com:13853/bharatapp-prod'
    }
}
else {
    module.exports = {
        mongoURI : 'mongodb://localhost/BharatApp-dev'
    }
}