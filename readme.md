# Cjdns Header Tools

Library for parsing and serializing cjdns route and data headers.
This includes:

* SwitchHeader - The header used by the cjdns switch
* RouteHeader - This header is emitted from the cjdns engine lower half which tells the upper half
where the packet came from, it is also used when sending a packet to/via the lower half, it tells
the proper destination and the path which the packet should take (if applicable).
* DataHeader - This is a simple header which merely tells the type of content.
* ContentType - This is an enum of content types.

SwitchHeader, RouteHeader and DataHeader have `parse()` and `serialize()` functions.
ContentType has `toString()`, `toNum()` and `isValid()` functions. `toString()` and `toNum()` accept
both string and numeric forms of the ContentType as input and return `undefined` if the input is
not a known/valid ContentType. Beware: `isValid()` will return false and `toString()`/`toNum()` will
return undefined for valid but not yet allocated content types.


When serializing SwitchHeader and DataHeader, if the version is unspecified, it will be
automatically set to the current version. In RouteHeader the version is for telling the core what
is the version of the other node, if it is unspecified or zero the core will attempt to guess.
SwitchHeader and DataHeader have their own versioning schemes, separate from the overall cjdns
version. `SwitchHeader.CURRENT_VERSION` is the current SwitchHeader version and
`DataHeader.CURRENT_VERSION` is the current DataHeader version.


## Example DataHeader
```javascript
DataHeader.parse(new Buffer("10000100", "hex"));
// result
{
  "contentType": "CJDHT",
  "version": 1
}
```

## Example RouteHeader
```javascript
RouteHeader.parse(new Buffer(
    'a331ebbed8d92ac03b10efed3e389cd0c6ec7331a72dbde198476c5eb4d14a1f' + // key
    '000000000000001300480000' + // switch header
    '00000000' + // version (unknown)
    '00000000' + // pad
    'fc928136dc1fe6e04ef6a6dd7187b85f', // ip6
    'hex'
));
// result
{
  "publicKey": "3fdqgz2vtqb0wx02hhvx3wjmjqktyt567fcuvj3m72vw5u6ubu70.k",
  "version": 0,
  "ip": "fc92:8136:dc1f:e6e0:4ef6:a6dd:7187:b85f",
  "switchHeader": {
    "label": "0000.0000.0000.0013",
    "congestion": 0,
    "suppressErrors": 0,
    "version": 1,
    "labelShift": 8,
    "penalty": 0
  }
}
```

## Example SwitchHeader
```javascript
SwitchHeader.parse(new Buffer('000000000000001300480000', 'hex'));
// result
{
  "label": "0000.0000.0000.0013",
  "congestion": 0,
  "suppressErrors": 0,
  "version": 1,
  "labelShift": 8,
  "penalty": 0
}
