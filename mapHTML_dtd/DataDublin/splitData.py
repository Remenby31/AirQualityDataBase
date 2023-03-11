import os
from pandas import read_csv
import datetime

def timestamp_minuit(timestamp):
    dt = datetime.datetime.fromtimestamp(timestamp)
    midnight = dt.replace(hour=0, minute=0, second=0, microsecond=0)
    return int(midnight.timestamp())

# List all the path in the directory and subdirectories
files = []
for root, dirs, fileNames in os.walk("DCU"):
    for fileName in fileNames:
        files.append(fileName)

# Create a list of the files that end with .csv
csvFiles = [file for file in files if file.endswith('.csv')]


# Loop through the list of files
for file in csvFiles:
    # Read the file into a DataFrame
    df = read_csv(file, delimiter=';')

    # Recperer le premier timestamp
    firstTimestamp = df['timestamp'].iloc[0]
    timestampMin = timestamp_minuit(firstTimestamp)

    # Pour chaque jour, on creer un fichier csv avec les donnees du jour et les headers (les données sont triées par timestamp)
    while True:
        try:
            # On recupere les timestamp du jour
            timestampMax = timestampMin + 86400

            # On recupere les lignes du jour
            dayDf = df[(df['timestamp'] >= timestampMin) & (df['timestamp'] < timestampMax)]
            if len(dayDf) == 0:
                break

            # on creer un dossier pour le fichier, si il n'existe pas
            if not os.path.exists("DCU/" + file[:-4]):
                os.makedirs("DCU/" + file[:-4])

            # On creer le nom du fichier avec le timestamp du jour, converti en date
            fileName = "DCU/" + file[:-4] + '/' + datetime.datetime.fromtimestamp(timestampMin).strftime('%Y-%m-%d') + '.csv'

            # On ecrit le fichier, sans ajouter les headers
            dayDf.to_csv(fileName, index=False, header=False, sep=';')

            # On passe au jour suivant
            timestampMin = timestampMax
        except:
            print("Error with file " + file)