// PM2 Ecosystem configuration for Smart Village API
// Ensures the backend always starts with NODE_ENV=production
// and correct working directory.
//
// Usage:
//   pm2 start ecosystem.config.cjs          (first time)
//   pm2 restart ecosystem.config.cjs        (after code changes)
//   pm2 save                                 (persist across reboots)

module.exports = {
  apps: [
    {
      name: "smart-village-api",
      script: "src/server.js",

      // Working directory — PM2 resolves relative paths from here.
      cwd: "./",

      // Always run as production regardless of the .env NODE_ENV value.
      env_production: {
        NODE_ENV: "production",
      },

      // Start in production mode by default.
      node_args: [],
      interpreter_args: [],
      env: {
        NODE_ENV: "production",
      },

      // Restart policy
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 2000,
      min_uptime: "5s",

      // Logging
      out_file: "../logs/pm2-out.log",
      error_file: "../logs/pm2-error.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
