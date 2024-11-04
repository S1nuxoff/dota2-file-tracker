# Dota 2 File Tracker

The **Dota 2 File Tracker** is a script that tracks file updates and prices for items within Dota 2. This project provides a way to monitor item history, price data, and other game-related files directly from Steam. 

> **Note**: The main part of this code was adapted from the [counter-strike-file-tracker](https://github.com/ByMykel/counter-strike-file-tracker) project and customized to meet the unique file structure and data requirements of Dota 2.

## Features

- **Comprehensive Language Support**: This project supports over 20 languages for localization, allowing users worldwide to track Dota 2 item data in their preferred language.
- **Batch Processing**: Optimized batch processing to efficiently handle large datasets of Dota 2 items and price histories.
- **Rate-Limited API Calls**: Configured to respect Steam Market's rate limits, preventing any service disruptions due to excessive requests.
- **Data Persistence**: Saves item data, pricing history, and processing states locally to minimize redundant calls and provide quick access to previously fetched data.

## Languages Supported

The script supports localization files in the following languages:

| Language         | Localization File                              |
| ---------------- | ---------------------------------------------- |
| Brazilian        | `resource/localization/items_brazilian.txt`    |
| Bulgarian        | `resource/localization/items_bulgarian.txt`    |
| Czech            | `resource/localization/items_czech.txt`        |
| Danish           | `resource/localization/items_danish.txt`       |
| Dutch            | `resource/localization/items_dutch.txt`        |
| English          | `resource/localization/items_english.txt`      |
| Finnish          | `resource/localization/items_finnish.txt`      |
| French           | `resource/localization/items_french.txt`       |
| German           | `resource/localization/items_german.txt`       |
| Greek            | `resource/localization/items_greek.txt`        |
| Hungarian        | `resource/localization/items_hungarian.txt`    |
| Italian          | `resource/localization/items_italian.txt`      |
| Japanese         | `resource/localization/items_japanese.txt`     |
| Korean           | `resource/localization/items_koreana.txt`      |
| LATAM Spanish    | `resource/localization/items_latam.txt`        |
| Norwegian        | `resource/localization/items_norwegian.txt`    |
| Polish           | `resource/localization/items_polish.txt`       |
| Portuguese       | `resource/localization/items_portuguese.txt`   |
| Romanian         | `resource/localization/items_romanian.txt`     |
| Russian          | `resource/localization/items_russian.txt`      |
| Simplified Chinese | `resource/localization/items_schinese.txt`   |
| Spanish          | `resource/localization/items_spanish.txt`      |
| Swedish          | `resource/localization/items_swedish.txt`      |
| Traditional Chinese | `resource/localization/items_tchinese.txt`  |
| Thai             | `resource/localization/items_thai.txt`         |
| Turkish          | `resource/localization/items_turkish.txt`      |
| Ukrainian        | `resource/localization/items_ukrainian.txt`    |
| Vietnamese       | `resource/localization/items_vietnamese.txt`   |

## Installation

To set up and run the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/S1nuxoff/dota2-file-tracker
