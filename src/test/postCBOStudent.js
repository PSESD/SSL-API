var request      = require(__dirname + '/../lib/xsre/push/request');
var Organization = require(__dirname + '/../app/models/Organization');
var orgId        = '55913fc817aac10c2bbfe1e8';
var studentId    = '5614c98cdd24ff981f881962';
var Request      = new request();
var body         = '<?xml version="1.0" encoding="utf-16"?>';
body += '<CBOStudent id="5614c98cdd24ff981f881962">';
body += '    <organization refId="55913fc817aac10c2bbfe1e8">';
body += '        <organizationName>Helping Hand CBO</organizationName>';
body += '        <externalServiceId>5</externalServiceId>';
body += '        <personnelId></personnelId>';
body += '        <authorizedEntityId>2</authorizedEntityId>';
body += '        <districtStudentId>61442</districtStudentId>';
body += '        <zoneId>highline</zoneId>';
body += '        <contextId>CBO</contextId>';
body += '    </organization>';
body += '    <programs>';
body += '        <activities></activities>';
body += '    </programs>';
body += '</CBOStudent>';

Request.push(body);

//Organization.pushStudent(null, orgId, studentId, function(err, body){
//      console.log('MASUP');
//      if(err) return console.log(err);
//      return console.log(body);
//      Request.push(
//            body
//      );
//});