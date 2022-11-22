module.exports = {
    mongodbMemoryServerOptions: {
        binary: {
            skipMD5: true,
        },
        autoStart: false,
        instance: {},
        replSet: {
            //needed for collection.watch
            count: 3,
            storageEngine: 'wiredTiger',
        },
    },
}
