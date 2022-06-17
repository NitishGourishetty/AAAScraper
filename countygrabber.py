import requests
import json
from bs4 import BeautifulSoup



headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'}
overallDict = {}
specificCountiesDict = {}

stateCodes = {"AL": 2, "AK": 4, "AZ": 5, "AR": 6, "CA": 7, "CO": 8, "CT": 9, "DE": 10, "FL": 1, "GA": 11, "HI": 12, "ID": 13,
"IL": 14, "IN": 15, "IA": 16, "KS": 18, "KY": 19, "LA": 20, "ME": 21, "MD": 22, "MA": 23, "MI": 24, "MN": 25, "MS": 26 , "MO": 27, "MT": 28, "NE": 29,
"NV": 30, "NH": 31, "NJ": 32, "NM": 33, "NY": 34, "NC": 35, "ND": 36, "OH": 37, "OK": 38, "OR": 39, "PA": 40, "RI": 41, "SC": 42, "TN": 44, "TX": 45,
"UT": 46, "VT": 47, "VA": 48, "WA": 49, "WV": 50, "WI": 51, "WY": 52}

testCode = {"AL": 2, "AK": 4, "AZ": 5}
# FIND A BETTER WAY LATER BUT THIS WORKS FOR NOW IG, see if this works later too...., better would be nice

for key in stateCodes:
  URL = 'https://gasprices.aaa.com/index.php?premiumhtml5map_js_data=true&map_id=' + str(stateCodes[key])
  r = requests.get(URL, headers=headers)
  data = r.content.decode()
  stripped = data.split('map_data', 1)[1]
  stripped = stripped.split(":", 1)[1]
  stripped = stripped.split(",groups", 1)[0]
  stripped.replace(" ", "")
  convertedDict = json.loads(stripped)

  prevValue = '$0.00'
  for x in convertedDict.values():
    if(x["comment"] == ''): #just to keep empty ones away
      x["comment"] = prevValue
    else:
      prevValue = x["comment"]
    specificCountiesDict[x["name"]] = x["comment"]

  overallDict[key] = specificCountiesDict
  specificCountiesDict = {}

output = json.dumps(overallDict)
print(output)