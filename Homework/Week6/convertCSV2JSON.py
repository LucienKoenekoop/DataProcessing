'''
This script reformats a CSV dataset to a JSON dataset
'''

import csv
import json

# opens the csv file for reading and the json file for writing
csvFile = open('energy200405.csv', 'r')
jsonFile = open('energy200415.json', 'w')

# creates labels for the csv's
labels = ("Country", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015")
reader = csv.DictReader(csvFile, labels)
data = []

# writes the json file
for row in reader:
	data.append(row)
json.dump(data, jsonFile)
jsonFile.write('\n')
