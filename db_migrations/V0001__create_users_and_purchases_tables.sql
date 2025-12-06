CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  steam_id VARCHAR(255) UNIQUE,
  discord_id VARCHAR(255) UNIQUE,
  username VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchases (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  product_id INTEGER NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
  discord_id VARCHAR(255) PRIMARY KEY,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_steam ON users(steam_id);
CREATE INDEX IF NOT EXISTS idx_users_discord ON users(discord_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(status);