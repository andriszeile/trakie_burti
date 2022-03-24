from flask import Flask, render_template, jsonify, request, jsonify
import json

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
  vards = request.form['ResultName']
  epasts = request.form['ResultEmail']
  rezultats = int(request.form['ResultPoints'])
  limenis = int(request.form['ResultLevel'])
  jauns_ieraksts = {"vards": vards, "epasts": epasts, "rezultats": rezultats, "limenis": limenis}
  with open('dati/top.json', 'r', encoding = 'utf-8') as f:
    dati = json.loads(f.read())
# parbaudām vai ieraksts vārdam eksistē, ja nē -> pievienojam
  ir_ieraksts = False
  for i in range(len(dati)):
    if dati[i]['vards'] == vards:
      dati[i]['rezultats'] = rezultats
      ir_ieraksts = True
  if not ir_ieraksts:
    dati.append(jauns_ieraksts)
  with open('dati/top.json', 'w', encoding = 'utf-8') as f:
    f.write(json.dumps(dati, indent = 2, ensure_ascii = False))
  return render_template("index.html")


@app.route('/top/rezultati') # rezultati no top.json
def top_rezultati():
  with open('dati/top.json', 'r', encoding = 'utf-8') as f:
    dati = json.loads(f.read())
    return jsonify(dati)


app.run(host='0.0.0.0', port=8080)
