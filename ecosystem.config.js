module.exports = {
  apps: [
    {
      name: 'banknbook-frontend',
      script: 'npm',
      args: 'start',
      exec_mode: 'cluster',
      instances: 'max',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
