const fs = require('fs');

const CWA_KEY = process.env.CWA_KEY;
const MOENV_KEY = process.env.MOENV_KEY;

const CWA_BASE = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/';

const DATASETS = [
  {
    file: 'observation.json',
    buildUrl: function () {
      return CWA_BASE + 'O-A0003-001' + '?Authorization=' + CWA_KEY;
    }
  },
  {
    file: 'forecast-3d.json',
    buildUrl: function () {
      return CWA_BASE + 'F-D0047-089' + '?Authorization=' + CWA_KEY;
    }
  },
  {
    file: 'uv.json',
    buildUrl: function () {
      return 'https://data.moenv.gov.tw/api/v2/uv_s_01?language=zh&limit=300&api_key=' + MOENV_KEY;
    }
  },
  {
    file: 'warning.json',
    buildUrl: function () {
      return CWA_BASE + 'W-C0033-001' + '?Authorization=' + CWA_KEY;
    }
  }
];

async function fetchDataset(ds) {
  const res = await fetch(ds.buildUrl());
  if (!res.ok) throw new Error(ds.id + ' 請求失敗，狀態碼 ' + res.status);
  const data = await res.json();
  fs.mkdirSync('data', { recursive: true });
  fs.writeFileSync('data/' + ds.file, JSON.stringify(data));
  console.log('完成：' + ds.file);
}

async function main() {
  let failed = false;
  for (const ds of DATASETS) {
    try { await fetchDataset(ds); }
    catch (err) { console.error(err.message); failed = true; } 
  }
  if (failed) process.exit(1);
}

main();