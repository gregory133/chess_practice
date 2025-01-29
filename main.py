import json

f = open("openings_sheet.csv", "r+")

jsonFile = open('openings_sheet.json', 'w')

l = []    

for line in f:
    
    values = line.split(',')
    values = [s.strip() for s in values]
    values = [values[1], values[-1]]
    values = [values[0].replace('"', ''), values[1].replace('"', '')]

    l.append({values[0] : values[1]})

json.dump(l, jsonFile, indent=2)
   

f.close()