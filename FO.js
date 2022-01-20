const { dir } = require('console');
const fs = require('fs');
const { type } = require('os');
const path = require('path')




let input = process.argv.slice(2);

let types = {
    media: ["mp4", "mkv", "mp3", "aac", "m4a"],
    archives: ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"],
    documents: [
      "docx",
      "doc",
      "pdf",
      "xlsx",
      "xls",
      "odt",
      "ods",
      "odp",
      "odg",
      "odf",
      "txt",
      "ps",
      "tex",
      "epub",
      "pptx"
    ],
    app: ["exe", "dmg", "pkg", "deb"],
    images: ["png", "jpeg", "jpg"]
  };
  

let command = input[0]

switch(command)
{
    case 'tree':
        console.log('Tree implemented')
        break;
    case 'organize':
        organizeFn(input[1])
        break;
    case 'help':
        helpFn();
        break;

    default:
        console.log('Please enter a valid command')
        break;
}

function helpFn()
{
    console.log(`List of all the Commands-
                    1) Tree Command - node FO.js tree <dirname>
                    2) Organize Command - node FO.js organize <dirname>
                    3) Help Command - node FO.js help`)
}


function organizeFn(dirPath)    // input of directory path
{
    /* Test-> Organized Files-> 
        -> media
        -> documents
        -> apps
        -> archives
    */

    
    let destPath;

    if (dirPath==undefined)
    {
        console.log('Please enter a valid Directory path.')
        // Check whether dirPath is passed or not.
        return;
    }

    else{
        let doesExist = fs.existsSync(dirPath)

        // Whether the path exists or not.

        if(doesExist)
        {
            destPath = path.join(dirPath, 'organizedFiles')

            // C:\Users\arjun\Desktop\FO\Test Folder\organizedFiles

            if(fs.existsSync(destPath)==false)  // Checks whether this folder exists or not.
            {
                fs.mkdirSync(destPath)
            }
            else
            {
                console.log("This folder already exists.")
            }
        }
        
        else
        {
            console.log("Please enter a valid path.")
        }
    }

    organizeHelper(dirPath, destPath);
}

// Function to categorize our files

function organizeHelper(src, dest)
{
    let childNames = fs.readdirSync(src) // get all the files and the folders inside the src
    //console.log(childNames)

    for (let i=0; i<childNames.length; i++)
    {
        let childAddress = path.join(src, childNames[i])
        let isFile = fs.lstatSync(childAddress).isFile()
        //console.log(childAddress +" : " + isFile)

        if (isFile==true)
        {
            let fileCategory = getCategory(childNames[i])
            //console.log(childNames[i] + " belongs to " + fileCategory)
            sendFiles(childAddress, dest, fileCategory)
        }

    }
}

function getCategory(fileName)
{
    let ext = path.extname(fileName) // taking out the extension name
    ext = ext.slice(1) // taking out the "."

    for(let type in types)
    {
        let cTypeArr = types[type]
        //console.log(cTypeArr)
        for(let i=0; i<cTypeArr.length; i++)
        {
            if(ext==cTypeArr[i])
            {
                return type
            }
        }
    }
    return "others"
}

function sendFiles(srcFilePath, dest, fileCategory)
{
    let catPath = path.join(dest, fileCategory)
    
    if(fs.existsSync(catPath)==false) // Checking for category folder path
    {
        fs.mkdirSync(catPath)
    }

    let fileName = path.basename(srcFilePath) // took out the names of the files
    let destFilePath = path.join(catPath, fileName) // here we created the path of the file in the category folder

    fs.copyFileSync(srcFilePath, destFilePath) // copied files from src to dest
    fs.unlinkSync(srcFilePath) // deleted the files from source
    console.log(fileName + " is copied to " + fileCategory)
}