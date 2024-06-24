from urllib.request import urlopen
from bs4 import BeautifulSoup
import pandas as pd

import mysql.connector
from sqlalchemy import create_engine
import time



yearsNBA = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013',
        '2012', '2011', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002', '2001',
        '2000', '1999', '1998', '1997', '1996', '1995', '1994', '1993', '1992', '1991', '1990', '1989',
        '1988', '1987', '1986', '1985', '1984', '1983', '1982', '1981', '1980', '1979', '1978', '1977',
        '1976', '1975', '1974', '1973', '1972', '1971', '1970', '1969', '1968', '1967', '1966', '1965',
        '1964', '1963', '1962', '1961', '1960', '1959', '1958', '1957', '1956', '1955', '1954', '1953',
        '1952', '1951', '1950']

yearsBAA = ['1949','1948','1947']


def NBAPlayerStats():
    for year in yearsNBA:
        
        print(year)
        extension = year + "_per_game.html"
        url = "https://www.basketball-reference.com/leagues/NBA_" + extension
        html_content = urlopen(url).read()
        time.sleep(5)
        soup = BeautifulSoup(html_content, 'html.parser')
        table = soup.find('table', id='per_game_stats')

        table_headers = []
        player_stats = []

        for th in table.find_all('tr', limit=1)[0].find_all('th')[1:]:
            table_headers.append(th.getText())

        rows = table.find_all('tr')[1:]

        for row in rows:
            cols = row.find_all('td')
            if(len(cols) > 0):
                stats = [col.getText() for col in cols]
                player_stats.append(stats)

        df = pd.DataFrame(player_stats, columns=table_headers)

        df = df.apply(pd.to_numeric, errors='ignore')

        df_sorted = df.sort_values(by='PTS', ascending=False)

        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            password="abhi12345",
            database="player_stats"

        )

        mycursor = mydb.cursor()

        sql = f"""
        CREATE TABLE Season{year} (
            ID INT AUTO_INCREMENT PRIMARY KEY,
            PLAYER VARCHAR(255),
            POS VARCHAR(255),
            AGE VARCHAR(255),
            TM VARCHAR(255),
            G VARCHAR(255),
            GS VARCHAR(255),
            MP VARCHAR(255),
            FG VARCHAR(255),
            FGA VARCHAR(255),
            `FG%` VARCHAR(255),
            `3P` VARCHAR(255),
            `3PA` VARCHAR(255),
            `3P%` VARCHAR(255),
            `2P` VARCHAR(255),
            `2PA` VARCHAR(255),
            `2P%` VARCHAR(255),
            `eFG%` VARCHAR(255),
            FT VARCHAR(255),
            FTA VARCHAR(255),
            `FT%` VARCHAR(255),
            ORB VARCHAR(255),
            DRB VARCHAR(255),
            TRB VARCHAR(255),
            AST VARCHAR(255),
            STL VARCHAR(255),
            BLK VARCHAR(255),
            TOV VARCHAR(255),
            PF VARCHAR(255),
            PTS VARCHAR(255)
        );
        """
        mycursor.execute(sql)

        engine = create_engine("mysql+mysqlconnector://root:abhi12345@localhost/player_stats")

        df_sorted.to_sql(f"season{year}", con=engine, if_exists='append', index=False)



#NBA's BAA years

def BAAPlayerStats():
    for year in yearsBAA:
        print(year)
        extension = year + "_per_game.html"
        url = "https://www.basketball-reference.com/leagues/BAA_" + extension
        html_content = urlopen(url).read()
        time.sleep(5)
        soup = BeautifulSoup(html_content, 'html.parser')
        table = soup.find('table', id='per_game_stats')

        table_headers = []
        player_stats = []

        for th in table.find_all('tr', limit=1)[0].find_all('th')[1:]:
            table_headers.append(th.getText())

        rows = table.find_all('tr')[1:]

        for row in rows:
            cols = row.find_all('td')
            if(len(cols) > 0):
                stats = [col.getText() for col in cols]
                player_stats.append(stats)

        df = pd.DataFrame(player_stats, columns=table_headers)

        df = df.apply(pd.to_numeric, errors='ignore')

        df_sorted = df.sort_values(by='PTS', ascending=False)

        # df_top100 = df_sorted.head(100)

        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            password="abhi12345",
            database="player_stats"

        )

        mycursor = mydb.cursor()

        sql = f"""
        CREATE TABLE Season{year} (
            ID INT AUTO_INCREMENT PRIMARY KEY,
            PLAYER VARCHAR(255),
            POS VARCHAR(255),
            AGE VARCHAR(255),
            TM VARCHAR(255),
            G VARCHAR(255),
            GS VARCHAR(255),
            MP VARCHAR(255),
            FG VARCHAR(255),
            FGA VARCHAR(255),
            `FG%` VARCHAR(255),
            `3P` VARCHAR(255),
            `3PA` VARCHAR(255),
            `3P%` VARCHAR(255),
            `2P` VARCHAR(255),
            `2PA` VARCHAR(255),
            `2P%` VARCHAR(255),
            `eFG%` VARCHAR(255),
            FT VARCHAR(255),
            FTA VARCHAR(255),
            `FT%` VARCHAR(255),
            ORB VARCHAR(255),
            DRB VARCHAR(255),
            TRB VARCHAR(255),
            AST VARCHAR(255),
            STL VARCHAR(255),
            BLK VARCHAR(255),
            TOV VARCHAR(255),
            PF VARCHAR(255),
            PTS VARCHAR(255)
        );
        """
        mycursor.execute(sql)

        engine = create_engine("mysql+mysqlconnector://root:abhi12345@localhost/player_stats")

        df_sorted.to_sql(f"season{year}", con=engine, if_exists='append', index=False)


NBAPlayerStats()
