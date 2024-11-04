
# Dota 2 File Tracker

The **Dota 2 File Tracker** is a script that tracks file updates and prices for items within Dota 2. This project provides a way to monitor item history, price data, and other game-related files directly from Steam. 

> **Note**: The main part of this code was adapted from the [counter-strike-file-tracker](https://github.com/ByMykel/counter-strike-file-tracker) project and customized to meet the unique file structure and data requirements of Dota 2.

## Languages Supported

The script supports localization files in the following languages:

| Language         |
| ---------------- |
| Brazilian        |
| Bulgarian        |
| Czech            |
| Danish           |
| Dutch            |
| English          |
| Finnish          |
| French           |
| German           |
| Greek            |
| Hungarian        |
| Italian          |
| Japanese         |
| Korean           |
| LATAM Spanish    |
| Norwegian        |
| Polish           |
| Portuguese       |
| Romanian         |
| Russian          |
| Simplified Chinese|
| Spanish          |
| Swedish          |
| Traditional Chinese|
| Thai             |
| Turkish          |
| Ukrainian        |
| Vietnamese       |

## Installation

To set up and run the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/S1nuxoff/dota2-file-tracker
   ```

2. **Navigate to the project directory**:
   ```bash
   cd dota2-file-tracker
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Run the script**:
   To execute the script, use the following command, replacing `<steam_login>` and `<steam_password>` with your Steam credentials:
   ```bash
   node index.js <steam_login> <steam_password>
   ```

5. **Steam Account Requirement**:
   Ensure that Dota 2 is added to your Steam library, as the script relies on access to Dota 2 files for parsing item data.

6. **GitHub Actions Workflow**:
   For automated execution through GitHub Actions workflow, set up **secret variables** in your GitHub project settings:
   - `USERNAME` - Your Steam account username.
   - `PASSWORD` - Your Steam account password.

   > **Recommendation**: It is advised to use a Steam account without Steam Guard for seamless automation, as Steam Guard might interfere with automated logins.

## Data Parsing

All items are parsed and saved to a JSON file located in the `static` folder: [items_game.txt.json](https://github.com/S1nuxoff/dota2-file-tracker/blob/main/static/items_game.txt.json).
