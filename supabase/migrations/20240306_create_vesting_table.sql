CREATE TABLE IF NOT EXISTS vesting_schedules (
    id TEXT PRIMARY KEY,
    recipient TEXT NOT NULL,
    total_amount NUMERIC NOT NULL,
    start_time BIGINT NOT NULL,
    cliff_duration BIGINT NOT NULL,
    vesting_duration BIGINT NOT NULL,
    amount_claimed NUMERIC DEFAULT 0,
    apr NUMERIC NOT NULL,
    reward_amount NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for faster queries by recipient
CREATE INDEX IF NOT EXISTS idx_vesting_schedules_recipient ON vesting_schedules(recipient);
