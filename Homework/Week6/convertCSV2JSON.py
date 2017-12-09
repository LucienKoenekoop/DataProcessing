'''
This script reformats a CSV dataset to a JSON dataset
'''

import csv
import json

# opens the csv file for reading and the json file for writing
csvFile = open('renewable.csv', 'r')
jsonFile = open('renawable.json', 'w')

# creates labels for the csv's
labels = ("Country", "Energy", "Biofuels", "Hydropower", "Wind", "Solar", "Geothermal")
reader = csv.DictReader(csvFile, labels)
data = []

# writes the json file
for row in reader:
	data.append(row)
json.dump(data, jsonFile)
jsonFile.write('\n')
