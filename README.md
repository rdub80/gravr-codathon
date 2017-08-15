# gravr-codathon
GRAVR API Codathon - August 15th, 2017 WebVR-NYC Meetup


### Usage

[Demo](http://gravr.io/codathon/)

### (Temporary) API link:

https://gravr.herokuapp.com/


### Setup
npm install

### Run
$ cd /root of project
$ gulp

### To import your own GRAVR Data
1. Create your GRAVR account on the API link above
2. Go to https://gravr.herokuapp.com/account
3. Copy the hash: /api/users/hash/ ```abcdefghijklmnopqrz1234567890```
4. replace the hash on the gravr-avatar component

```html
      <a-entity gravr-avatar="color: #928DAB;
                        obj:assets/basemesh.obj;
                        offsetPos:0 0 0.15;
                        safeZone:false;
                        hash: - YOUR HASH HERE -;
                        ">
      </a-entity>
```

## Properties

| Property   | Description                                                     | Default Value         |
| --------   | -------------------------------------------------------------   | --------------------- |
| color      | Color of the .obj                                               | #928DAB               |
| obj        | Path to the .obj file                                           | 'assets/basemesh.obj' |
| offsetPos  | Vector object for offset position of obj in relation to camera  | {x:0, y:0, z:0}       |
| safeZone   | Boolean for safe space around obj & camera                      | false                 |
| hash       | GRAVR API user HASH (see https://gravr.herokuapp.com)           | ''                    |
| camID      | Identifier for camera object if multiple cameras are used       | ''                    |


### CORS
When using Chrome install this cross-origin plugin
https://chrome.google.com/webstore/category/extensions