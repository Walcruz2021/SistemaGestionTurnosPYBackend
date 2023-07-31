function jsonResponse(statuscode, body) {
    return {
      statuscode,
      body: body,
    };
  };

  module.exports=jsonResponse