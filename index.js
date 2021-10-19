const pupeteer = require('puppeteer');
const fs = require('fs');

(async()=>{
    const browser = await pupeteer.launch({headless:false});
    const page = await browser.newPage();
    await page.goto('https://www.nomor.net/_kodepos.php?_i=provinsi-kodepos&daerah=&jobs=&perhal=60&urut=&asc=000011111&sby=000000');

    const grabLocation = await page.evaluate(()=>{
        const tag = document.querySelectorAll("tbody tr td .ktv");
        let listLocation = [];

        tag.forEach((x,i)=>{
            const notTitle = Number(x.innerText)
            const blackList = ['Daftar Provinsi + range Kode POS',
            'Daftar Kota - Kabupaten + range Kode POS',
            'Daftar Kecamatan',
            'Daftar Desa - Kelurahan + Kode POS','Jumlah Total']

            if(isNaN(notTitle)){
                if(!blackList.includes(x.innerText)){
                    listLocation.push({id:i.toString(),name:x.innerText})
                }
            }
        })
        return JSON.stringify(listLocation);
    })
    
    fs.writeFileSync('province.json',grabLocation)
    await browser.close()
})();