INSERT INTO CategoriaTicket (GrupoUsuario,TipoRefeicao,Preco) VALUES
 ('A','Almoço',12.50), ('A','Jantar',12.50), ('B','Almoço',15.00),
 ('B','Jantar',15.00), ('C','Almoço',18.00);

INSERT INTO Usuario (Nome,Matricula,GrupoUsuario,SaldoAtual,SenhaHash) VALUES
 ('Ana','2023001','A',100,'hash'),
 ('Bruno','2023002','B',150,'hash'),
 ('Carla','2023003','A', 80,'hash'),
 ('Diego','2023004','C',200,'hash'),
 ('Eva','2023005','B',120,'hash'),
 ('Zeradinho','2023006','A', 0, 'hash');

INSERT INTO Restaurante (Localizacao,NomeCampus) VALUES
 ('ICC Sul','Darcy'), ('RU Norte','Darcy'),
 ('RU Gama','Gama'), ('RU Ceilândia','Ceilândia'), ('RU Planaltina','Planaltina');
