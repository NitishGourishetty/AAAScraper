import requests
import json
from bs4 import BeautifulSoup
states = {};
stateCodes = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID",
"IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE",
"NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "TN", "TX",
"UT", "VT", "VA", "WA", "WV", "WI", "WY"]

testing = ["AL", "AK"]

for state in testing:
    URL = "https://gasprices.aaa.com/?state=" + state
    r = requests.get(URL, headers={'User-Agent': 'Mozilla/5.0'})
    counties = {}
    soup = BeautifulSoup(r.content, 'html5lib')
    keys = []
    stateAverage = soup.find('h1', attrs={'class':'nati'})
    #keys.append(stateAverage.text.strip().split(' ', 1)[0])
    keys.append(state)
    allCounties = soup.findAll('h3')
    for county in allCounties:
        keys.append(county.text)

    tables = soup.findAll("table", { "class" : "table-mob" })
    for table in tables:
        currCounty = keys[0]
        #temporary method if needs only one item, to only get current average
        toIndex = True
        currArr = []
        for row in table.find('tbody').find_all('tr'):
            cols = row.find_all('td')
            cols = [ele.text.strip() for ele in cols]
            if toIndex:
                #keeping only the current average of day
                currArr.append([ele for ele in cols if ele != "Current Avg."]) # Get rid of empty values
                toIndex = False
        counties[currCounty] = currArr[0] #to remove double array
        keys.pop(0)

    states[state] = counties

output = json.dumps(states)
print(output)
