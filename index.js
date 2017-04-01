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

/*::
import type { SwitchHeader_t } from './SwitchHeader'
export type Cjdnshdr_SwitchHeader_t = SwitchHeader_t

import type { RouteHeader_t } from './RouteHeader'
export type Cjdnshdr_RouteHeader_t = RouteHeader_t

import type { DataHeader_t } from './DataHeader'
export type Cjdnshdr_DataHeader_t = DataHeader_t
*/

module.exports.RouteHeader = require('./RouteHeader');
module.exports.SwitchHeader = require('./SwitchHeader');
module.exports.DataHeader = require('./DataHeader');
module.exports.ContentType = require('./ContentType');
