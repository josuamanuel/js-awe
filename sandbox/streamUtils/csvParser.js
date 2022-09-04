import parse from 'csv-parse'
import fs from 'fs'
import stream, {Readable} from 'stream'
import {pipeline, mapStream, filterStream, filterMapStream, fsWriteFilePromise} from '../lib/utils/streamUtils.js'


const readFsStream = fs.createReadStream(`./example.csv`)

const parser = parse({delimiter:',',columns:true})

const writeFsStream = fs.createWriteStream(`./exampleOut.csv`,{flags:'a'})

fsWriteFilePromise('./exampleOut.csv', 'This is the header...\n')
  .then( () => 
    pipeline(
      readFsStream,
      parser,
      filterStream( record => record.surname === 'Garrido'),
      mapStream( record => ( {...record, name:record.name.toUpperCase()} ) ),
      filterMapStream( ()=>true, (record)=>JSON.stringify(record) + '\n'),
      writeFsStream
    )
  )
  .then( 
    ()=> fsWriteFilePromise('./exampleOut.csv', 'This is the footer\n',{flag:'a'})
  )
  .catch((e)=>{
    console.log(e)
  })
  

// Example with own readable and writeble

const readable = Readable.from(['a','b','c'])
//const readable = ['aaa','bbb','ccc'][Symbol.iterator]()

const writable = new stream.Writable({
  write: function(chunk, encoding, next) {
    console.log('-->:',chunk.toString());
    next();
  }
});

pipeline(
  readable,
  writable
)

fsWriteFilePromise('./test.txt','done using writeFilePromise!!!\n').then(
  () => fsWriteFilePromise('./test.txt','another line\n',{flag:'a'})
)
//.then(()=> console.log('it went ok')) //?