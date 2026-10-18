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

    warnAll: document.querySelector('.warn_out'),
    warnICO: document.querySelector('#warnICO_MB'),
    warnTitle: document.querySelector('#warn_title'),
    warnrTime: document.querySelector('#warn_time'),
    warnPlace: document.querySelector('#warn_place'),

    weatherICO: document.querySelector('#weatherICO_MB'),
    airTempDT: document.querySelector('#airTempDT'),
    WTconnect: document.querySelector('#WTconnect'),
    weatherDT: document.querySelector('#weatherDT'),

    FLtempDT: document.querySelector('#FLtempDT'),

    uvDT: document.querySelector('#uvDT'),

    RNrainfallDT: document.querySelector('#RNrainfallDT'),
    
    humidityDT: document.querySelector('#humidityDT'),
    
    windSpeedDT: document.querySelector('#windSpeedDT'),
    beaufortDT: document.querySelector('#beaufortDT'),
    beaufortScale: document.querySelector('#beaufortScale'),
    windGustDT: document.querySelector('#windGustDT'),
    pointerICO_MB: document.querySelector('#pointerICO_MB'),
    
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



const overWriteData = (data) =>{
    Object.keys(info).forEach((el) => {
        // info[el].textContent = data[el]
        // console.log(el)
        if(data[el]){
            info[el].textContent = data[el]
            console.log(el)
        }
    });
}




let mouseX = 0, mouseY = 0;
const PC = info.previewCardAll
let hoverINGcounty = null
let selectINGcounty = null

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


function makeFakeData(countyName) {
  return { 
    PCcounty: countyName, 
    PCtemp: Math.round(15 + Math.random() * 15),
    humidityDT: Math.round(60 + Math.random() * 15),
     };
    
}

const showPreviewCard = (data) =>{
    PC.textContent = data.PCcounty + '　' + data.PCtemp + '°C';
    PC.style.left = (mouseX + 15) + 'px';
    PC.style.top = (mouseY + 15) + 'px';
    PC.style.display = 'flex';
}
const debounceShowPC = debounce(
    function (countyName){
        if(hoverINGcounty !== countyName) return;
        showPreviewCard(makeFakeData(countyName))
    }, 300
);

const hidePreviewCard = () =>{
    PC.style.display = 'none'
}


// hover IN 

taiwanMap.taiwan.addEventListener('mouseover', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
})

taiwanMap.taiwan.addEventListener('mouseover', function (e) {
    const countyEl = e.target.closest('.map_countyArea');
    if (!countyEl || countyEl.contains(e.relatedTarget)) return;
    // console.log(countyEl.dataset.name)
    hoverINGcounty = countyEl.dataset.name
    // console.log("hoverINGcounty:" + hoverINGcounty)
    debounceShowPC(hoverINGcounty)
})


// hover OUT

taiwanMap.taiwan.addEventListener('mouseout', function (e) {
    const countyEl = e.target.closest('.map_countyArea');
    if (!countyEl || countyEl.contains(e.relatedTarget)) return;
    // console.log(countyEl.dataset.name)
    hoverINGcounty = null
    // console.log("hoverINGcounty:" + hoverINGcounty)
    hidePreviewCard()
})


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
    patrolTarget('.subhead', 'color', '#948cb8'),
    patrolTarget('.initial_opacity', 'opacity', '1'),
    patrolTarget('.initial_appear', 'display', 'none'),
    patrolTarget('.initial_disappear', 'display', ''),
    patrolTarget('.toggleTR', 'cursor', 'pointer'),
    patrolTarget('.trendBTS', 'cursor', 'pointer')
        
})

taiwanMap.taiwan.addEventListener('click', function (e) {
    const countyEl = e.target.closest('.map_countyArea');
    if (!countyEl) return;
    // console.log(countyEl.dataset.name)
    selectINGcounty = countyEl.dataset.name
    // console.log("hoverINGcounty:" + hoverINGcounty)
    hidePreviewCard()
    overWriteData(makeFakeData(selectINGcounty))
})

info.trendBTS.forEach(function (e) {
  e.addEventListener('click', function () {
    if (selectINGcounty === null) return;  
  });
});

const toggleBT = (on, off) => {
    on.classList.add('toggleON');
    on.classList.remove('toggleOFF');

    off.classList.add('toggleOFF');
    off.classList.remove('toggleON');
};

info.tempBT.addEventListener('click', ()=>{
    const countyEl = e.target.closest('.map_countyArea');
    if (!countyEl) return;
    toggleBT(info.tempBT, info.rainBT)
})

info.rainBT.addEventListener('click', ()=>{
    const countyEl = e.target.closest('.map_countyArea');
    if (!countyEl) return;
    toggleBT(info.rainBT, info.tempBT)
})




// organize  data


const toNum = (word) => {
  if (word === null || word === undefined || word === '') return null;
  const n = Number(word);
  if (Number.isNaN(n) || n === -99) return null; 
  return n;
};

const msToKmh = (ms) => {
  return ms === null ? null : Math.round(ms * 3.6);
};


const DIR8 = ['北風', '東北風', '東風', '東南風', '南風', '西南風', '西風', '西北風'];
const degToDIR = (deg) => {
    return deg === null ? null : DIR8[Math.round(deg / 45) % 8];
}; 

const classifyWeather = (text) => {
    if (!text) return 'unknown';      
    if (text.includes('雷')) return 'thunder';
    if (text.includes('霧') || text.includes('靄')) return 'fog';
    if (text.includes('雨')) return 'rain';
    if (text.includes('多雲')) return 'cloudy';     
    if (text.includes('陰')) return 'overcast';
    if (text.includes('晴')) return 'clear';   
    console.warn('未能歸類：', text);
    return 'unknown';
};

const iconBelong = {
    clear: 'sun', 
    cloudy: 'cloudyPartly',
    overcast: 'cloudyOvercast',
    thunder: 'thunderStorm',
    rain: 'rainHeavy',
    fog: 'foggy',
    unknown: 'default'
};

const weatherIcon = (category, isDaytime) => {
    let name = iconBelong[category]
    if(category === 'clear' && !isDaytime) name ='moon'

    info.weatherICO.setAttribute('href', '#weather_' + name)
}

const perferredStation = {
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

const transformObservatio = (data) => {
    const candidates = {}; 

    data.records.Station.forEach(function (s) {
        const w = s.WeatherElement;
        const temp = toNum(w.AirTemperature);
        if (temp === null) return; 

        const county = s.GeoInfo.CountyName;
        const altitude = toNum(s.GeoInfo.StationAltitude);
        const dateTime = s.ObsTime.DateTime;
        const hour = Number(dateTime.slice(11, 13));
        const deg = toNum(w.WindDirection);
        const condition = w.Weather === '-99' ? null : w.Weather;
        const gustData = w.GustInfo ? w.GustInfo.PeakGustSpeed : null;

        if (!candidates[county]) candidates[county] = [];
        candidates[county] = ({
            county: county,
            station: s.StationName,
            altitude: altitude === null ? 0 : altitude,
            updatedAt: dateTime.slice(11, 16), 
            isDaytime: hour >= 6 && hour < 18, 
            temp: temp,
            condition: condition,
            weatherCategory: classifyWeather(condition),
            humidity: toNum(w.RelativeHumidity),
            windSpeed: msToKmh(toNum(w.WindSpeed)),
            gust: msToKmh(toNum(gustData)),
            windDegree: deg,
            windDirection: degToText(deg),
            uvIndex: toNum(w.UVIndex),
            feelsLike: null, rainChance: null, sunrise: null, sunset: null
        });
    });

    const result = {};
    Object.keys(candidates).forEach(function (county) {
        const list = candidates[county];
        const wanted = perferredStation[county];
        const preferred = list.find(function (c) { return c.StationId === wanted; });
        result[county] = preferred || list.reduce(function (low, c) {
        return c.altitude < low.altitude ? c : low;
        });
    });
  return result;
};


