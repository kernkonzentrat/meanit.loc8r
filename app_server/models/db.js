var mongoose = require( 'mongoose' ),
    readline = require( 'readline' ),
    dbURI = 'mongodb://127.0.0.1/Loc8r',
    mdb_connection = null;

if ( process.env.NODE_ENV === 'production' ) {
    dbURI = process.env.MONGOLAB_URI;
}

mdb_connection = mongoose.createConnection( dbURI )

if ( process.platform === 'win32' ) {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on( 'SIGINT', function () {
        process.emit( 'SIGINT' );
    });
}

mdb_connection.on( 'connected', function () {
    console.log( 'Mongoose connected to ' + dbURI );
});

mdb_connection.on( 'error', function ( err ) {
    console.log( 'Mongoose connection error ' + err );
});

mdb_connection.on( 'disconnected', function () {
    console.log( 'Mongoose disconnected' );
});

var gracefulShutDown = function ( msg, callback ) {
    mdb_connection.close( function () {
        console.log( 'Mongoose disconnected through ' + msg );
        callback();
    });
};

// For nodemon restarts
process.once( 'SIGUSR2', function () {
    gracefulShutDown( 'nodemon restart', function () {
        process.kill( process.pid, 'SIGUSR2' );
    })
});

// For app termination
process.once( 'SIGINT', function () {
    gracefulShutDown( 'app termination', function () {
        process.exit(0);
    })
});

// For HEROKU app termination
process.once( 'SIGTERM', function () {
    gracefulShutDown( 'Heroku app shutdown', function () {
        process.exit(0);
    })
});

// Collate models
require( './locations' );