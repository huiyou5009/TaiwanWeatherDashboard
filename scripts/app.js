const taiwanMap = {
    taiwan: document.querySelector('#taiwan'),
    keelung: document.querySelector('#keelung'),
    taipei: document.querySelector('#taipei'),
    new_taipei: document.querySelector('#new_taipei'),
    team_yilan: document.querySelector('.team_yilan'),
    taoyuan: document.querySelector('#taoyuan'),
    hsinchu_city: document.querySelector('#hsinchu_city'),
    hsinchu_county: document.querySelector('#hsinchu_county'),
    
    miaoli: document.querySelector('#miaoli'),
    taichung: document.querySelector('#taichung'),
    nantou: document.querySelector('#nantou'),
    changhua: document.querySelector('#changhua'),
    yunlin: document.querySelector('#yunlin'),
    
    chiayi_city: document.querySelector('#chiayi_city'),
    chiayi_county: document.querySelector('#chiayi_county'),
    tainan: document.querySelector('#tainan'),
    kaohsiung: document.querySelector('#kaohsiung'),
    team_pingtung: document.querySelector('.team_pingtung'),
    
    hualien: document.querySelector('#hualien'),
    team_taitung: document.querySelector('.team_taitung'),
    
    penghu: document.querySelector('#penghu'),
    kinmen: document.querySelector('#kinmen'),
    lianjiang: document.querySelector('#lianjiang'),
    
    map_countyArea: document.querySelectorAll('.map_countyArea'),
    singleG: document.querySelectorAll('.singleG'),
    satellitesG: document.querySelectorAll('.satellitesG'),
    independentG: document.querySelectorAll('.independentG'),
    mainIsland: document.querySelectorAll('.mainIsland'),
    offshoreIslands: document.querySelectorAll('.offshoreIslands'),
};

const info = {
    infoCounty: document.querySelector('#info_county'),
    updateTime: document.querySelector('#updateTime'),

    warnAll: document.querySelector('#warn_out'),
    warnICO: document.querySelector('#warnICO_MB'),
    warnTitle: document.querySelector('#warn_title'),
    warnTime: document.querySelector('#warn_time'),
    warnAreas: document.querySelector('#warn_areas'),
    warnMore: document.querySelector('#warn_more'),


    weatherICO: document.querySelector('#weatherICO_MB'),
    airTempDT: document.querySelector('#airTempDT'),
    WTconnect: document.querySelector('#WTconnect'),
    weatherDT: document.querySelector('#weatherDT'),

    FLtempDT: document.querySelector('#FLtempDT'),

    uvIndexDT: document.querySelector('#uvIndexDT'),
    uvLevelDT: document.querySelector('#uvLevelDT'),
    UVconnect: document.querySelector('#UVconnect'),
    
    RNrainfallDT: document.querySelector('#RNrainfallDT'),
    
    humidityDT: document.querySelector('#humidityDT'),
    
    windSpeed_out: document.querySelector('.windSpeed_out'),
    windSpeedDT: document.querySelector('#windSpeedDT'),
    windLevelDT: document.querySelector('#windLevelDT'),
    beaufortScale: document.querySelector('#beaufortScale'),
    windGustDT: document.querySelector('#windGustDT'),
    pointerICOin: document.querySelector('#pointerICO_in'),
    windDirectionDT: document.querySelector('#windDirectionDT'),
    
    sunriseDT: document.querySelector('#sunriseDT'),
    sunsetDT: document.querySelector('#sunsetDT'),

    toggleTR: document.querySelector('.toggleTR'),
    trendBTS_disable: document.querySelector('.trendBTS_disable'),
    tempBT: document.querySelector('#tempBT'),
    rainBT: document.querySelector('#rainBT'), 

    adviceICO_MB: document.querySelector('#adviceICO_MB'),
    advice_content: document.querySelector('#advice_content'),
        
    previewCardAll: document.querySelector('.previewCard_out'),
    PCweatherICO_MB: document.querySelector('#PCweatherICO_MB'),
    PCcounty: document.querySelector('#PCcounty'),
    PCtemp: document.querySelector('#PCtemp'),
    PCweather: document.querySelector('#PCweather'),

    subhead: document.querySelectorAll('.subhead'),
    initial_opacity: document.querySelectorAll('.initial_opacity'),
    initial_appear: document.querySelectorAll('.initial_appear'),
    initial_disappear: document.querySelectorAll('.initial_disappear'),
    trendBTS: document.querySelectorAll('.trendBTS'),

};

// 預定天氣項目&icon處理

const classifyWeather = (text) => {
    if (!text) return "unknown";      
    if (text.includes("雷")) return "thunder";
    if (text.includes("霧") || text.includes("靄")) return "fog";
    if (text.includes("雨")) return "rain";
    if (text.includes("多雲")) return "cloudy";     
    if (text.includes("陰")) return "overcast";
    if (text.includes("晴")) return "clear";   
    console.warn("未能歸類：", text);
    return "unknown";
};

const iconBelong = {
    clear: "sun", 
    cloudy: "cloudyPartly",
    overcast: "cloudyOvercast",
    thunder: "thunderStorm",
    rain: "rainHeavy",
    fog: "foggy",
    unknown: "default"
};

const weatherIcon = (category, isDaytime) => {
    let name = iconBelong[category]
    if(category === 'clear' && !isDaytime) name ='moon'
    return name
}

const replaceMist = (weather) => {
    if(weather.includes('靄')) return weather.replace(/(.+)靄$/, "$1薄霧");
    return weather;
};

const beaufortNames = [
  '無風', '軟風', '輕風', '微風', '和風', '清風', 
  '強風', '疾風', '大風', '烈風', '狂風', '暴風', '颶風'
];

const windSpeedToLevel = (ws) => {
    if (typeof ws !== 'number' || Number.isNaN(ws)) return null;
    if (ws <= 0) return 0;
    if (ws<= 5) return 1;
    if (ws <= 11) return 2;
    if (ws <= 19) return 3;
    if (ws <= 28) return 4;
    if (ws <= 38) return 5;
    if (ws <= 49) return 6;
    if (ws <= 61) return 7;
    if (ws <= 74) return 8;
    if (ws <= 88) return 9;
    if (ws <= 102) return 10;
    if (ws <= 117) return 11;
    if (ws <= 133) return 12;
    if (ws <= 149) return 13;
    if (ws <= 166) return 14;
    if (ws <= 183) return 15;
    if (ws <= 201) return 16;
    if (ws <= 220) return 17;
    return '超過17';
};

const levelToScale = (data) => {
    let bf = windSpeedToLevel(data)
    if (bf > 12 || bf === '超過17') bf=12
    if (bf === null) return '-';
    return beaufortNames[bf]  
};

const DIR8 = ["北風", "東北風", "東風", "東南風", "南風", "西南風", "西風", "西北風"];
const degToDIR = (deg) => {
    return deg === null ? null : DIR8[Math.round(deg / 45) % 8];
}; 

const uvIndexToLevel = (uvI) => {
    if (typeof uvI !== "number" || Number.isNaN(uvI)) return null;
    if (uvI <= 2) return "低量級";
    if (uvI <= 5) return "中量級";
    if (uvI <= 7) return "高量級";
    if (uvI <= 10) return "過量級";
    return "危險級"
};

const getLifeAdvice = (county) => {
    const obs = observationCache && observationCache[county];
    const fc  = forecastCache && forecastCache[county];
    const uv  = uvCache && uvCache[county];
    
    const warnList = (warningCache && warningCache[county]) || [];
    const rainChance = fc && fc.rainChance;
    const uvValue = uv && uv.value;
    const temp = obs && obs.temp;
    const windLevel = obs && obs.windSpeed != null ? windSpeedToLevel(obs.windSpeed) : null;
    const condition = obs && (obs.condition || (fc && fc.forecastCondition));
    
    if (warnList.length) return { icon: "warn", text: `發布<span class='warnQuote'>「</span>${warnList[0].name}<span class='warnQuote'>」</span>請留意戶外活動安全` };
    if (windLevel !== null && windLevel >= 6) return { icon: "windy", text: "風勢較強，騎行機慢車請留意強風側吹" };
    if (temp !== null && temp >= 36) return { icon: "tempHigh", text: "天氣炎熱，請注意防曬並補充水分，慎防中暑" };
    if (temp !== null && temp <= 15) return { icon: "tempLow", text: "氣溫偏低，記得添加衣物" };
    if (rainChance != null && rainChance >= 70) return { icon: "umbrella", text: "降雨機率高，出門記得帶傘" };
    if (uvValue != null && uvValue >= 8) return { icon: 'sunscreen', text: '紫外線偏強，做好防曬措施' };
    if (condition && (condition.includes("霧") || condition.includes("靄"))) return { icon: "foggy", text: "起霧影響能見度，行車請小心" };
    return { icon: "normal", text: "今日天氣穩定，適合外出" };
};


const otherCountiesWith = (name, county) => {
  return Object.keys(warningCache).filter(function (c) {
    return c !== county && warningCache[c].some(function (w) { return w.name === name; });
  });
};

const renderWarning = (county) => {
  const list = (warningCache && warningCache[county]) || [];
  if (!list.length) { info.warnAll.style.display = 'none'; return; }

  const top = list[0];
  info.warnAll.style.display = 'flex';
  info.warnAll.style.setProperty('--warn-color', top.color);  
  info.warnTitle.textContent = top.name;
  info.warnTime.textContent = '生效時間: ' + warnFmt(top.start) + ' ~ ' + warnFmt(top.end);

  const others = otherCountiesWith(top.name, county);
  info.warnAreas.textContent = others.length
    ? '同時發布：' + others.slice(0, 2).join('、') + (others.length > 2 ? ' 等（+' + (others.length - 2) + '）' : '')
    : '';
  info.warnMore.textContent = list.length > 1
    ? '另有：' + list.slice(1).map(function (w) { return w.name; }).join('、')
    : '';
  if (!info.warnAreas.textContent.length) { info.warnAreas.style.display = "none";} else { info.warnAreas.style.display = "block";};
  if (!info.warnMore.textContent.length) { info.warnMore.style.display = "none";} else { info.warnMore.style.display = "block";};
};

const markWarningCounties = () => {
  document.querySelectorAll('.map_countyArea').forEach(function (el) {
    const list = (warningCache && warningCache[el.dataset.county]) || [];
    el.classList.toggle('isWarning', list.length > 0);
    el.classList.toggle("isAlert", list.length > 0 && list[0].significance === "警報")
    if (list.length) el.style.setProperty("--warn-color", list[0].color);
    else el.style.removeProperty("--warn-color");
  });
}

const warnTime = (str) => {
  return new Date(str.replace(' ', 'T') + '+08:00').getTime();
};

const warnFmt = (str) => {
  return str.slice(5, 16).replace('-', '/');
};

const warn_colors = {
  alert: "#ec788c"  , rain: "#ebae52",
  heat: "#e6de72", cold: "#82c8d1",
  wind: "#a0dfc8", fog: "#d4d2d6",
  generic:"#b7ce81"
  // info:  "#e6de72"
  // generic:"#ccb7d4"
  // alert: "#e5484d"   #e7b5ce"   #e66384
};

const warnColor = (sort) => {
  const p = sort.phenomena;
  if (sort.significance === "警報") return warn_colors.alert;
  if (p.includes("高溫")) return warn_colors.heat;
  if (p.includes("低溫")) return warn_colors.cold;
  if (p.includes("雨")) return warn_colors.rain;
  if (p.includes("強風")) return warn_colors.wind;
  if (p.includes("霧")) return warn_colors.fog;
  return warn_colors.generic
  // return sort.significance === "資訊" ? warn_colors.info : warn_colors.generic;
};

const warnPriority = (sort) => {
  let score = { "警報":200, "特報":100 }[sort.significance] || 0;
  const p = sort.phenomena;
  if (p.includes("颱風")) score += 50;
  else if (p.includes("豪雨")) score += 40;
  else if (p.includes("大雨")) score += 30;
  else if (p.includes("強風")) score += 20;
  else score += 10;
  return score;
};



// 資料換算整理

const toNum = (word) => {
  if (word === null || word === undefined || word === '') return null;
  const n = Number(word);
  if (Number.isNaN(n) || n <= -99) return null; 
  return n;
};

const msToKmh = (ms) => {
  return ms === null ? null : Math.round(ms * 3.6);
};

const hhmm = (time) => { return time.slice(11, 16); };

const todayKey = () => {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Taipei' });
};

const pickValue = (entry, key) => { return toNum(entry.ElementValue[0][key]); };

const getPointAT = (list, nowMs) => {
  let index = 0;
  list.forEach(function (t, i) {
    if (new Date(t.DataTime).getTime() <= nowMs) index = i;
  });
  return index;
};

const getPeriodAT = (list, nowMs) => {
  return list.findIndex(function (t) {
    return new Date(t.StartTime).getTime() <= nowMs && nowMs < new Date(t.EndTime).getTime();
  });
}



// 資料更替
const show = (value, unit) => {
    return value === null || value === undefined ? '--' : value + (unit || '');
};

const overWriteData = (data) =>{
    Object.keys(info).forEach((el) => {
        if(data[el]){
            info[el].textContent = data[el]
        }
    });

    const sun = getSunTimes(data.county);
    const fc = forecastCache && forecastCache[data.county];
    const uv = uvCache && uvCache[data.county];
    const advice = getLifeAdvice(data.county);

    info.infoCounty.textContent = show(data.county);
    info.airTempDT.textContent = show(data.temp, "°C");
    info.WTconnect.textContent = "‧";
    info.weatherDT.textContent = data.condition || (fc && fc.forecastCondition) || null;
    info.weatherICO.setAttribute("href", "#weather_" + data.wICO);

    info.FLtempDT.textContent  = show(fc && fc.feelsLike, "°C")
    info.RNrainfallDT.textContent = show(fc && fc.rainChance, "%");
    info.humidityDT.textContent = show(data.humidity, "%");
    
    info.uvIndexDT.textContent = uv ? show(uv.value) : "--";
    if (uv !== null) { info.UVconnect.textContent = "‧" };
    info.uvLevelDT.textContent = uvIndexToLevel(uv.value);
    
    info.sunriseDT.textContent = show(sun && sun.sunrise);
    info.sunsetDT.textContent  = show(sun && sun.sunset);
    info.updateTime.textContent = "更新於 " + data.updatedAt;
    
    info.windSpeedDT.textContent = show(data.windSpeed);
    info.windDirectionDT.textContent = show(data.windDirection);
    info.windGustDT.textContent = show(data.gust);
    info.windLevelDT.textContent = show(data.windLevel);
    info.beaufortScale.textContent = show(data.beaufortScale);
    info.pointerICOin.style.transform = `translate(-50%, -50%) rotate(${data.windDegree}deg)`;
    
    info.adviceICO_MB.setAttribute("href", "#advice_" + advice.icon);
    info.advice_content.innerHTML = advice.text;

    renderWarning(data.county)
};



// 首選
const preferredStation = {
    '基隆市': '466940',
    '臺北市': '466920',
    '新北市': '466881',
    '桃園市': 'C2C480',
    '宜蘭縣': '467080',
    '新竹市': 'CAD110',
    '新竹縣': '467571', 
    '苗栗縣': 'CAE020',
    '臺中市': '467490',
    '南投縣': 'CAH010',
    '彰化縣': 'A0G720',
    '雲林縣': 'C2K620',
    '嘉義市': '467480',
    '嘉義縣': 'C2M920',
    '臺南市': '467410',
    '高雄市': '467441',
    '屏東縣': 'C2R170',
    '花蓮縣': '466990',
    '臺東縣': '467660',
    '澎湖縣': '467350',
    '金門縣': '467110',
    '連江縣': '467990'
};

const preferredUVsitenames = {
      '基隆市': '基隆',
      '臺北市': '臺北',
      '新北市': '新北',
      '桃園市': '新屋',
      '宜蘭縣': '宜蘭',
      '新竹市': '新竹',
      '新竹縣': '新竹', 
      '苗栗縣': '後龍',
      '南投縣': '日月潭',
      '臺中市': '臺中',
      '彰化縣': '田中',
      '雲林縣': '古坑',
      '嘉義市': '嘉義',
      '嘉義縣': '鹿林山',
      '臺南市': '臺南',
      '高雄市': '高雄',
      '屏東縣': '恆春',
      '花蓮縣': '花蓮',
      '臺東縣': '臺東',
      '澎湖縣': '澎湖',
      '金門縣': '金門',
      '連江縣': '馬祖'
};



let mouseX = 0, mouseY = 0;
const PC = info.previewCardAll
let hoverINGcounty = null
let selectINGcounty = null
let dataStatus = "loading";
let observationCache = null; 
let suntimeCache = null;
let forecastCache = null;
let uvCache = null;
let warningCache = null;


const debounce = (fn, delay)=>{
    let timer
    return function(...args){
        clearTimeout(timer);
        timer = setTimeout(
            function() {
               fn.apply(this, args)   ;         
            }
            , delay );
    };
};

const showPreviewCard = (data) =>{
  PC.style.left = (mouseX + 15) + 'px';
  PC.style.top = (mouseY + 15) + 'px';
  PC.style.display = 'flex';
  
  info.PCcounty.textContent = show(data.county);
  info.PCtemp.innerHTML = `${data.temp}<span style="font-size: 13px">°C</span>` || "--";
  info.PCweather.textContent = data.condition || '無資料';
  info.PCweatherICO_MB.setAttribute('href', '#weather_' + data.wICO);
};

const debounceShowPC = debounce(
  function (countyName){
      if(hoverINGcounty !== countyName) return;
      if(countyName === selectINGcounty) return;
      const data = observationCache && observationCache[countyName];
      if (!data) return;
      showPreviewCard(data)
  }, 300
);

const hidePreviewCard = () =>{
    PC.style.display = 'none'
};


const setActiveCounty = (countyEl) => {
  document.querySelectorAll(".map_countyArea.isActive, .map_countyArea.isActiveOSI").forEach(function(el){
    el.classList.remove("isActive", "isActiveOSI");
  });

  
  if (countyEl.classList.contains("independentG")){
    countyEl.classList.add("isActiveOSI");
    return;
  }

  countyEl.classList.add("isActive");

  if (countyEl.parentNode.lastElementChild !== countyEl) {
    countyEl.parentNode.appendChild(countyEl);
  };

}



// hover IN 

taiwanMap.taiwan.addEventListener('mouseover', function (e) {
    const countyEl = e.target.closest('.map_countyArea');
    if (!countyEl || countyEl.contains(e.relatedTarget)) return;
    mouseX = e.clientX;
    mouseY = e.clientY;
    hoverINGcounty = countyEl.dataset.county;
    debounceShowPC(hoverINGcounty)
});


// hover OUT

taiwanMap.taiwan.addEventListener('mouseout', function (e) {
    const countyEl = e.target.closest('.map_countyArea');
    if (!countyEl || countyEl.contains(e.relatedTarget)) return;
    hoverINGcounty = null;
    hidePreviewCard();
});


// clicked 

const patrolTarget = (selector, styleProp, value) => {
    const item = document.querySelectorAll(selector)
    if(!item) return;
    item.forEach((el) => {
        el.style[styleProp] = value
    });
};

taiwanMap.taiwan.addEventListener('click', function (e) {
    const countyEl = e.target.closest('.map_countyArea');
    if (!countyEl) return;
    
    selectINGcounty = countyEl.dataset.county
    const data = observationCache && observationCache[selectINGcounty];
    if (!data) return
    hidePreviewCard()
    overWriteData(data)
    updateChart();
    setActiveCounty(countyEl)
});

taiwanMap.taiwan.addEventListener('click', function (e) {
  const countyEl = e.target.closest('.map_countyArea');
  if (!countyEl) return;
  patrolTarget('.subhead', 'color', '#948cb8'),
  patrolTarget('.initial_opacity', 'opacity', '1'),
  patrolTarget('.initial_appear', 'display', 'none'),
  patrolTarget('.toggleTR', 'cursor', 'pointer'),
  patrolTarget('.trendBTS', 'cursor', 'pointer')

  const clickedAppear = document.querySelectorAll('.clickedAppear');
  clickedAppear.forEach(el => {
      el.classList.remove('initial_disappear');
  });

  const windSpeedText = info.windSpeedDT.innerText.trim();
  if (windSpeedText.length === 3){
      info.windSpeedDT.style.fontSize = '32px';
      info.windSpeed_out.style.flexDirection = 'column'
      info.windSpeed_out.style.alignItems = 'center'
  }
  else if (windSpeedText.length === 2){
      info.windSpeedDT.style.fontSize = '34px';
      info.windSpeed_out.style.flexDirection = '';
      info.windSpeed_out.style.alignItems = '';
  }
  else{
      info.windSpeedDT.style.fontSize = '';
      info.windSpeed_out.style.flexDirection = '';
      info.windSpeed_out.style.alignItems = '';

  }

  const windLevelText = info.windLevelDT.innerText.trim();
  if (windLevelText.length > 3){

      info.windLevelDT.classList.remove('LRword1');
      info.windLevelDT.style.fontSize = '18px';
  } 
  else {
      info.windLevelDT.classList.add('LRword1')
      info.windLevelDT.style.fontSize = ''; 
  }    
});

info.trendBTS.forEach(function (e) {
  e.addEventListener('click', function () {
    if (selectINGcounty === null) return; 
    currentMetric = e.dataset.metric; 
    updateChart();
  });
});

const toggleBT = (on, off) => {
    on.classList.add('toggleON');
    on.classList.remove('toggleOFF');

    off.classList.add('toggleOFF');
    off.classList.remove('toggleON');
};

info.tempBT.addEventListener('click', ()=>{
    if(!selectINGcounty) return;
    toggleBT(info.tempBT, info.rainBT)
})

info.rainBT.addEventListener('click', ()=>{
    if(!selectINGcounty) return;
    toggleBT(info.rainBT, info.tempBT)
})





const transformObservation = (rawData) => {
  const result = {};
  const byCounty = {};   // 首選站失效時才需用到

  rawData.records.Station.forEach(function (s) {
    const county = s.GeoInfo.CountyName;
    if (!byCounty[county]) byCounty[county] = [];
    byCounty[county].push(s);
  });

  Object.keys(preferredStation).forEach(function (county) {
    const wanted = preferredStation[county];
    const stations = byCounty[county] || [];

    let chosen = stations.find(function (s) {
    return s.StationId === wanted && toNum(s.WeatherElement.AirTemperature) !== null;
    });
    let isPreferred = !!chosen;

    if (!chosen) {
    const candidates = stations.filter(function (s) {
        return toNum(s.WeatherElement.AirTemperature) !== null;
    });
    chosen = candidates.reduce(function (low, s) {
        const alt = toNum(s.GeoInfo.StationAltitude) || 0;
        const lowAlt = toNum(low.GeoInfo.StationAltitude) || 0;
        return alt < lowAlt ? s : low;
    }, candidates[0]);
    if (chosen) console.warn(county + '：首選站 ' + wanted + ' 沒有氣溫資料，改用 ' + chosen.StationName);
    }

    if (!chosen) return;

    const w = chosen.WeatherElement;
    const dateTime = chosen.ObsTime.DateTime;
    const hour = Number(dateTime.slice(11, 13));
    const isDaytime = (hour >= 6 && hour < 18);
    const deg = toNum(w.WindDirection);
    const condition = w.Weather === '-99' ? null : w.Weather;
    const weatherCategory = classifyWeather(condition);
    const temp = toNum(w.AirTemperature);
    const windSpeed = msToKmh(toNum(w.WindSpeed));
    const gustData = w.GustInfo ? w.GustInfo.PeakGustSpeed : null;
    result[county] = {
        county: county,
        stationId: chosen.StationId,
        station: chosen.StationName,
        isPreferred: isPreferred,
        altitude: toNum(chosen.GeoInfo.StationAltitude) || 0,
        updatedAt: dateTime.slice(11, 16), 
        isDaytime: isDaytime,
        temp: temp,
        condition:  replaceMist(condition),
        weatherCategory: weatherCategory,
        wICO: weatherIcon(weatherCategory, isDaytime),
        humidity: toNum(w.RelativeHumidity),
        windSpeed: windSpeed,
        windLevel: windSpeedToLevel(windSpeed),
        beaufortScale: levelToScale(windSpeed),
        gust: msToKmh(toNum(gustData)),
        windDegree: deg,
        windDirection: degToDIR(deg),
        // uvIndex: toNum(w.UVIndex),
      }; 
    });
    return result;
};


const transformForecast3d = (rawData) => {
  const now = Date.now();
  const result = {};

  rawData.records.Locations[0].Location.forEach(function (loc) {
    function getTimes(name) {
      const el = loc.WeatherElement.find(function (e) { return e.ElementName === name; });
      return el ? el.Time : [];
    }

    const tempList = getTimes('溫度');
    const feelList = getTimes('體感溫度');
    const t0 = getPointAT(tempList, now);

    let hourlyTemp = [];
    if (tempList.length) {
      const startMs = new Date(tempList[t0].DataTime).getTime();
      hourlyTemp = tempList.filter(function (t) {
          const ms = new Date(t.DataTime).getTime();
          return ms >= startMs && ms < startMs + 24 * 3600 * 1000;
      }).map(function (t) {
          return { time: hhmm(t.DataTime), value: pickValue(t, 'Temperature') };
      });
    };

    const feelsLike = feelList.length
      ? pickValue(feelList[getPointAT(feelList, now)], 'ApparentTemperature')
      : null;

    const rainList = getTimes('3小時降雨機率');
    const r0 = getPeriodAT(rainList, now);
    const rain3h = (r0 === -1 ? [] : rainList.slice(r0, r0 + 8)).map(function (t) {
      return { time: hhmm(t.StartTime), value: pickValue(t, 'ProbabilityOfPrecipitation') };
    });
    const rainChance = rain3h.length ? rain3h[0].value : null;

    const wxList = getTimes('天氣現象');
    const w0 = getPeriodAT(wxList, now);
    const forecastCondition = w0 === -1 ? null : wxList[w0].ElementValue[0].Weather;

    result[loc.LocationName] = {
      feelsLike: feelsLike,
      rainChance: rainChance,
      hourlyTemp: hourlyTemp,          
      rain3h: rain3h,                  
      forecastCondition: forecastCondition
    };
  });

  return result;
}


const transformUV = (rawData) => {
  const byStationName = {}; 

  rawData.forEach(function (r) {
    const site = r.sitename;
    if (!byStationName[site]) byStationName[site] = [];
    byStationName[site].push({
      value: toNum(r.uvi),  
      time: r.datacreationdate
    });
  });

  const result = {};
  Object.keys(preferredUVsitenames).forEach(function (county) {
    const wanted = preferredUVsitenames[county];
    const list = byStationName[wanted];

    if (!list) {
      console.warn(county + '：指定站 ' + wanted + ' 在這批資料裡完全沒出現');
      result[county] = null;
      return;
    }

    list.sort(function (a, b) { return new Date(b.time) - new Date(a.time); });

    const found = list.find(function (p) { return p.value !== null; });

    result[county] = found ? { value: found.value, time: found.time, site: wanted } : null;
  });
    

  return result;
};


const transformWarning = (rawData) => {
  const now = nowMs();
  const result = {};  

  rawData.records.location.forEach(function (loc) {
    const hazards = (loc.hazardConditions && loc.hazardConditions.hazards) || [];
    result[loc.locationName] = hazards
      .filter(function (h) { return warnTime(h.validTime.endTime) > now; })   // 濾過期
      .map(function (h) {
        return {
          name: h.info.phenomena + h.info.significance,
          significance: h.info.significance,
          start: h.validTime.startTime,
          end: h.validTime.endTime,
          score: warnPriority(h.info),
          color: warnColor(h.info)
        };
      })
      .sort(function (a, b) { return b.score - a.score; });
  });

  return result;
};





const loadJson = (url) => {
  return fetch(url, { cache: 'no-store' }).then(function (res) {
    if (!res.ok) throw new Error(url + ' 請求失敗，狀態碼 ' + res.status);
    return res.json();
  });
};


const loadObservation = () => {
  return loadJson('data/observation.json')
    .then(function (rawData) {
        observationCache = transformObservation(rawData);
        dataStatus = 'ready';
        document.querySelectorAll('.map_countyArea').forEach(function (el) {
          if (!observationCache[el.dataset.county]) console.warn('對不到資料：', el.dataset.county);
        });
        
        if (selectINGcounty!== null && observationCache[selectINGcounty]) {
            overWriteData(observationCache[selectINGcounty]);
        };
  })
  .catch(function (err) {
      console.error('觀測資料載入失敗', err);
      if (observationCache === null) dataStatus = 'error';  
    });
};


const loadSun = () => {
    const year = new Date().getFullYear();
    return loadJson('data/suntime-' + year + '.json')
        .then(function (rawData) { suntimeCache = rawData;})
        .catch(function (err) { console.warn('日出日落資料載入失敗', err); });  
};


const loadForecast = () => {
  return loadJson('data/forecast-3d.json')
    .then(function (rawData) { forecastCache = transformForecast3d(rawData);
      if (selectINGcounty !== null) updateChart();
     })
    .catch(function (err) { console.warn('預報資料載入失敗', err); });  
};


const loadUV = () => {
  return loadJson('data/uv.json')
    .then(function (rawData) { uvCache = transformUV(rawData); })
    .catch(function (err) { console.warn('紫外線資料載入失敗', err); });
};

const getSunTimes = (county) => {
    if (!suntimeCache || !suntimeCache[county]) return null;
    const row = Object.entries(suntimeCache[county]).find(function ([date]) { return date === todayKey(); });
    return row ? { sunrise: row[1].Sunrise, sunset: row[1].Sunset } : null;
};


// const NOW_OVERRIDE = new Date('20yy-mm-ddT20:00:00+08:00').getTime();  //擷取資料前有效時間
const NOW_OVERRIDE = null;
function nowMs() { return NOW_OVERRIDE || Date.now(); }

const loadWarning = () => {
  return loadJson('data/warning.json')
    .then(function (rawData) {
      warningCache = transformWarning(rawData);
      markWarningCounties();       
      if (selectINGcounty !== null) renderWarning(selectINGcounty);
    })
    .catch(function (err) { console.warn('特報資料載入失敗', err); });
};





loadObservation();
loadSun();
loadForecast();
loadUV();
loadWarning();
setInterval(loadObservation, 10 * 60 * 1000);
setInterval(loadForecast, 10 * 60 * 1000);
setInterval(loadUV, 10 * 60 * 1000);
setInterval(loadWarning, 5 * 60 * 1000);





const chartMetrics = {
  temp: { label: '氣溫變化', unit: '°C', color: '#a8d3b9',  bg: 'transparent',
    highlight: '#3fad6b' ,pick: function (e) { return e.hourlyTemp; },
          note: '逐小時預報，非實測' },
  rain: { label: '降雨機率', unit: '%', color: '#deafe4', bg: 'transparent',
    highlight: '#f87b96' , pick: function (e) { return e.rain3h; },
    note: '每 3 小時為一段的預報，非實測' }
};

const clickRemind = document.querySelector('#clickRemind');
const updateRemind = document.querySelector('#updateRemind');
let currentMetric = 'temp';
let trendChart = null;

const updateChart = () => {
    if (!trendChart) return;
    const fc = forecastCache && selectINGcounty && forecastCache[selectINGcounty];
    const m = chartMetrics[currentMetric];
    const series = fc ? m.pick(fc) : [];

    if (!series.length) {                  
        clickRemind.textContent = selectINGcounty ? '這個縣市暫無預報資料' : '請先選擇縣市';
        clickRemind.style.display = 'flex';
        trendChart.data.labels = [];
        trendChart.data.datasets[0].data = [];
        trendChart.update();
        updateRemind.textContent = '';
        return;
    };

    clickRemind.style.display = 'none';
    const ds = trendChart.data.datasets[0];
    trendChart.data.labels = series.map(function (p) { return p.time; });
    ds.data = series.map(function (p) { return p.value; });
    ds.clip = 8;

    ds.label = m.label;
    ds.borderColor = m.color;
    ds.backgroundColor = m.bg;
    ds.pointBackgroundColor = m.color;
    

    const maxVal = Math.max.apply(null, ds.data);
    const minVal = Math.min.apply(null, ds.data);
    const maxIdx = ds.data.indexOf(maxVal);
    const minIdx = ds.data.indexOf(minVal);

    ds.pointBackgroundColor = ds.data.map(function (v, i) {
    return (i === maxIdx || i === minIdx) ? m.highlight : m.color;
    });
    ds.pointBorderColor = ds.data.map(function (v, i) {
    return (i === maxIdx || i === minIdx) ? m.highlight : m.color;
    });
    ds.pointRadius = ds.data.map(function (v, i) {
    return (i === maxIdx || i === minIdx) ? 4 : 2;  
    });

    const y = trendChart.options.scales.y;

    if (currentMetric === 'rain') {
        y.min = -4; y.max = 100;
        y.ticks.stepSize = 25; 
        y.grace = 0;
        y.ticks.callback = function (value) {
            return value >= 0 ? value : '';  
        };
        } else {
        y.min = undefined; y.max = undefined; y.ticks.stepSize = undefined; y.ticks.callback = undefined;
        y.grace = '15%';
        }

    trendChart.update();
    updateRemind.textContent = m.note;

    // console.log(forecastCache[selectINGcounty].hourlyTemp )
    // console.log(forecastCache[selectINGcounty].rain3h )
};

const rectTouchesLine = (rect, pts) => {
  const pad = 4;  
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const steps = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 3));
    for (let s = 0; s <= steps; s++) {
      const x = a.x + (b.x - a.x) * s / steps;
      const y = a.y + (b.y - a.y) * s / steps;
      if (x >= rect.l - pad && x <= rect.r + pad && y >= rect.t - pad && y <= rect.b + pad) return true;
    }
  }
  return false;
};

const rectsOverlap = (a, b) => {
  return a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;
};

const getLabelPosition = (chart, pts, point, text, isMax, placed) => {
    const area = chart.chartArea;
    const w = chart.ctx.measureText(text).width; 
    const h = 14;

    const dirs = isMax
        ? [[0, -1], [1, -1], [-1, -1], [1, 0], [-1, 0], [1, 1], [-1, 1], [0, 1]]
        : [[0, 1], [1, 1], [-1, 1], [1, 0], [-1, 0], [1, -1], [-1, -1], [0, -1]];
    const gaps = [8, 14, 22, 30];   

    let fallback = null;
    for (let g = 0; g < gaps.length; g++) {
        for (let k = 0; k < dirs.length; k++) {
        const dx = dirs[k][0], dy = dirs[k][1];
        let cx = dx === 0 ? point.x : point.x + dx * (gaps[g] + w / 2);
        const cy = dy === 0 ? point.y : point.y + dy * (gaps[g] + h / 2);

        cx = Math.min(Math.max(cx, area.left + w / 2), area.right - w / 2);

        const rect = { l: cx - w / 2, r: cx + w / 2, t: cy - h / 2, b: cy + h / 2 };

        const inside = rect.t >= area.top - 6 && rect.b <= area.bottom;
        if (!inside) continue;
        if (!fallback) fallback = { x: cx, y: cy, rect: rect };  

        const hitsLine = rectTouchesLine(rect, pts);
        const hitsOther = placed.some(function (p) { return rectsOverlap(rect, p); });
        if (!hitsLine && !hitsOther) return { x: cx, y: cy, rect: rect };
        }
    }
    return fallback || { x: point.x, y: point.y - 12,
        rect: { l: point.x - w / 2, r: point.x + w / 2, t: point.y - 19, b: point.y - 5 } };
};

const minMaxLabelPlugin = {
  id: 'minMaxLabel',
  afterDatasetsDraw: function (chart) {
    const meta = chart.getDatasetMeta(0);
    const data = chart.data.datasets[0].data;
    const nums = data.filter(function (v) { return v !== null && v !== undefined; });
    if (!nums.length) return;

    const maxIdx = data.indexOf(Math.max.apply(null, nums));
    const minIdx = data.indexOf(Math.min.apply(null, nums));
    const idxList = maxIdx === minIdx ? [maxIdx] : [maxIdx, minIdx];  

    const m = chartMetrics[currentMetric];
    const pts = meta.data.filter(function (p) { return p && !p.skip; });
    const placed = [];                                                  

    const ctx = chart.ctx;
    ctx.save();
    ctx.font = "bold 15px 'Inter'";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = m.highlight;

    idxList.forEach(function (idx) {
      const point = meta.data[idx];
      if (!point) return;
      const text = data[idx] + m.unit;
      const pos = getLabelPosition(chart, pts, point, text, idx === maxIdx, placed);
      placed.push(pos.rect);
      ctx.fillText(text, pos.x, pos.y);
    });
    ctx.restore();
  }
};

document.fonts.ready.then(function () {
  if (trendChart) trendChart.update();
});

if (typeof Chart !== 'undefined') {
  trendChart = new Chart(document.querySelector('#chart_MB'), {
      type: 'line',
      data: {
      labels: [],
      datasets: [{ data: [], borderWidth: 2, tension: 0.35, fill: true, pointRadius: 2 }]
      },
      options: {
          layout: {
              padding: { top: 15 } 
          },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
              legend: { display: false },        // 標題和分頁你自己用 HTML 做了，不需要圖例
              tooltip: {
              callbacks: {                     // 滑過資料點時顯示的文字
                  label: function (ctx) { return ctx.parsed.y + chartMetrics[currentMetric].unit; }
              },
              bodyFont: { family: "'Inter','Chiron GoRound TC', sans-serif" } 
              }
          },
          scales: {
              x: {
              grid: { display: false },
              ticks: { padding: 0, color: '#767f9b', maxTicksLimit: 8, maxRotation: 0 
                ,font: { family: "'Inter','Chiron GoRound TC', sans-serif", size: 12 }} 
              },
              y: {
              grid: { color: '#262e40', borderDash: [2, 3] },       
              ticks: { color: '#767f9b', maxTicksLimit: 4 
                ,font: { family: "'Inter','Chiron GoRound TC', sans-serif", size: 12 }} 
              },   
          }
      },
      plugins: [minMaxLabelPlugin]
  });
};
