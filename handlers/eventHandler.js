const { readdirSync } = require('fs');

module.exports = async (client) => {

    for (const event of readdirSync('../events')) {

        if (!event.split(".").pop() == "js") return;
        let evt = require('../events/'+event);
        if (!evt.name || typeof evt.run !== 'function') return;
        client.on(evt.name, evt.run.bind(evt, client));

    }

}
