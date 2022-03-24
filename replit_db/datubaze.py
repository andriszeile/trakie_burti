import sqlite3

def savienot():
  DB = sqlite3.connect('top.db')
  return DB.cursor()
  

def top():
  SQL = savienot()
  SQL.execute("SELECT * FROM rezultati")
  rezultati = SQL.fetchall()
  dati = []
  for rez in rezultati:
    dati.append({
      "id":rez[0],
      "vards":rez[1],
      "epasts":rez[2],
      "rezultats":rez[3],
      "limenis":rez[4],
    })

  # print(dati)
  return dati

def pievienot(dati):
  SQL = savienot()
  SQL.execute("INSERT INTO rezultati (vards, epasts, rezultats, limenis) VALUES (:vards, :epasts, :rezultats, :limenis)", {'vards': dati['ResultName'], 'epasts': dati['ResultEmail'], 'rezultats':dati['ResultPoints'], 'limenis':dati['RezultLevel']})