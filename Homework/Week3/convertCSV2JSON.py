'''
This script reformats a CSV dataset to a JSON dataset
'''

import csv
import json

csvFile = open('uefa.csv', 'r')
jsonFile = open('uefa.json', 'w')

columns = ("Country", "Pts")
reader = csv.DictReader(csvFile, columns)
for row in reader:
	json.dump(row, jsonFile)
	jsonFile.write('\n')