const SteamUser = require("steam-user");
const fs = require("fs");
const vpk = require("vpk");
const parser = require("@node-steam/vdf");
const { exec } = require("child_process");

const appId = 570;
const depotIds = [381451, 381452, 381453, 381454, 381455, 373301]; // List of depots
const dir = `./static`;
const temp = "./temp";
const manifestIdFile = "manifestId.txt";

const vpkFiles = [
  //   "resource/localization/dota_brazilian.txt",
  //   "resource/localization/dota_bulgarian.txt",
  //   "resource/localization/dota_czech.txt",
  //   "resource/localization/dota_danish.txt",
  //   "resource/localization/dota_dutch.txt",
  "resource/localization/dota_english.txt",
  //   "resource/localization/dota_finnish.txt",
  //   "resource/localization/dota_french.txt",
  //   "resource/localization/dota_german.txt",
  //   "resource/localization/dota_greek.txt",
  //   "resource/localization/dota_hungarian.txt",
  //   "resource/localization/dota_italian.txt",
  //   "resource/localization/dota_japanese.txt",
  //   "resource/localization/dota_koreana.txt",
  //   "resource/localization/dota_latam.txt",
  //   "resource/localization/dota_norwegian.txt",
  //   "resource/localization/dota_polish.txt",
  //   "resource/localization/dota_portuguese.txt",
  //   "resource/localization/dota_romanian.txt",
  //   "resource/localization/dota_russian.txt",
  //   "resource/localization/dota_schinese.txt",
  //   "resource/localization/dota_spanish.txt",
  //   "resource/localization/dota_swedish.txt",
  //   "resource/localization/dota_tchinese.txt",
  //   "resource/localization/dota_thai.txt",
  //   "resource/localization/dota_turkish.txt",
  "resource/localization/dota_ukrainian.txt",
  //   "resource/localization/dota_vietnamese.txt",
  "scripts/items/items_game.txt",
];

async function getManifests(user) {
  console.log(`Fetching product info for appId ${appId}`);
  const productInfo = await user.getProductInfo([appId], [], true);
  const cs = productInfo.apps[appId].appinfo;

  let manifests = {};

  for (const depotId of depotIds) {
    const depot = cs.depots[depotId];
    if (!depot) {
      console.error(`Depot ${depotId} not found in app's depots`);
      continue;
    }
    const latestManifestId = depot.manifests.public.gid;

    console.log(
      `Fetching manifest for depot ${depotId}, manifest ID ${latestManifestId}`
    );

    const manifest = await user.getManifest(
      appId,
      depotId,
      latestManifestId,
      "public"
    );

    manifests[depotId] = {
      manifestId: latestManifestId,
      files: manifest.manifest.files,
    };
  }

  return manifests;
}

async function downloadVPKDir(user, manifest) {
  const dirFile = manifest.files.find((file) =>
    file.filename.endsWith("dota\\pak01_dir.vpk")
  );

  console.log(`Downloading pak01_dir.vpk from depot 373301`);

  await user.downloadFile(appId, 373301, dirFile, `${temp}/pak01_dir.vpk`);

  const vpkDir = new vpk(`${temp}/pak01_dir.vpk`);
  vpkDir.load();

  return vpkDir;
}

function getRequiredVPKFiles(vpkDir) {
  const requiredIndices = new Set();

  for (const fileName of vpkDir.files) {
    for (const f of vpkFiles) {
      if (fileName.startsWith(f)) {
        console.log(`Found VPK entry for ${f}: ${fileName}`);

        const archiveIndex = vpkDir.tree[fileName].archiveIndex;
        requiredIndices.add(archiveIndex);
        break;
      }
    }
  }

  return Array.from(requiredIndices).sort((a, b) => a - b);
}

async function downloadVPKArchives(user, manifests, requiredIndices) {
  console.log(`Required VPK files: ${requiredIndices}`);

  let fileIndex = 1;
  const totalFiles = requiredIndices.length;

  for (const index of requiredIndices) {
    const paddedIndex = index.toString().padStart(3, "0");
    const fileName = `pak01_${paddedIndex}.vpk`;

    let fileFound = false;

    // Search through all depots for the VPK file
    for (const depotId of depotIds) {
      const manifest = manifests[depotId];

      if (!manifest) {
        continue;
      }

      const file = manifest.files.find((f) => f.filename.endsWith(fileName));

      if (file) {
        const filePath = `${temp}/${fileName}`;
        const status = `[${fileIndex}/${totalFiles}]`;

        console.log(`${status} Downloading ${fileName} from depot ${depotId}`);

        await user.downloadFile(appId, depotId, file, filePath);
        fileFound = true;
        break;
      }
    }

    if (!fileFound) {
      console.error(`File ${fileName} not found in any depot.`);
    }

    fileIndex++;
  }
}

function trimBOM(buffer) {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xef &&
    buffer[1] === 0xbb &&
    buffer[2] === 0xbf
  ) {
    return buffer.slice(3);
  } else {
    return buffer;
  }
}
function parseComplexVDF(fileContent) {
  const lines = fileContent.split("\n"); // Разделяем на строки
  const parsedData = {};

  let currentSection = null;
  let currentSubsection = null;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Игнорируем пустые строки и комментарии
    if (!trimmedLine || trimmedLine.startsWith("//")) {
      continue;
    }

    // Пытаемся найти пары ключ-значение
    const match = trimmedLine.match(/"(.+?)"\s+"(.+?)"/);
    if (match) {
      const key = match[1];
      const value = match[2];

      // Если есть текущий раздел и подраздел, добавляем туда
      if (currentSection && currentSubsection) {
        parsedData[currentSection][currentSubsection][key] = value;
      } else if (currentSection) {
        // Если есть только текущий раздел, добавляем туда
        parsedData[currentSection][key] = value;
      } else {
        // Иначе добавляем на верхний уровень
        parsedData[key] = value;
      }
    } else {
      // Если строка — это название нового раздела или подраздела
      const sectionMatch = trimmedLine.match(/"(.+?)"/);
      if (sectionMatch) {
        const sectionName = sectionMatch[1];

        if (currentSection && !currentSubsection) {
          // Создаем новый подраздел внутри текущего раздела
          currentSubsection = sectionName;
          parsedData[currentSection][currentSubsection] = {};
        } else {
          // Создаем новый раздел
          currentSection = sectionName;
          currentSubsection = null;
          parsedData[currentSection] = {};
        }
      }
    }
  }

  return parsedData;
}

function extractVPKFiles(vpkDir) {
  console.log("Извлечение VPK файлов");

  for (const f of vpkFiles) {
    let found = false;
    for (const path of vpkDir.files) {
      if (path.startsWith(f)) {
        let fileBuffer = vpkDir.getFile(path);
        const filepath = f.split("/");
        const fileName = filepath[filepath.length - 1];

        // Убираем BOM и конвертируем файл в строку
        const fileContent = trimBOM(fileBuffer).toString("utf-8");

        // Логируем файл, который обрабатывается
        console.log(`Обработка файла: ${fileName}`);

        try {
          // Используем кастомный парсер для более сложных файлов
          const parsedData = parseComplexVDF(fileContent);

          fs.writeFileSync(
            `${dir}/${fileName}.json`,
            JSON.stringify(parsedData, null, 4)
          );
        } catch (err) {
          console.error(
            `Ошибка при парсинге файла ${fileName}: ${err.message}`
          );
          fs.writeFileSync(`${dir}/${fileName}_error.txt`, fileContent);
        }

        found = true;
        break;
      }
    }

    if (!found) {
      console.error(`Не удалось найти ${f}`);
    }
  }
}

(async () => {
  if (process.argv.length != 4) {
    console.error(
      `Missing input arguments, expected 4 got ${process.argv.length}`
    );
    process.exit(1);
  }

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  if (!fs.existsSync(temp)) {
    fs.mkdirSync(temp);
  }

  const user = new SteamUser();

  console.log("Logging into Steam....");

  user.logOn({
    accountName: process.argv[2],
    password: process.argv[3],
    rememberPassword: true,
    logonID: 2121,
  });

  user.once("loggedOn", async () => {
    const manifests = await getManifests(user);

    if (!manifests[373301]) {
      console.error(`Manifest for depot 373301 could not be retrieved.`);
      process.exit(1);
    }

    const latestManifestId = manifests[373301].manifestId;

    console.log(
      `Obtained latest manifest ID for depot 373301: ${latestManifestId}`
    );

    let existingManifestId = "";

    try {
      existingManifestId = fs.readFileSync(`${dir}/${manifestIdFile}`, "utf8");
    } catch (err) {
      if (err.code != "ENOENT") {
        throw err;
      }
    }

    if (existingManifestId == latestManifestId) {
      console.log("Latest manifest ID matches existing manifest ID, exiting");
      process.exit(0);
    }

    console.log(
      "Latest manifest ID does not match existing manifest ID, downloading game files"
    );

    const vpkDir = await downloadVPKDir(user, manifests[373301]);

    const requiredIndices = getRequiredVPKFiles(vpkDir);

    await downloadVPKArchives(user, manifests, requiredIndices);
    extractVPKFiles(vpkDir);

    try {
      fs.writeFileSync(`${dir}/${manifestIdFile}`, latestManifestId);
    } catch (err) {
      throw err;
    }

    process.exit(0);
  });
})();
