CREATE TABLE workers (
  id SERIAL PRIMARY KEY,
  fname VARCHAR(50) NOT NULL,
  lname VARCHAR(50) NOT NULL,
  dept VARCHAR(100),
  pos VARCHAR(100),
  hire DATE
);

CREATE TABLE leaves (
  id SERIAL PRIMARY KEY,
  wid INTEGER REFERENCES workers(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- 'short' or 'long'
  "from" DATE NOT NULL,
  "to" DATE NOT NULL,
  days INTEGER NOT NULL,
  note TEXT
);

CREATE TABLE guards (
  id SERIAL PRIMARY KEY,
  wid INTEGER REFERENCES workers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'ليلية', 'نهارية', 'مناوبة'
  note TEXT
);
