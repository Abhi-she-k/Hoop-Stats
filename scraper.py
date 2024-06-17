from urllib.request import urlopen
from bs4 import BeautifulSoup
import pandas as pd


years = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010]



for year in years:
    print(year)
    extension = f"{year}_per_game.html"
    url = "https://www.basketball-reference.com/leagues/NBA_" + extension
    html_content = urlopen(url).read()
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

    df_top100 = df_sorted.head(100)

    with pd.ExcelWriter('playerStats.xlsx', engine='openpyxl', mode='a') as writer:  
        df_top100.to_excel(writer, sheet_name=str(year))
