module.exports = {
    apps: [
        {
            script: 'index.js',
            name: 'auth-prod',
            instances: 2,
            exec_mode: "cluster"
        }
          ]
}
