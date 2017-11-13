'''
This script reformats a CSV dataset to a JSON dataset
'''

import csv
import json

# opens the csv file for reading and the json file for writing
csvFile = open('uefa.csv', 'r')
jsonFile = open('uefa.json', 'w')

# creates labels for the csv's
labels = ("Country", "Pts")
reader = csv.DictReader(csvFile, labels)

# writes the json file
for row in reader:
	json.dump(row, jsonFile)
	jsonFile.write('\n')