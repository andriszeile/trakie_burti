from flask import Flask, render_template, jsonify, request, jsonify, url_for
import json
import datubaze
import sqlite3
import json

JSON = 'dati\top.json'

DB = sqlite3.connect('top.db')
SQL = DB.cursor()

SQL.execute("""CREATE TABLE IF NOT EXISTS rezultati ( 
              id INTEGER NOT NULL UNIQUE,
              vards TEXT,
              epasts TEXT,
              rezultats INTEGER,
              limenis INTEGER,
              PRIMARY KEY("id" AUTOINCREMENT)
           )""")

with open(JSON, 'r', encoding="UTF-8") as f:
  dati = f.read()
  datiJson = json.loads(dati)

  for dati in datiJson:
    SQL.execute("INSERT INTO rezultati (vards, epasts, rezultats, limenis) VALUES (:vards, :epasts, :rezultats, :limenis)", {'vards': dati['vards'], 'epasts': dati['epasts'], 'rezultats':dati['rezultats'], 'limenis':dati['limenis']})


DB.commit()

SQL.execute("SELECT * FROM rezultati")

print(SQL.fetchall())