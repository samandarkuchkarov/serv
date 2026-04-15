module.exports = {
  apps: [
    {
      name: 'serv-api',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'serv-api-backup',
      script: 'scripts/backup-scheduler.ts',
      interpreter: 'npx',
      interpreter_args: 'tsx',
      autorestart: true,
      watch: false,
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
