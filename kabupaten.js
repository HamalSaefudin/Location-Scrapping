const pupeteer = require('puppeteer');
const fs = require('fs');
const province = require('./province.json')

async function Scrapper(province){
    const browser = await pupeteer.launch({headless:false});
    const page = await browser.newPage();
    const fixLocation = province.replace(' ','%20')
    await page.goto(`https://www.nomor.net/_kodepos.php?_i=kota-kodepos&sby=000000&daerah=Provinsi&jobs=${fixLocation}`);

    const grabName = await page.evaluate(()=>{
        const tag = document.querySelectorAll("tbody tr .cstr td .ktu");
        let listName = [];

        tag.forEach((x,i)=>{
            const notTitle = Number(x.innerText)
            const blackList = ['Daftar Provinsi + range Kode POS',
            'Daftar Kota - Kabupaten + range Kode POS',
            'Daftar Kecamatan',
            'Daftar Desa - Kelurahan + Kode POS']

            if(isNaN(notTitle)&&i){
                if(!blackList.includes(x.innerText)){
                    listName.push(x.innerText)
                }
            }
        })
        return listName;
    })
    
    const grabCode = await page.evaluate(()=>{
        const tag = document.querySelectorAll("tbody tr .cstr td b");
        let listCode = [];

        tag.forEach((x)=>{
            listCode.push(x.innerText)
        })
        return listCode;
    })
    let finalData = [];

    for (let x = 0; x < grabName.length; x++) {
        finalData.push({
            id:grabCode[x],
            name:grabName[x],
            province
        })
    }
    
    fs.writeFileSync(`Kabupaten/${province}.json`,JSON.stringify(finalData))
    await browser.close()
};

for (let i = 26; i <= 33; i++) {
    Scrapper(province[i].name)
}