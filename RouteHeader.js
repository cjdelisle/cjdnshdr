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
const Cjdnskeys = require('cjdnskeys');
const SwitchHeader = require('./SwitchHeader');

const ZEROKEY = new Buffer(new Array(32).fill(0));
const ZEROIP = new Buffer(new Array(16).fill(0));
const F_INCOMING = 1;
const F_CTRL = 1<<1;

const SIZE = module.exports.SIZE = 68;

/*::
import type { SwitchHeader_t } from './SwitchHeader';
export type RouteHeader_t = {
    publicKey: string | null,
    version: number,
    ip: string | null,
    switchHeader: SwitchHeader_t,
    isIncoming: boolean,
    isCtrl: boolean
};
*/

const parse = module.exports.parse = (hdrBytes /*:Buffer*/) /*:RouteHeader_t*/ => {
    if (hdrBytes.length < SIZE) { throw new Error("runt"); }
    let x = 0;
    const keyBytes = hdrBytes.slice(x, x += 32);
    const shBytes = hdrBytes.slice(x, x += 12);
    const versionBytes = hdrBytes.slice(x, x += 4);
    const flags = hdrBytes[x++];
    const unusedBytes = hdrBytes.slice(x, x += 3);
    const ipBytes = hdrBytes.slice(x, x += 16);
    const isCtrl = !!(flags & F_CTRL);
    if (x !== SIZE) { throw new Error(); }
    if (!isCtrl && ZEROIP.equals(ipBytes)) {
        throw new Error("IP6 is not defined");
    } else if (isCtrl && !ZEROIP.equals(ipBytes)) {
        throw new Error("IP6 is defined for CTRL frame");
    }

    const out = {
        publicKey: keyBytes.equals(ZEROKEY) ? null : Cjdnskeys.keyBytesToString(keyBytes),
        version: versionBytes.readInt32BE(0),
        ip: isCtrl ? null : Cjdnskeys.ip6BytesToString(ipBytes),
        switchHeader: SwitchHeader.parse(shBytes),
        isIncoming: !!(flags & F_INCOMING),
        isCtrl: isCtrl
    };
    if (out.publicKey) {
        const ip = Cjdnskeys.publicToIp6(out.publicKey);
        if (ip !== out.ip) {
            console.error("WARNING: RouteHeader key does not match IP6");
            out.ip = ip;
        }
    }
    return out;
};

const serialize = module.exports.serialize = (obj /*:RouteHeader_t*/) => {
    if (!obj.ip && !obj.isCtrl) { throw new Error("IP6 required"); }
    const keyBytes = obj.publicKey ? Cjdnskeys.keyStringToBytes(obj.publicKey) : ZEROKEY;
    const shBytes = SwitchHeader.serialize(obj.switchHeader);
    const versionBytes = new Buffer(4);
    versionBytes.writeUInt32BE(obj.version, 0);
    let flags = 0;
    if (obj.isIncoming) { flags |= F_INCOMING; }
    if (obj.isCtrl) { flags |= F_CTRL; }
    const padBytes = new Buffer([flags, 0, 0, 0]);
    const ipBytes = obj.ip ? Cjdnskeys.ip6StringToBytes(obj.ip) : ZEROIP;
    return Buffer.concat([keyBytes, shBytes, versionBytes, padBytes, ipBytes]);
};
