-- Seeding

-- Insert Resources
INSERT INTO computing_resources ("uuid", "model", "serial", "manufacturer", "type") VALUES
('bc607e5e-2286-4ce9-95f5-c52098138883', 'Tesla T4', 913423, 'nvidia', 'gpu'),
('452d3098-86ad-471d-8c96-85ae7cf3dbee', 'RTX PRO 6000', 25719, 'nvidia', 'gpu'),
('4e345ce9-cc52-4bb9-8ffd-4ac825adc286', 'RTX 4090', 5234102, 'nvidia', 'gpu'),
('02ab7562-4bee-4163-a894-2e24ad6e626c', 'Ryzen Threadripper Pro 5995WX', 45715, 'amd', 'cpu'),
('87c5ec26-dd51-47a1-bbe4-803fd11f903e', 'Intel Core i9-10980XE', 139784, 'intel', 'cpu');

-- Insert Users
INSERT INTO users ("uuid", "username", "email", "name", "surname", "password", "role") VALUES
('72a84090-8f1a-4067-828b-1c975669eea4', 'mariorossi89', 'mario.rossi@gmail.com', 'Mario', 'Rossi', '$2b$04$uUb0mPN9pdjTG./d/V9zjuNW4BESgZAaZQQoUPrLlWm/Qwt2uxVPO', 'user'),
('5664c112-a2b3-417c-a146-136c1f2c005b', 'giuse77', 'giuseppeverdi@gmail.com', 'Giuseppe', 'Verdi', '$2b$04$uUb0mPN9pdjTG./d/V9zjuNW4BESgZAaZQQoUPrLlWm/Qwt2uxVPO', 'user'),
('b638c97e-5e2b-41ce-8654-74c3e0bb69ac', 'mark_white', 'mark.white@libero.it', 'Marco', 'Bianchi', '$2b$04$uUb0mPN9pdjTG./d/V9zjuNW4BESgZAaZQQoUPrLlWm/Qwt2uxVPO', 'user'),
('b3dc868d-8dff-41f1-b214-db9d7493d4ea', 'luca_bramb_92', 'lucabramb@tiscali.it', 'Luca', 'Brambilla', '$2b$04$uUb0mPN9pdjTG./d/V9zjuNW4BESgZAaZQQoUPrLlWm/Qwt2uxVPO', 'admin'),
('44679278-d7e5-481b-b873-b476287c551f', 'sullyking', 'keat.prescott@tiscali.it', 'Keaton', 'Prescott', '$2b$04$uUb0mPN9pdjTG./d/V9zjuNW4BESgZAaZQQoUPrLlWm/Qwt2uxVPO', 'admin');

-- Insert Calendars
INSERT INTO calendars ("uuid", "resource", "name", "isArchived") VALUES
('1baa324d-c819-4187-92da-41ab7508d13c', 'bc607e5e-2286-4ce9-95f5-c52098138883', 'Calendario Computer Vision - 1', false),
('78819106-363f-482a-8a88-71982fdf671c', '452d3098-86ad-471d-8c96-85ae7cf3dbee', 'Calendario Computer Vision - 2', false),
('871e8757-f393-4fa0-bb18-2010bcbbedbe', '02ab7562-4bee-4163-a894-2e24ad6e626c', 'Calendario per Machine Learning - dip. ricerca', true);

-- Insert Slot Requests
INSERT INTO slot_requests (
  "uuid", "user", "calendar", "status",
  "datetimeStart", "datetimeEnd", "title", "reason", "refusalReason"
) VALUES
-- Calendar 1
('621c5ecf-1319-4d08-abaf-3b92d51c3678', '72a84090-8f1a-4067-828b-1c975669eea4', '1baa324d-c819-4187-92da-41ab7508d13c', 'approved', date_trunc('hour', now()), date_trunc('hour', now()) + interval '12 hours', 'Request 1', 'Reason 1', NULL),
('1a6f365e-f852-429b-afca-d724844e354a', '72a84090-8f1a-4067-828b-1c975669eea4', '1baa324d-c819-4187-92da-41ab7508d13c', 'pending', TIMESTAMP '2025-09-15 10:00:00', TIMESTAMP '2025-09-15 14:00:00', 'Request 1', 'Reason 1', NULL),
('79315a5d-4c3a-4ca9-b79d-8f214c7a59dc', '5664c112-a2b3-417c-a146-136c1f2c005b', '1baa324d-c819-4187-92da-41ab7508d13c', 'approved', TIMESTAMP '2025-09-15 16:00:00', TIMESTAMP '2025-09-16 00:00:00', 'Request 2', 'Reason 2', NULL),
('69ecebc7-085c-4300-b04a-794a5db50504', '72a84090-8f1a-4067-828b-1c975669eea4', '1baa324d-c819-4187-92da-41ab7508d13c', 'refused', TIMESTAMP '2025-09-15 22:00:00', TIMESTAMP '2025-09-16 04:00:00', 'Request 3', 'Reason 3', 'RefusalReason 3'),
('96452607-52d9-48da-ac41-763033164a76', '72a84090-8f1a-4067-828b-1c975669eea4', '1baa324d-c819-4187-92da-41ab7508d13c', 'pending', TIMESTAMP '2025-09-16 06:00:00', TIMESTAMP '2025-09-16 12:00:00', 'Request 4', 'Reason 4', NULL),
('072c5946-303f-4247-b442-c1d8e6847654', 'b638c97e-5e2b-41ce-8654-74c3e0bb69ac', '1baa324d-c819-4187-92da-41ab7508d13c', 'approved', TIMESTAMP '2025-09-16 13:00:00', TIMESTAMP '2025-09-17 06:00:00', 'Request 5', 'Reason 5', NULL),

-- Calendar 2
('308481e0-a814-4f7d-9909-a2352de25191', 'b638c97e-5e2b-41ce-8654-74c3e0bb69ac', '78819106-363f-482a-8a88-71982fdf671c', 'approved', TIMESTAMP '2025-09-15 10:00:00', TIMESTAMP '2025-09-15 18:00:00', 'Request 6', 'Reason 6', NULL),
('45a307bf-1762-4a9f-8388-21a070bd58fd', '5664c112-a2b3-417c-a146-136c1f2c005b', '78819106-363f-482a-8a88-71982fdf671c', 'refused', TIMESTAMP '2025-09-15 16:00:00', TIMESTAMP '2025-09-15 21:00:00', 'Request 7', 'Reason 7', 'RefusalReason 7'),
('7e30a03b-169d-43ba-a1bd-893d79a07b54', '72a84090-8f1a-4067-828b-1c975669eea4', '78819106-363f-482a-8a88-71982fdf671c', 'pending', TIMESTAMP '2025-09-15 20:00:00', TIMESTAMP '2025-09-16 06:00:00', 'Request 8', 'Reason 8', NULL),
('1fa2c00d-defe-482c-ae8a-0e5cc3e20e92', '5664c112-a2b3-417c-a146-136c1f2c005b', '78819106-363f-482a-8a88-71982fdf671c', 'approved', TIMESTAMP '2025-09-16 05:00:00', TIMESTAMP '2025-09-16 15:00:00', 'Request 9', 'Reason 9', NULL),
('22e709c2-8a05-47f2-a88f-b8f7e3d339c5', '5664c112-a2b3-417c-a146-136c1f2c005b', '78819106-363f-482a-8a88-71982fdf671c', 'pending', TIMESTAMP '2025-09-15 22:00:00', TIMESTAMP '2025-09-16 06:00:00', 'Request 10', 'Reason 10', NULL),
('4c3dc26b-4a86-4c00-86c9-4a997f38fe69', '72a84090-8f1a-4067-828b-1c975669eea4', '78819106-363f-482a-8a88-71982fdf671c', 'approved', TIMESTAMP '2025-06-15 20:00:00', TIMESTAMP '2025-06-16 06:00:00', 'Request 11', 'Reason 11', NULL),

-- Calendar 3
('f77e913d-e5bb-47e3-974d-0c3228efd760', '72a84090-8f1a-4067-828b-1c975669eea4', '871e8757-f393-4fa0-bb18-2010bcbbedbe', 'approved', TIMESTAMP '2025-09-15 16:00:00', TIMESTAMP '2025-09-16 00:00:00', 'Request 12', 'Reason 12', NULL);
