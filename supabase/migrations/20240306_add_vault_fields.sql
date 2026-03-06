ALTER TABLE vesting_schedules 
ADD COLUMN IF NOT EXISTS tx_hash TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Status can be: 'active', 'completed', 'claimed'
