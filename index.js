const fs =  require('fs');
const {parse} = require('csv-parse');
const crypto = require('crypto');
const hash = crypto.createHash('sha256');
const csvttojson = require('csvjson');


//Function generating sha256 
const generateSHA = (json_obj) => {
    return crypto.createHash('sha256').update(JSON.stringify(json_obj)).digest('hex');

}

const holder = [];
const holderjson = [];
const filename =  'Naming - Team Engine'; //Enter the file name without the .csv extension
fs.createReadStream(`${filename}.csv`)
  .pipe(parse({ delimiter: ",", from_line:  2}))
  .on("data", function (header) {
    const new_header = {
        format: "CHIP-0007",
        minting_tool: "SuperMinter/2.5.2",
        sensitive_content: false,
        series_number: 22,
        series_total: 1000,
        name: header[1],
        description: "NFT ",
        collection: {
            name: header[1],
            id: header[2],
            attribute: [
                {
                    type: 'description',
                    value: header[3]
                },
                {
                    type: "icon",
                    value: ""
                },
                {
                    type: "banner",
                    value: ""
                },
                {
                    type: "twitter",
                    value: ""
                },
                {
                    type: "website",
                    value: ""
                }
            ]
        }
    }
        new_header.sha256 = `${header[1]}.${generateSHA(new_header)}.csv`

   holder.push({format: new_header.format,
   minting_tool: new_header.minting_tool,
   sensitive_content: new_header.sensitive_content,
   series_number: new_header.series_number,
   series_total: new_header.series_total,
   name: new_header.name,
   description: new_header.description,
   collection_name: new_header.collection.name,
   collection_id: new_header.collection.id,
   sha256: new_header.sha256
})
    holderjson.push(new_header);  
})

.on('end', () => {
    const csv_data = csvttojson.toCSV(holder, {
        delimiter: ",",
        wrap: false,
        headers: 'key'
    })

    fs.writeFile("./output.csv", csv_data, () => {})
   fs.writeFile("./output.json", JSON.stringify(holderjson, null, 2), () =>{} )
   console.log(`congratulations !!!!! \n  your output.json and output.csv file ready in the root directory`);
    
})



