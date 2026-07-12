CREATE TABLE work_schedules (
  id uuid default gen_random_uuid() primary key,
  target_date date not null,
  cell_name varchar(50) not null,
  employee_name varchar(100) not null,
  status_type varchar(50) not null,
  start_time varchar(20),
  end_time varchar(20),
  memo text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
ALTER TABLE work_schedules ENABLE ROW LEVEL SECURITY;

-- Allow all operations since there is no authentication
CREATE POLICY "Allow all operations" ON work_schedules FOR ALL USING (true);
