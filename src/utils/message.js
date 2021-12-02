const getMessage = (message)=>{
  return{
    message,
    createdAt: new Date().getTime()
  }
}



module.exports = {
  getMessage
}
