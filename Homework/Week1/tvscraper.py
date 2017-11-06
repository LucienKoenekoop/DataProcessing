#!/usr/bin/env python
# Name: Lucien Koenekoop
# Student number: 10531661
#
# reference: https://regexr.com
# reference: https://www.tutorialspoint.com/python/python_reg_expressions.htm

'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv
import re
import os, sys; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from pattern.web import URL, DOM, plaintext
from pattern.web import NODE, TEXT, COMMENT, ELEMENT, DOCUMENT

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'

class tvserie:
        def __init__(self, title, rating, genres, actors, runtime):
            self.title = title
            self.rating = rating
            self.genres = genres
            self.actors = actors
            self.runtime = runtime

def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''
    title, rating, genres, actors, runtime = "unknown title", "unknown rating", "unknown genres", "unknown actors", "unknown runtime"

    tvseries = []
    for e in dom.by_tag("div.lister-item"):

        title = e.by_tag("h3")[0].by_tag("a")[0].content.encode("utf-8")
        
        rating = e.by_tag("div.ratings-bar")[0].by_tag("strong")[0].content.encode("utf-8")
        
        genres = plaintext(e.by_tag("p.text-muted")[0].by_tag("span.genre")[0].content.encode("utf-8"))

        search = re.search("(?:\d*\.)?\d+", e.by_tag("p.text-muted")[0].by_tag("span.runtime")[0].content.encode("utf-8"))
        runtime = search.group()    
        
        actor = []    
        for h in e.by_tag("p"):
            for j in h.by_tag("a"):
                actor.append(j.content.encode("utf-8"))
            actors = ", ".join(actor)

        tvseries.append(tvserie(title, rating, genres, actors, runtime))

    return tvseries


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    for tvserie in tvseries:
        writer.writerow((tvserie.title, tvserie.rating, tvserie.genres, tvserie.actors, tvserie.runtime))

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)