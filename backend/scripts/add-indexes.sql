-- Add indexes for performance optimization
-- JobOffer indexes
CREATE INDEX IF NOT EXISTS idx_joboffer_status ON JobOffer(status);
CREATE INDEX IF NOT EXISTS idx_joboffer_department ON JobOffer(department);
CREATE INDEX IF NOT EXISTS idx_joboffer_created_at ON JobOffer(created_at);

-- Candidate indexes
CREATE INDEX IF NOT EXISTS idx_candidate_joboffer ON Candidate(job_offer_id);
CREATE INDEX IF NOT EXISTS idx_candidate_status ON Candidate(status);
CREATE INDEX IF NOT EXISTS idx_candidate_joboffer_status ON Candidate(job_offer_id, status);
