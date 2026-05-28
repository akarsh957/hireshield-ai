import { Pool } from 'pg'
import dotenv from 'dotenv'
dotenv.config()

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/hireshield',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, idleTimeoutMillis: 30000, connectionTimeoutMillis: 2000
})

pool.on('error', (err) => console.error('PostgreSQL pool error:', err))

export const query = (text: string, params?: any[]) => pool.query(text, params)

export const createTables = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255),
      oauth_provider VARCHAR(50),
      oauth_id VARCHAR(255),
      role VARCHAR(20) DEFAULT 'user',
      is_verified BOOLEAN DEFAULT false,
      plan VARCHAR(20) DEFAULT 'free',
      scan_count INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS scam_scans (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      scan_type VARCHAR(20) NOT NULL,
      input_text TEXT NOT NULL,
      verdict VARCHAR(20) NOT NULL,
      confidence_score DECIMAL(5,2),
      flags JSONB DEFAULT '[]',
      ai_explanation TEXT,
      company_name VARCHAR(255),
      processing_time_ms INTEGER,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS reports (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      company_name VARCHAR(255) NOT NULL,
      company_website VARCHAR(500),
      scam_type VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      upvotes INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS company_scores (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      company_name VARCHAR(255) NOT NULL,
      domain VARCHAR(500),
      trust_score DECIMAL(5,2),
      domain_age_days INTEGER,
      report_count INTEGER DEFAULT 0,
      flags JSONB DEFAULT '[]',
      verdict VARCHAR(20),
      ai_summary TEXT,
      last_analyzed TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS chat_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      session_id UUID NOT NULL,
      role VARCHAR(10) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS admin_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      admin_id UUID REFERENCES users(id),
      action VARCHAR(100) NOT NULL,
      target_type VARCHAR(50),
      target_id UUID,
      details JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_scans_user_id ON scam_scans(user_id);
    CREATE INDEX IF NOT EXISTS idx_scans_verdict ON scam_scans(verdict);
    CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
    CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_history(session_id);
  `
  try {
    await pool.query(sql)
    console.log('✅ Database tables ready')
  } catch (err: any) {
    if (err.code === 'ECONNREFUSED' || err.message?.includes('ECONNREFUSED')) {
      console.warn('\n⚠️  PostgreSQL is not running locally. HireShield API is now running in DEMO MODE.')
      console.warn('💡 To enable the database, start PostgreSQL and configure DATABASE_URL in .env\n')
    } else {
      console.error('❌ Database setup error:', err)
      console.log('💡 Make sure PostgreSQL is running and DATABASE_URL is correct in .env')
    }
  }
}

export const db = { query }
