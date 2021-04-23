const fs = require('fs');
const http = require('https');
const path = require('path');

const sheetID = '1SVnCglYErLFX6s7UnCBhQaYFq2t5wlonL5XfALfJ-Cg';
const sheetType = ['General', 'Market', 'UserPage', 'Explorer', 'Network', 'Staking', 'Customer'];

const result = {};
const options = {
  'method': 'GET',
  'hostname': 'spreadsheets.google.com',
  'port': null,
  'headers': {
    'cache-control': 'no-cache'
  }
};

let execCnt = 0;

function writeAll() {
  let list = {
    ko: {},
    en: {}
  };

  let sortedResult = {};

  for(let sheet of sheetType) {
    sortedResult[sheet] = result[sheet];
  }

  for(let key in sortedResult) {
    for(let lang in list) {
      list[lang][key] = sortedResult[key][lang];
    }
  }

  let pathPrefix = './static/lang/';

  for(let key in list) {
    const filePath = pathPrefix + `${key}.json`;

    fs.writeFile(path.resolve(__dirname, filePath), JSON.stringify(list[key], null, 2), 'utf8', err => {
      if(err) throw err
    });
  }
}

for(let index = 0; index < sheetType.length; index++) {
  options.path = `/feeds/list/${sheetID}/${index + 1}/public/values?alt=json-in-script`;

  let req = http.request(options, function (res) {
    let chunks = [];
    let kor = {}, eng = {};

    res.on('data', function (chunk) {
      chunks.push(chunk);
    });

    res.on('end', function () {
      let body = Buffer.concat(chunks).toString();

      body = body.split('gdata.io.handleScriptLoaded(')[1]
      body = '[' + body
      body = body.replace(');', ']')

      try {
        let entry = JSON.parse(body)[0]['feed']['entry']

        for (let row of entry) {
          let key = row['title']['$t']

          if(row['gsx$kor'].hasOwnProperty('$t')) {
            let val = row['gsx$kor']['$t'] || ''
            let res = ''

            // :::으로 구분된 셀은 배열로 만들기
            // 단수, 복수 구분처럼 같은 문장이나 단어를 조금 다르게 표기해야할때 이용
            if(val.indexOf(' ::: ') !== -1) {
              val = val.split(' ::: ')
              res = []

              for(let o of val) {
                res.push(o)
              }
            } else if(val.indexOf(':::') !== -1) {
              val = val.split(':::')
              res = []

              for(let o of val) {
                res.push(o)
              }
            } else {
              res = val
            }

            kor[key] = res
          } else {
            kor[key] = ''
          }

          if(row['gsx$eng'].hasOwnProperty('$t')) {
            let val = row['gsx$eng']['$t'] || ''
            let res = ''

            if(val === '') {
              val = row['gsx$kor']['$t'] || ''
            }

            if(val.indexOf(' ::: ') !== -1) {
              val = val.split(' ::: ')
              res = []

              for(let o of val) {
                res.push(o)
              }
            } else if(val.indexOf(':::') !== -1) {
              val = val.split(':::')
              res = []

              for(let o of val) {
                res.push(o)
              }
            } else {
              res = val
            }

            eng[key] = res
          } else {
            eng[key] = row['gsx$kor']['$t'] || ''
          }
        }

        result[sheetType[index]] = {
          ko: kor,
          en: eng
        };

        execCnt += 1;

        if(execCnt === sheetType.length) {
          writeAll();
        }
      } catch(e) {
        throw e
      }
    });
  });

  req.end();
}
