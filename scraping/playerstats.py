from urllib.error import HTTPError
from urllib.request import urlopen
from bs4 import BeautifulSoup
import pandas as pd
import requests
import datetime

import mysql.connector
from sqlalchemy import create_engine
import time



curr_year = datetime.datetime.now()
curr_year = str(curr_year.year)

yearsNBA = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013',
        '2012', '2011', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002', '2001',
        '2000', '1999', '1998', '1997', '1996', '1995', '1994', '1993', '1992', '1991', '1990', '1989',
        '1988', '1987', '1986', '1985', '1984', '1983', '1982', '1981', '1980', '1979', '1978', '1977',
        '1976', '1975', '1974', '1973', '1972', '1971', '1970', '1969', '1968', '1967', '1966', '1965',
        '1964', '1963', '1962', '1961', '1960', '1959', '1958', '1957', '1956', '1955', '1954', '1953',
        '1952', '1951', '1950', '1949','1948','1947']

if(curr_year not in yearsNBA):
    yearsNBA.insert(0,curr_year)

yearsBAA = ['1949','1948','1947']


def NBAPlayerStats():

    mydb = mysql.connector.connect(
        user="hoopstatsadmin",
        password="strongaura1407#",
        host="hoopstatsdb.mysql.database.azure.com",
        port=3306,
        database="player_stats"
    )

    mycursor = mydb.cursor()


    
    for year in yearsNBA:

        check = f"""
            SELECT COUNT(*)
            FROM information_schema.tables 
            WHERE table_schema = 'PLAYER_stats'
            AND table_name = 'season{year}';
        """

        mycursor.execute(check)
        checkRes = mycursor.fetchone()

        if(checkRes[0] == 0):
            print("\n")
            print(year)

            if(year in yearsBAA):
                extension = "BAA_" + year + "_per_game.html"
            else:
                extension = "NBA_" + year + "_per_game.html"

            try:
                url = "https://www.basketball-reference.com/leagues/" + extension
                html_content = requests.get(url).content
                print("HTML content fetched successfully")
                time.sleep(5)
                soup = BeautifulSoup(html_content, 'html.parser')
                table = soup.find('table', id='per_game_stats')
                
                table_headers = []
                player_stats = []

                try:
                    for th in table.find_all('tr', limit=1)[0].find_all('th')[1:]:
                        table_headers.append(th.getText())

                    rows = table.find_all('tr')[1:]

                    for row in rows:
                        cols = row.find_all('td')
                        if(len(cols) > 0):
                            stats = [col.getText() for col in cols]
                            player_stats.append(stats)
                except AttributeError:
                        print ("Player table could not be found")
            except HTTPError as e:
                print("Error fetching html content. Skipping...")  

            df = pd.DataFrame(player_stats, columns=table_headers)

            df = df.apply(pd.to_numeric, errors='ignore')

            df_sorted = df.sort_values(by='PTS', ascending=False)

            print(df.head(3))

            mydb = mysql.connector.connect(
                host="localhost",
                user="root",
                password="abhi12345",
                database="player_stats"

            )

            mycursor = mydb.cursor()
    
            cleanUp = f"DROP TABLE IF EXISTS season{year};"


            columns_sql = [f"`{headers}` VARCHAR(255)" for headers in table_headers]

            # Join all columns into a formatted SQL string, separated by commas and newlines
            columns_str = ",\n    ".join(columns_sql)

            # Create the SQL query
            sql = f"""
            CREATE TABLE season{year} (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                {columns_str}
            );
            """

            mycursor.execute(cleanUp)
            mycursor.execute(sql)

            engine = create_engine("mysql+mysqlconnector://hoopstatsadmin:strongaura1407#@hoopstatsdb.mysql.database.azure.com:3306/player_stats")

            df_sorted.to_sql(f"season{year}", con=engine, if_exists='append', index=False)
        else:
            print("season:" + year + " already exists")


NBAPlayerStats()
