
const dict = {
  upperLetters: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
  lowerLetters: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
  numbers: [0,1,2,3,4,5,6,7,8,9]
}

function anonymize(toAnonymize)
{
  let changes = 0
  const result = toAnonymize
    .split('')
    .map(char => {
      let toReturn
      const type = getTypeDict(char)

      if(type)
        toReturn = type[getRandomInt(type.length -1)]
      else toReturn = char

      if(toReturn !== char) changes++
      return toReturn
    })
    .join('')

  if(changes < toAnonymize.length/2) return Array.from({length: result.length}).fill('*').join('')
  
  return result
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getTypeDict(char)
{
  const type = char.charCodeAt()

  if( type > 47 && type < 58 ) return dict.numbers
  if( type > 64 && type < 91 ) return dict.upperLetters 
  if( type > 96 && type < 123 ) return dict.lowerLetters

  return undefined
}

export { anonymize }

