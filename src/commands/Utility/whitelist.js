const { machineId, machineIdSync } = require("node-machine-id");
machineId().then((id) => {
    // {original: true}
    console.log(id)
})
