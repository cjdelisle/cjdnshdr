/* vim: set expandtab ts=4 sw=4: */
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
const LABEL_REGEX = /^([a-f0-9]{4}\.){3}[a-f0-9]{4}$/

const SIZE = module.exports.SIZE = 12;

const CURRENT_VERSION = module.exports.CURRENT_VERSION = 1;

const parse = module.exports.parse = (hdrBytes) => {
    if (hdrBytes.length < SIZE) { throw new Error("runt"); }
    let x = 0;
    const labelBytes = hdrBytes.slice(x, x += 8);
    const congestAndSuppressErrors = hdrBytes[x++];
    const versionAndLabelShift = hdrBytes[x++];
    const penaltyBytes = hdrBytes.slice(x, x += 2);
    if (x !== SIZE) { throw new Error(); }

    const version = versionAndLabelShift >> 6;
    if (version !== CURRENT_VERSION) {
        console.error("WARNING: Parsing label with unrecognized version number [" + version + "]");
    }

    return {
        label: labelBytes.toString('hex').replace(/[0-9a-f]{4}/g, (x) => (x + '.')).slice(0,-1),
        congestion: congestAndSuppressErrors >> 1,
        suppressErrors: congestAndSuppressErrors & 1,
        version: version,
        labelShift: versionAndLabelShift & ((1<<6)-1),
        penalty: penaltyBytes.readUInt16BE()
    };
};

const serialize = module.exports.serialize = (obj) => {
    if (!obj.label || !LABEL_REGEX.test(obj.label)) { throw new Error("missing or malformed label"); }
    if (!obj.version) { obj.version = CURRENT_VERSION; }
    if (obj.version !== CURRENT_VERSION) { throw new Error("invalid version"); }
    if (obj.labelShift > 63) { throw new Error("labelShift out of range"); }
    if (obj.penalty > 65535) { throw new Error("penalty out of range"); }
    const labelHex = obj.label.replace(/\./g, '')
    const congestAndSuppressErrors = ((obj.congestion << 1) | !!obj.suppressErrors) & 0xff;
    const versionAndLabelShift = ((obj.version << 6) | obj.labelShift) & 0xff;
    const out = new Buffer(12);
    out.write(labelHex, 0, labelHex.length, 'hex');
    out[8] = congestAndSuppressErrors;
    out[9] = versionAndLabelShift;
    out.writeUInt16BE(obj.penalty, 10);
    return out;
};
