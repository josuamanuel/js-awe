
import stream from 'stream'
import { transform } from 'stream-transform'
import util from 'util'
import fs from 'fs'

const pipeline = util.promisify(stream.pipeline);

const filterStream = (filterFunc) => 
  transform(
    function(record, callback)
    {
      if(filterFunc(record)) {
        if(typeof record === 'object') record = {...record}
        callback(null, record)
      }else callback(null, undefined)
    }
  )

const mapStream = (mapFunc) => 
  transform(
    function(record, callback)
    {
      callback(null, mapFunc(record))
    }
  )


const filterMapStream = (filterFunc, mapFunc) => 
  transform(
    function(record, callback)
    {
      if(typeof record === 'object') record = {...record}
      if(filterFunc === undefined && mapFunc === undefined) throw new Error('filterMap called without parameters. filterFunc or mapFunc needed')
      if(filterFunc === undefined) {
        callback(null, mapFunc(record))
        return
      }

      if(mapFunc === undefined) 
      {
        if(filterFunc(record)) callback(null, record)
        else callback(null, undefined)
        return
      }

      if(filterFunc(record)) callback(null, mapFunc(record))
      else callback(null, undefined)
    }
  )


const fsWriteFilePromise = util.promisify(fs.writeFile)

export {pipeline, mapStream, filterStream, filterMapStream, fsWriteFilePromise}