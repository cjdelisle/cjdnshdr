/*@flow*/
/*
 * You may redistribute this program and/or modify it under the terms of
 * the GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
'use strict';
const SwitchHeader = require('./SwitchHeader');
const RouteHeader = require('./RouteHeader');
const ContentType = require('./ContentType');
const DataHeader = require('./DataHeader');

 /*
 a331ebbed8d92ac03b10efed3e389cd0c6ec7331a72dbde198476c5eb4d14a1f
 000000000000001300480000
 00000000
 4908470d
 fc928136dc1fe6e04ef6a6dd7187b85f

 10000100 <-- DataHeader
 643030323a6569693065323a6573353a6114458100313a7069313765313a71323a6770333a746172383a0000000000000000343a7478696431323a677447c9893a791dc04744e265
*/

const assert = function (x) { if (!x) { throw new Error(); } };

const testSwitchHeaderParse = () => {
    const bytes = new Buffer('000000000000001300480000', 'hex');
    const hdr = SwitchHeader.parse(bytes);
    assert(hdr.label === '0000.0000.0000.0013');
    assert(!hdr.congestion);
    assert(!hdr.suppressErrors);
    assert(hdr.version === 1);
    assert(hdr.labelShift === 8);
    assert(!hdr.penalty);
    assert(bytes.equals(SwitchHeader.serialize(hdr)));
    console.log(JSON.stringify(hdr, null, '  '));
};

const testRouteHeaderParse = () => {
    const bytes = new Buffer(
        'a331ebbed8d92ac03b10efed3e389cd0c6ec7331a72dbde198476c5eb4d14a1f' + // key
        '000000000000001300480000' + // switch header
        '00000000' + // version (unknown)
        '01' + // flags
        '000000' + // pad
        'fc928136dc1fe6e04ef6a6dd7187b85f', // ip6
        'hex'
    );
    const obj = RouteHeader.parse(bytes);
    assert(obj.publicKey === '3fdqgz2vtqb0wx02hhvx3wjmjqktyt567fcuvj3m72vw5u6ubu70.k');
    assert(obj.version === 0);
    assert(obj.ip === 'fc92:8136:dc1f:e6e0:4ef6:a6dd:7187:b85f');
    assert(obj.switchHeader.label === '0000.0000.0000.0013');
    assert(obj.isIncoming);
    assert(bytes.equals(RouteHeader.serialize(obj)));
};

const contentTypeTest = () => {
    assert(ContentType.toString(256) === 'CJDHT');
    assert(ContentType.toString('CJDHT') === 'CJDHT');
    assert(ContentType.toString(10000000) === undefined);
    assert(ContentType.toString('no such type') === undefined);
    assert(ContentType.toNum(256) === 256);
    assert(ContentType.toNum('CJDHT') === 256);
    assert(ContentType.toNum('no such type') === undefined);
    assert(ContentType.toNum(1000000) === undefined);
};

const testDataHeaderParse = () => {
    const bytes = new Buffer("10000100", "hex");
    const obj = DataHeader.parse(bytes);
    assert(obj.contentType === 'CJDHT');
    assert(obj.version === 1);
    assert(bytes.equals(DataHeader.serialize(obj)));
};

testSwitchHeaderParse();
testRouteHeaderParse();
contentTypeTest();
testDataHeaderParse();
