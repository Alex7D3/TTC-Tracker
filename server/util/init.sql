DROP INDEX IF EXISTS calendar_dates_date, shape_id_idx, stop_times_idx, arr_time_idx, dep_time_idx, route_trgm_idx, route_ts_idx, stop_trgm_idx, stop_ts_idx;
DROP MATERIALIZED VIEW IF EXISTS route_query, stop_query;
DROP TABLE IF EXISTS agency, calendar, calendar_dates, routes, route_types, shapes, stop_times, stops, trips, users, user_to_routes, shape_geometries, trip_stops, synonyms;
DROP TEXT SEARCH CONFIGURATION IF EXISTS streetname;
DROP TEXT SEARCH DICTIONARY IF EXISTS streetname_dict;

CREATE TABLE agency (
    agency_id text primary key,
    agency_name varchar(10) NOT NULL,
    agency_url varchar(50) NOT NULL
);

CREATE TABLE calendar (
    service_id text primary key,
    monday boolean NOT NULL,
    tuesday boolean NOT NULL,
    wednesday boolean NOT NULL,
    thursday boolean NOT NULL,
    friday boolean NOT NULL,
    saturday boolean NOT NULL,
    sunday boolean NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL
);

CREATE TABLE calendar_dates (
    service_id text references calendar(service_id),
    date date NOT NULL
);
CREATE INDEX calendar_dates_date ON calendar_dates(date);

CREATE TABLE route_types (
    route_type integer primary key,
    description text
);

CREATE TABLE routes (
    route_id text primary key,
    agency_id text references agency(agency_id),
    route_short_name text,
    route_long_name text,
    route_type integer references route_types(route_type),
    route_color varchar(6),
    route_text_color varchar(6)
);

CREATE TABLE shapes (
    shape_id text NOT NULL,
    shape_pt_lat double precision NOT NULL,
    shape_pt_lon double precision NOT NULL,
    shape_pt_sequence integer NOT NULL,
    shape_pt_dist_traveled double precision
);
CREATE INDEX shape_id_idx ON shapes(shape_id);

CREATE TABLE shape_geometries (
    shape_id text primary key,
    geom geometry('LINESTRING', 4326)
);

CREATE TABLE stop_times (
    trip_id text NOT NULL,
    arrival_time interval NOT NULL,
    departure_time interval NOT NULL,
    stop_id text,
    stop_sequence integer NOT NULL,
    shape_dist_traveled double precision,
    CONSTRAINT stop_times_pk PRIMARY KEY (trip_id, stop_sequence) 
);
CREATE INDEX stop_times_idx ON stop_times (trip_id, stop_id);
CREATE INDEX arr_time_idx ON stop_times (arrival_time);
CREATE INDEX dep_time_idx ON stop_times (departure_time);

CREATE TABLE stops (
    stop_id text primary key,
    stop_code text NOT NULL,
    stop_name text NOT NULL,
    stop_lat double precision,
    stop_lon double precision,
    stop_loc geometry('POINT', 4326)
);

CREATE TABLE trips (
    trip_id text primary key,
    route_id text references routes(route_id),
    service_id integer NOT NULL, 
    trip_headsign text NOT NULL,
    trip_short_name varchar(1),
    direction_id integer NOT NULL,
    block_id text NOT NULL,
    shape_id text
);

CREATE TABLE trip_stops (
    trip_id text,
    stop_sequence integer,
    stop_count integer,
    route_id text,
    service_id text,
    shape_id text,
    stop_id text,
    arrival_time interval
);

CREATE TABLE users (    
    user_id serial primary key,
    email varchar(254) UNIQUE NOT NULL,
    username varchar(40) UNIQUE NOT NULL,
    password_hash varchar(100) NOT NULL
);

CREATE TABLE user_to_routes (
    user_id serial,
    route_name varchar(20),
    route_id text references routes(route_id),
    stop_id text references stops(stop_id),
    foreign key(user_id) references users(user_id) ON DELETE CASCADE,
    primary key(user_id, route_name)
);

\cd :datadir;

INSERT INTO route_types(route_type, description) VALUES
(0, 'Streetcar'),
(1, 'Subway'),
(2, 'Rail'),
(3, 'Bus');


\COPY agency(agency_id, agency_name, agency_url) FROM PROGRAM 'cut -f1-3 -d"," agency.txt' WITH (FORMAT CSV, HEADER);

\COPY calendar(service_id, monday, tuesday, wednesday, thursday, friday, saturday, sunday, start_date, end_date) FROM 'calendar.txt' DELIMITER ',' CSV HEADER;

\COPY calendar_dates(service_id, date) FROM PROGRAM 'cut -f1,2 -d"," calendar_dates.txt' WITH (FORMAT CSV, HEADER); 

\COPY routes(route_id, agency_id, route_short_name, route_long_name, route_type, route_color, route_text_color) FROM PROGRAM 'cut -f1-4,6,8,9 -d"," routes.txt' WITH (FORMAT CSV, HEADER);

\COPY shapes(shape_id, shape_pt_lat, shape_pt_lon, shape_pt_sequence, shape_pt_dist_traveled) FROM 'shapes.txt' DELIMITER ',' CSV HEADER;

\COPY stop_times(trip_id, arrival_time, departure_time, stop_id, stop_sequence, shape_dist_traveled) FROM  PROGRAM 'cut -f1-5,9 -d"," stop_times.txt' WITH (FORMAT CSV, HEADER);

\COPY stops(stop_id, stop_code, stop_name, stop_lat, stop_lon) FROM  PROGRAM 'cut -f1-3,5,6 -d"," stops.txt' WITH (FORMAT CSV, HEADER);

\COPY trips(route_id, service_id, trip_id, trip_headsign, trip_short_name, direction_id, block_id, shape_id) FROM PROGRAM 'cut -f1-8 -d"," trips.txt' WITH (FORMAT CSV, HEADER);

INSERT INTO shape_geometries
SELECT shape_id, ST_MakeLine(array_agg(
    ST_SetSRID(ST_MakePoint(shape_pt_lon, shape_pt_lat), 4326)
    ORDER BY shape_pt_sequence
))
FROM shapes
GROUP BY shape_id;

INSERT INTO trip_stops (trip_id, stop_sequence, stop_count, route_id, service_id, shape_id, stop_id, arrival_time)
SELECT t1.trip_id, stop_sequence, count(*) OVER(PARTITION BY t1.trip_id), 
    route_id, service_id, shape_id, stop_id, arrival_time
FROM trips AS t1 JOIN stop_times AS t2
ON t1.trip_id = t2.trip_id;

CREATE TABLE synonyms (
    word text PRIMARY KEY,
    synonym text
);

INSERT INTO synonyms (word, synonym) VALUES
('saint', 'st'),
('street', 'st'),
('road', 'rd'),
('avenue', 'ave'),
('boulevard', 'blvd'),
('drive', 'dr');

-- CREATE OR REPLACE FUNCTION synonym_replace(word text) RETURNS text AS $$
-- DECLARE
--     synonym text;
-- BEGIN
--     SELECT s.synonym INTO synonym
--     FROM synonyms s
--     WHERE s.word = word;

--     RETURN coalesce(synonym, word);
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TEXT SEARCH CONFIGURATION streetname (COPY = english);

-- CREATE TEXT SEARCH TEMPLATE synonym_replace_temp (
--     LEXIZE = synonym_replace
-- );

-- CREATE TEXT SEARCH DICTIONARY streetname_dict (
--     TEMPLATE = synonym_replace_temp
-- );

-- ALTER TEXT SEARCH CONFIGURATION streetname
-- ALTER MAPPING FOR asciiword, asciihword, hword_asciipart
-- WITH streetname_dict, english_stem;

CREATE MATERIALIZED VIEW route_query AS
    SELECT route_id, route_short_name, route_long_name, route_color, route_text_color, 
        setweight(to_tsvector('english', route_short_name), 'A') || setweight(to_tsvector('english', regexp_replace(route_long_name, '[._\\/-]', ' ', 'g')), 'B') AS route_name_vector
    FROM routes
    WHERE route_type = 0 OR route_type = 3;
CREATE INDEX route_trgm_idx ON route_query USING GIN (route_long_name gin_trgm_ops);
CREATE INDEX route_ts_idx ON route_query USING GIN (route_name_vector);

CREATE MATERIALIZED VIEW stop_query AS 
SELECT t1.route_id, t3.stop_id, t3.stop_name, to_tsvector('english', t3.stop_name) AS stop_name_vector
FROM trips AS t1 JOIN stop_times AS t2 ON t1.trip_id = t2.trip_id
JOIN stops AS t3 ON t2.stop_id = t3.stop_id 
JOIN (SELECT route_id, route_type FROM routes) AS t4 ON t1.route_id = t4.route_id AND route_type = 0 OR route_type = 3
GROUP BY t1.route_id, t3.stop_id, t3.stop_name;
CREATE INDEX stop_trgm_idx ON stop_query USING GIN (stop_name gin_trgm_ops);
CREATE INDEX stop_ts_idx ON stop_query USING GIN (route_name_vector);