module.exports = {
  apps: [
    {
      name: 'banknbook-frontend',
      script: 'server.js',
      exec_mode: 'cluster',
      instances: 'max',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
      // Performance optimizations
      node_args: '--max-old-space-size=2048',
      // Graceful shutdown
      kill_timeout: 5000,
      // Restart delay
      restart_delay: 1000,
      // Error handling
      max_restarts: 10,
      min_uptime: '10s',
    },
  ],
};
