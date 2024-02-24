

/*

async-try-box.js
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

exports.asyncTryBox = (cb) => {
   return async (req, res, next) => {
      try { await cb(req, res, next); }
      catch (err) { next(err); }
   }
}