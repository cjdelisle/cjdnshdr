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

const CONTENT_TYPES_STR = `
enum ContentType
{
    /**
     * The lowest 255 message types are reserved for cjdns/IPv6 packets.
     * AKA: packets where the IP address is within the FC00::/8 block.
     * Any packet sent in this way will have the IPv6 header deconstructed and this
     * field will come from the nextHeader field in the IPv6 header.
     */
    ContentType_IP6_IP =        0,
    ContentType_IP6_ICMP =      1,
    ContentType_IP6_IGMP =      2,
    ContentType_IP6_IPIP =      4,
    ContentType_IP6_TCP =       6,
    ContentType_IP6_EGP =       8,
    ContentType_IP6_PUP =       12,
    ContentType_IP6_UDP =       17,
    ContentType_IP6_IDP =       22,
    ContentType_IP6_TP =        29,
    ContentType_IP6_DCCP =      33,
    ContentType_IP6_IPV6 =      41,
    ContentType_IP6_RSVP =      46,
    ContentType_IP6_GRE =       47,
    ContentType_IP6_ESP =       50,
    ContentType_IP6_AH =        51,
    ContentType_IP6_MTP =       92,
    ContentType_IP6_BEETPH =    94,
    ContentType_IP6_ENCAP =     98,
    ContentType_IP6_PIM =       103,
    ContentType_IP6_COMP =      108,
    ContentType_IP6_SCTP =      132,
    ContentType_IP6_UDPLITE =   136,
    ContentType_IP6_RAW =       255,

    /** Bencoded inter-router DHT messages. */
    ContentType_CJDHT =         256,
    ContentType_IPTUN =         257,

    /** Reserved for future allocation. */
    ContentType_RESERVED =      258,
    ContentType_RESERVED_MAX =  0x7fff,

    /**
     * Content types in the AVAILABLE range are not defined and can be used
     * like port numbers for subsystems of cjdns to communicate with subsystems within
     * cjdns on other machines, providing they first agree on which numbers to use via
     * CTRL messages.
     */
    ContentType_AVAILABLE =     0x8000,

    // This contentType will never appear in the wild, it represents unencrypted control frames.
    ContentType_CTRL = 0xffff + 1,

    ContentType_MAX = 0xffff + 2
};
`;

const NUM_BY_NAME = {};
const NAME_BY_NUM = {};

CONTENT_TYPES_STR.split('\n').forEach((line) => {
    line.replace(/^.*ContentType_([^ ]*) = ([^,]*),*$/, (all, name, num) => {
        // jshint -W061
        const n = Number(eval(num));
        NUM_BY_NAME[name] = n;
        NAME_BY_NUM[n] = name;
        //console.log(name + '  ' + n);
        return '';
    });
});

/*::
export type ContentType_t = string;
*/

const toString = module.exports.asString = (ct /*:number|ContentType_t*/) /*:ContentType_t*/ => {
    return NAME_BY_NUM[ct] || NAME_BY_NUM[NUM_BY_NAME[ct]];
};

const toNum = module.exports.toNum = (ct /*:number|ContentType_t*/) => {
    return NUM_BY_NAME[ct] || NUM_BY_NAME[NAME_BY_NUM[ct]];
};

const isValid = module.exports.isValid = (ct /*:number|ContentType_t*/) => {
    return !!(NUM_BY_NAME[ct] || NAME_BY_NUM[ct]);
};

const names = module.exports.names = () /*:ContentType_t[]*/ => {
    return Object.keys(NUM_BY_NAME);
};
