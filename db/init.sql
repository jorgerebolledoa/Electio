-- =========================
-- ROLES
-- =========================
CREATE TABLE rol (
  rol_id INT PRIMARY KEY,
  rol VARCHAR(20) NOT NULL
);

INSERT INTO rol VALUES
(1, 'Estudiante'),
(2, 'Secretaría'),
(3, 'Admin');

-- =========================
-- USUARIO
-- =========================
CREATE TABLE usuario (
  usu_rut VARCHAR(9) PRIMARY KEY,
  usu_contrasena VARCHAR(20) NOT NULL,
  usu_nombre VARCHAR(100) NOT NULL,
  usu_email VARCHAR(50) NOT NULL,
  usu_nivel INT,
  usu_rol INT NOT NULL,
  usu_eliminado BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (usu_rol) REFERENCES rol(rol_id)
);

INSERT INTO usuario VALUES
('213456789', '1234', 'Juan Pérez González', 'juan.perez@usach.cl', 5, 1, false),
('198765432', '1234', 'María López Rojas', 'maria.lopez@usach.cl', 7, 2, false);

-- =========================
-- PERIODO ACADEMICO
-- =========================
CREATE TABLE periodo_academico (
  per_id INT PRIMARY KEY,
  per_ano VARCHAR(4) NOT NULL,
  per_semestre INT NOT NULL,
  per_eliminado BOOLEAN DEFAULT FALSE
);

INSERT INTO periodo_academico VALUES
(1, '2025', 1, false),
(2, '2025', 2, false);

-- =========================
-- ELECTIVO
-- =========================
CREATE TABLE electivo (
  ele_cod VARCHAR(20) PRIMARY KEY,
  ele_periodo INT NOT NULL,
  ele_nombre VARCHAR(50) NOT NULL,
  ele_descripcion VARCHAR(100),
  ele_img VARCHAR(100),
  ele_cupos_totales INT NOT NULL,
  ele_cupos INT NOT NULL,
  ele_profesor VARCHAR(50),
  ele_eliminado BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (ele_periodo) REFERENCES periodo_academico(per_id)
);

INSERT INTO electivo VALUES
('INF-401', 1, 'Introducción a la IA', 'Conceptos básicos de IA', NULL, 30, 30, 'Dr. Carlos Muñoz', false),
('INF-402', 1, 'Desarrollo Web', 'Apps web modernas', NULL, 25, 25, 'Ing. Paula Contreras', false),
('INF-403', 2, 'Desarrollo Web', 'Apps web modernas', NULL, 25, 25, 'Ing. Paula Contreras', false);

-- =========================
-- BLOQUE HORARIO
-- =========================
CREATE TABLE bloque_horario (
  blo_id INT PRIMARY KEY,
  blo_dia VARCHAR(12),
  blo_hora_i TIME,
  blo_hora_t TIME
);

INSERT INTO bloque_horario VALUES
(1, 'Lunes', '08:30', '10:00'),
(2, 'Miércoles', '10:15', '11:45');

-- =========================
-- ESTADO 
-- =========================
CREATE TABLE estado (
  est_id INT PRIMARY KEY,
  est VARCHAR(20) NOT NULL
);

INSERT INTO estado VALUES
(1, 'Pendiente'),
(2, 'Aceptada'),
(3, 'Rechazada');

-- =========================
-- POSTULACION
-- =========================
CREATE TABLE postulacion (
  post_id SERIAL PRIMARY KEY,
  post_fecha TIMESTAMP,
  post_fecha_asignacion TIMESTAMP,
  post_pref INT,
  post_estado INT,
  post_usuario VARCHAR(9),
  post_electivo VARCHAR(20),
  post_eliminado BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (post_estado) REFERENCES estado(est_id),
  FOREIGN KEY (post_usuario) REFERENCES usuario(usu_rut),
  FOREIGN KEY (post_electivo) REFERENCES electivo(ele_cod)
);
INSERT INTO postulacion (
  post_fecha,
  post_fecha_asignacion,
  post_pref,
  post_estado,
  post_usuario,
  post_electivo,
  post_eliminado
) VALUES
('2025-03-01 09:15:00', NULL, 1, 1, '213456789', 'INF-401', FALSE),
('2025-03-01 10:30:00', NULL, 2, 1, '198765432', 'INF-402', FALSE),
('2025-03-02 08:45:00', '2025-03-05 14:20:00', 1, 2, '213456789', 'INF-402', FALSE),
('2025-03-02 11:00:00', '2025-03-06 09:10:00', 3, 3, '198765432', 'INF-401', FALSE);


-- =========================
-- ELECTIVO - HORARIO
-- =========================
CREATE TABLE electivo_horario (
  ele_cod VARCHAR(20),
  blo_id INT,
  PRIMARY KEY (ele_cod, blo_id),
  FOREIGN KEY (ele_cod) REFERENCES electivo(ele_cod),
  FOREIGN KEY (blo_id) REFERENCES bloque_horario(blo_id)
);

INSERT INTO electivo_horario VALUES
('INF-401', 1),
('INF-402', 2);
