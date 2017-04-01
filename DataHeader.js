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

const ContentType = require('./ContentType');

const SIZE = module.exports.SIZE = 4;

const CURRENT_VERSION = module.exports.CURRENT_VERSION = 1;

/*::
import type { ContentType_t } from './ContentType';
export type DataHeader_t = {
    contentType: ContentType_t,
    version: number
};
*/

const parse = module.exports.parse = (bytes /*:Buffer*/) /*:DataHeader_t*/ => {
    if (bytes.length < SIZE) { throw new Error("runt"); }
    const versionAndFlags = bytes[0];
    const unused = bytes[1];
    const contentType = bytes.readUInt16BE(2);

    const version = versionAndFlags >> 4;

    return {
        contentType: ContentType.toString(contentType),
        version: version
    };
};

const serialize = module.exports.serialize = (obj /*:DataHeader_t*/) => {
    if (!ContentType.isValid(obj.contentType)) {
        throw new Error("invalid contentType [" + obj.contentType + "]");
    }
    if (!obj.version) { obj.version = CURRENT_VERSION; }
    if (obj.version !== CURRENT_VERSION) {
        if (typeof(obj.version) !== 'number' || obj.version < 0 || obj.version > ((1<<4)-1)) {
            throw new Error("Unrepresentable version number [" + obj.version + "]");
        }
        console.error("WARN: serializing unexpected DataHeader version [" + obj.version + "]");
    }
    const versionAndFlags = (obj.version << 4) & 0xff;
    const unused = 0;
    const contentType = ContentType.toNum(obj.contentType);

    const out = new Buffer(4);
    out[0] = versionAndFlags;
    out[1] = unused;
    out.writeUInt16BE(contentType, 2);
    return out;
};
