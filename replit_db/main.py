from flask import Flask, render_template, jsonify, request, jsonify
import json
import sqlite3 as sql

app = Flask('app')
app.config['JSON_AS_ASCII'] = False

@app.route('/') #starte lapu
def index():
  return render_template("index.html")

@app.route('/', methods=['POST']) # rezultatu pievienošana top.json
  #def postTop(dati):
  #datiJson = json.loads(dati)
  #datubaze.pievienot(datiJson)
  #return "OK"

def add():
  #kopējs json & DB
  vards = request.form['ResultName']
  epasts = request.form['ResultEmail']
  rezultats = int(request.form['ResultPoints'])
  limenis = int(request.form['ResultLevel'])
  #DB
  with sql.connect('top.db') as con:
    cur = con.cursor()
    cur.execute("INSERT INTO rezultati (vards, epasts, rezultats, limenis) VALUES (:vards, :epasts, :rezultats, :limenis)", {'vards': vards, 'epasts': epasts, 'rezultats': rezultats, 'limenis': limenis})
    con.commit()

  #json
  #jauns_ieraksts = {"vards": vards, "epasts": epasts, "rezultats": rezultats, "limenis": limenis}
  #with open('dati/top.json', 'r', encoding = 'utf-8') as f:
    #dati = json.loads(f.read())
# parbaudām vai ieraksts vārdam eksistē, ja nē -> pievienojam
  #ir_ieraksts = False
  #for i in range(len(dati)):
    #if dati[i]['vards'] == vards:
      #dati[i]['rezultats'] = rezultats
      #ir_ieraksts = True
  #if not ir_ieraksts:
    #dati.append(jauns_ieraksts)
  #with open('dati/top.json', 'w', encoding = 'utf-8') as f:
    #f.write(json.dumps(dati, indent = 2, ensure_ascii = False))
  return render_template("index.html")
  con.close()


@app.route('/top/rezultati')
def top_rezultati():
  #DB
  con = sql.connect('top.db')
  cur = con.cursor()
  cur.execute('SELECT * FROM rezultati')
  rezultati = cur.fetchall()
  dati = []
  for rez in rezultati:
    dati.append({
      "vards":rez[1],
      "epasts":rez[2],
      "rezultats":rez[3],
      "limenis":rez[4],
    })
   
  return jsonify(dati)
  con.close()
  #json
  #with open('dati/top.json', 'r', encoding = 'utf-8') as f:
    #dati = json.loads(f.read())
    #return jsonify(dati)


app.run(host='0.0.0.0', port=8080)
