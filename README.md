# gravr-codathon
GRAVR API Codathon - August 15th, 2017 WebVR-NYC Meetup

Live link:
http://gravr.io/codathon/

##Temporary API link:
https://gravr.herokuapp.com/

## Setup
npm install

## run
$ cd /root of project
$ gulp

## To import your own GRAVR Data
1. Create your GRAVR account on the API link above
2. Go to https://gravr.herokuapp.com/account
3. Copy the hash: /api/users/hash/b642b4217b34b1e8d3bd915fc65c4452
4. replace the hash on the gravr-avatar component


      <a-entity gravr-avatar="color: #928DAB;
                        obj:assets/basemesh.obj;
                        offsetPos:0 0 0.15;
                        safeZone:false;
                        hash:b642b4217b34b1e8d3bd915fc65c4452;
                        ">
      </a-entity>


## CORS
When using Chrome install this cross-origin plugin
https://chrome.google.com/webstore/category/extensions