from urllib.error import HTTPError
from bs4 import BeautifulSoup
import pandas as pd
import requests
import datetime
import mysql.connector
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os
import time

# Load environment variables
load_dotenv()

# Get database credentials from environment variables
DB_HOST = os.getenv('DB_HOST')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_PORT = os.getenv('DB_PORT')
GAME_DB = os.getenv('GAME_DB')

curr_year = datetime.datetime.now()
curr_year = str(curr_year.year)

yearsNBA = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013',
            '2012', '2011', '2010', '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002', '2001',
            '2000', '1999', '1998', '1997', '1996', '1995', '1994', '1993', '1992', '1991', '1990', '1989',
            '1988', '1987', '1986', '1985', '1984', '1983', '1982', '1981', '1980', '1979', '1978', '1977',
            '1976', '1975', '1974', '1973', '1972', '1971', '1970', '1969', '1968', '1967', '1966', '1965',
            '1964', '1963', '1962', '1961', '1960', '1959', '1958', '1957', '1956', '1955', '1954', '1953',
            '1952', '1951', '1950', '1949', '1948', '1947']

if curr_year not in yearsNBA:
    yearsNBA.insert(0, curr_year)

months = ['october', 'november', 'december', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september']

yearsBAA = ['1949', '1948', '1947']


def NBAGameStats():
    for year in yearsNBA:
        # Connect to the database using environment variables
        mydb = mysql.connector.connect(
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT,
            database=GAME_DB
        )

        mycursor = mydb.cursor()

        check = f"""
            SELECT COUNT(*)
            FROM information_schema.tables 
            WHERE table_schema = '{GAME_DB}'
            AND table_name = 'season{year}';
        """

        mycursor.execute(check)
        checkRes = mycursor.fetchone()

        year_games = []

        if checkRes[0] == 0:
            for month in months:
                print("\n")
                print(year, month)

                if year in yearsBAA:
                    extension = "BAA_" + year + "_games-" + month + ".html"
                else:
                    extension = "NBA_" + year + "_games-" + month + ".html"

                url = "https://www.basketball-reference.com/leagues/" + extension
                try:
                    html_content = requests.get(url).content
                    print("HTML content fetched successfully")
                    time.sleep(5)
                    soup = BeautifulSoup(html_content, 'html.parser')
                    table = soup.find('table', id='schedule')

                    table_headers = ["DATE", "VISITOR", "VPTS", "HOME", "HPTS", "BOXSCORE", "OT", "ATT", "LOG", "ARENA", "NOTES"]

                    try:
                        rows = table.find_all('tr')[1:]

                        for row in rows:
                            date = row.find('th')
                            stats = []
                            stats.append(date.getText())
                            cols = row.find_all('td')
                            if len(cols) > 0:
                                for i in range(len(cols)):
                                    if cols[i].get('data-stat') == 'game_start_time':
                                        pass
                                    elif cols[i].getText() == 'Box Score':
                                        stats.append(cols[i].find('a')['href'])
                                    elif cols[i].getText() == '':
                                        stats.append('-')
                                    else:
                                        stats.append(cols[i].getText())
                                year_games.append(stats)

                    except AttributeError:
                        print("Games table could not be found")
                except HTTPError as e:
                    print("Error fetching html content. Skipping...")

            df = pd.DataFrame(year_games, columns=table_headers)

            df = df.apply(pd.to_numeric, errors='ignore')

            print(df.head(3))
            print("\n\n")

            columns = (f"`{headers}` VARCHAR(255)" for headers in table_headers)

            columns_str = ",\n    ".join(columns)

            sql = f"""
            CREATE TABLE season{year} (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                {columns_str}
            );
            """
            mycursor.execute(sql)

            engine = create_engine(f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{GAME_DB}")

            df.to_sql(f"season{year}", con=engine, if_exists='append', index=False)
        else:
            print("season:" + year + " already exists")


NBAGameStats()