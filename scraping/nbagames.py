from urllib.error import HTTPError
from urllib.request import urlopen
from bs4 import BeautifulSoup
import pandas as pd

import mysql.connector
from sqlalchemy import create_engine
import time

import urllib3

# yearsNBA = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013',
#         '2012', '2011', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002', '2001',
#         '2000', '1999', '1998', '1997', '1996', '1995', '1994', '1993', '1992', '1991', '1990', '1989',
#         '1988', '1987', '1986', '1985', '1984', '1983', '1982', '1981', '1980', '1979', '1978', '1977',
#         '1976', '1975', '1974', '1973', '1972', '1971', '1970', '1969', '1968', '1967', '1966', '1965',
#         '1964', '1963', '1962', '1961', '1960', '1959', '1958', '1957', '1956', '1955', '1954', '1953',
#         '1952', '1951', '1950']

yearsNBA = ['1989','1988', '1987', '1986', '1985', '1984', '1983', '1982', '1981', '1980']

months = ['october', 'november', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september']

yearsBAA = ['1949','1948','1947']


def NBAGameStats():
    for year in yearsNBA:
        year_games = []
        for month in months:
            print(year, month)
            extension = "NBA_" + year + "_games-"+month+".html"
            url = "https://www.basketball-reference.com/leagues/" + extension
            try:
                html_content = urlopen(url).read()
                print("Content fetched successfully")
                time.sleep(7)
                soup = BeautifulSoup(html_content, 'html.parser')
                table = soup.find('table', id='schedule')


                if(int(year) > 2000):
                    table_headers = ["DATE", "START", "VISITOR", "VPTS", "HOME", "HPTS", "BOXSCORE", "OT", "ATT", "LOG", "ARENA", "NOTES"]
                else:
                    table_headers = ["DATE", "VISITOR", "VPTS", "HOME", "HPTS", "BOXSCORE", "OT", "ATT", "LOG", "ARENA", "NOTES"]


                rows = table.find_all('tr')[1:]

                for row in rows:
                    date = row.find('th')
                    stats = []
                    stats.append(date.getText())
                    cols = row.find_all('td')
                    if(len(cols) > 0):
                        for col in cols:
                            if(col.getText() == 'Box Score'):
                                stats.append(col.find('a')['href'])
                            elif(col.getText() == ''):
                                stats.append('-')
                            else:
                                stats.append(col.getText())
                        year_games.append(stats)
            except HTTPError as e:
                print("Error fetching content. Skipping...")               
                    
        df = pd.DataFrame(year_games, columns=table_headers)

        df = df.apply(pd.to_numeric, errors='ignore')

        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            password="abhi12345",
            database="game_stats"
        )

        mycursor = mydb.cursor()

        sql = f"""
        CREATE TABLE season{year} (
            ID INT AUTO_INCREMENT PRIMARY KEY,
            DATE VARCHAR(255),
            START VARCHAR(255),
            ET VARCHAR(255),
            VISITOR VARCHAR(255),
            VPTS VARCHAR(255),
            HOME VARCHAR(255),
            HPTS VARCHAR(255),
            BOXSCORE VARCHAR(255),
            OT VARCHAR(255),
            ATT VARCHAR(255),
            LOG VARCHAR(255),
            ARENA VARCHAR(255),
            NOTES VARCHAR(255)
        );
        """
        mycursor.execute(sql)

        engine = create_engine("mysql+mysqlconnector://root:abhi12345@localhost/game_stats")

        df.to_sql(f"season{year}", con=engine, if_exists='append', index=False)

            

NBAGameStats()