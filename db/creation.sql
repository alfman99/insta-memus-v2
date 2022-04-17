CREATE TABLE Accounts (
  id VARCHAR(15) PRIMARY KEY
);

CREATE TABLE Posts (
  id VARCHAR(15) PRIMARY KEY, 
  account_id VARCHAR(15) NOT NULL,
  FOREIGN KEY (account_id) REFERENCES Accounts(id)
);

INSERT INTO Accounts (id) VALUES ('freshmemus');
INSERT INTO Accounts (id) VALUES ('codermemus');

INSERT INTO Posts (id, account_id) VALUES ('u5o68t', 'freshmemus');