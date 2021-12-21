"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CJ4_FMC_PilotWaypointParser = void 0;
const WaypointBuilder_1 = require("../../flightplanning/WaypointBuilder");
class CJ4_FMC_PilotWaypointParser {
    static parseInput(value, referenceIndex, fmc) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchFullLatLong = value.match(CJ4_FMC_PilotWaypointParser.fullLatLong);
            const matchShorhandLatLongEnd = value.match(CJ4_FMC_PilotWaypointParser.shorhandLatLongEnd);
            const matchShorthandLatLongMid = value.match(CJ4_FMC_PilotWaypointParser.shorthandLatLongMid);
            const matchPlaceBearingDistance = value.match(CJ4_FMC_PilotWaypointParser.placeBearingDistance);
            const matchAlongTrackOffset = value.match(CJ4_FMC_PilotWaypointParser.alongTrackOffset);
            let newWaypoint = undefined;
            if (matchFullLatLong) {
                newWaypoint = {
                    wpt: CJ4_FMC_PilotWaypointParser.parseFullLatLong(matchFullLatLong, fmc),
                    offset: 0
                };
            }
            else if (matchShorhandLatLongEnd) {
                newWaypoint = {
                    wpt: CJ4_FMC_PilotWaypointParser.parseShorthandLatLongEnd(matchShorhandLatLongEnd, fmc),
                    offset: 0
                };
            }
            else if (matchShorthandLatLongMid) {
                newWaypoint = {
                    wpt: CJ4_FMC_PilotWaypointParser.parseShorthandLatLongMid(matchShorthandLatLongMid, fmc),
                    offset: 0
                };
            }
            else if (matchPlaceBearingDistance) {
                const placeBearingWaypoint = yield CJ4_FMC_PilotWaypointParser.parsePlaceBearingDistance(matchPlaceBearingDistance, fmc);
                if (placeBearingWaypoint) {
                    newWaypoint = {
                        wpt: placeBearingWaypoint,
                        offset: 0
                    };
                }
            }
            else if (matchAlongTrackOffset) {
                // 1 = Reference Ident
                // 2 = Distance from Reference
                // 3 = Ident
                referenceIndex = fmc.flightPlanManager.getAllWaypoints().findIndex(x => x.ident === matchAlongTrackOffset[1]);
                if (referenceIndex > -1) {
                    const ident = CJ4_FMC_PilotWaypointParser.procMatch(matchAlongTrackOffset[3], CJ4_FMC_PilotWaypointParser.getIndexedName(fmc.flightPlanManager.getWaypoint(referenceIndex).ident, fmc));
                    const distance = parseFloat(matchAlongTrackOffset[2]);
                    newWaypoint = {
                        wpt: WaypointBuilder_1.WaypointBuilder.fromPlaceAlongFlightPlan(ident, referenceIndex, distance, fmc, fmc.flightPlanManager),
                        offset: distance
                    };
                }
            }
            return newWaypoint;
        });
    }
    static parseInputLatLong(value, fmc) {
        const matchFullLatLong = value.match(CJ4_FMC_PilotWaypointParser.fullLatLong);
        const matchShorhandLatLongEnd = value.match(CJ4_FMC_PilotWaypointParser.shorhandLatLongEnd);
        const matchShorthandLatLongMid = value.match(CJ4_FMC_PilotWaypointParser.shorthandLatLongMid);
        let newWaypoint = undefined;
        if (matchFullLatLong) {
            newWaypoint = {
                wpt: CJ4_FMC_PilotWaypointParser.parseFullLatLong(matchFullLatLong, fmc),
                offset: false
            };
        }
        else if (matchShorhandLatLongEnd) {
            newWaypoint = {
                wpt: CJ4_FMC_PilotWaypointParser.parseShorthandLatLongEnd(matchShorhandLatLongEnd, fmc),
                offset: false
            };
        }
        else if (matchShorthandLatLongMid) {
            newWaypoint = {
                wpt: CJ4_FMC_PilotWaypointParser.parseShorthandLatLongMid(matchShorthandLatLongMid, fmc),
                offset: false
            };
        }
        return newWaypoint;
    }
    static parseInputPlaceBearingDistance(value, fmc) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchPlaceBearingDistance = value.match(CJ4_FMC_PilotWaypointParser.placeBearingDistance);
            let newWaypoint = undefined;
            if (matchPlaceBearingDistance) {
                const placeBearingWaypoint = yield CJ4_FMC_PilotWaypointParser.parsePlaceBearingDistance(matchPlaceBearingDistance, fmc);
                if (placeBearingWaypoint) {
                    newWaypoint = {
                        wpt: placeBearingWaypoint,
                        offset: false
                    };
                }
            }
            return newWaypoint;
        });
    }
    static buildPilotWaypointFromExisting(ident, latitude, longitude, fmc) {
        const coordinates = new LatLongAlt(latitude, longitude, 0);
        const newWaypoint = WaypointBuilder_1.WaypointBuilder.fromCoordinates(ident, coordinates, fmc);
        return newWaypoint;
    }
    static parseFullLatLong(matchFullLatLong, fmc) {
        console.log("match full lat long");
        // 1 = N/S
        // 2 = LAT DEG
        // 3 = LAT MINS
        // 4 = E/W
        // 5 = LONG DEG
        // 6 = LONG MINS
        // 7 = IDENT
        if (matchFullLatLong[3].trim() === "") {
            matchFullLatLong[3] = "0";
        }
        if (matchFullLatLong[6].trim() === "") {
            matchFullLatLong[6] = "0";
        }
        const latitude = matchFullLatLong[1] == "S" ? 0 - parseInt(matchFullLatLong[2]) - (parseFloat(matchFullLatLong[3]) / 60)
            : parseInt(matchFullLatLong[2]) + (parseFloat(matchFullLatLong[3]) / 60);
        const longitude = matchFullLatLong[4] == "W" ? 0 - parseInt(matchFullLatLong[5]) - (parseFloat(matchFullLatLong[6]) / 60)
            : parseInt(matchFullLatLong[5]) + (parseFloat(matchFullLatLong[6]) / 60);
        const coordinates = new LatLongAlt(latitude, longitude, 0);
        const ident = CJ4_FMC_PilotWaypointParser.procMatch(matchFullLatLong[7], matchFullLatLong[1] + matchFullLatLong[2].slice(0, 2) + matchFullLatLong[4] + matchFullLatLong[5] + matchFullLatLong[6].slice(0, 2));
        return WaypointBuilder_1.WaypointBuilder.fromCoordinates(ident, coordinates, fmc);
    }
    static parseShorthandLatLongEnd(matchShorthandLatLongEnd, fmc) {
        // 1 = LAT DEG
        // 2 = LONG DEG
        // 3 = N/E/S/W (N = N:W; E = N:E; S = S:E; W = S:W)
        const direction = matchShorthandLatLongEnd[3];
        const latitude = direction == "S" || direction == "W" ? 0 - parseInt(matchShorthandLatLongEnd[1])
            : parseInt(matchShorthandLatLongEnd[1]);
        const longitude = direction == "N" || direction == "W" ? 0 - parseInt(matchShorthandLatLongEnd[2])
            : parseInt(matchShorthandLatLongEnd[2]);
        const coordinates = new LatLongAlt(latitude, longitude, 0);
        const ident = matchShorthandLatLongEnd[1] + matchShorthandLatLongEnd[2] + direction;
        return WaypointBuilder_1.WaypointBuilder.fromCoordinates(ident, coordinates, fmc);
    }
    static parseShorthandLatLongMid(matchShorthandLatLongMid, fmc) {
        // 1 = LAT DEG
        // 2 = N/E/S/W (N = N:W; E = N:E; S = S:E; W = S:W)
        // 3 = LONG DEG
        const direction = matchShorthandLatLongMid[2];
        const latitude = direction == "S" || direction == "W" ? 0 - parseInt(matchShorthandLatLongMid[1])
            : parseInt(matchShorthandLatLongMid[1]);
        const longitude = direction == "N" || direction == "W" ? 0 - 100 - parseInt(matchShorthandLatLongMid[3])
            : 100 + parseInt(matchShorthandLatLongMid[3]);
        const coordinates = new LatLongAlt(latitude, longitude, 0);
        const ident = matchShorthandLatLongMid[1] + direction + matchShorthandLatLongMid[3];
        return WaypointBuilder_1.WaypointBuilder.fromCoordinates(ident, coordinates, fmc);
    }
    static parsePlaceBearingDistance(matchPlaceBearingDistance, fmc) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1 = Reference Ident
            // 2 = Bearing from Reference
            // 3 = Distance from Reference
            // 4 = Ident
            let referenceWaypoint = fmc.flightPlanManager.getAllWaypoints().find(x => x.ident === matchPlaceBearingDistance[1]);
            if (referenceWaypoint === undefined) {
                const getWpt = (refWpt) => {
                    return new Promise(resolve => {
                        fmc.getOrSelectWaypointByIdent(refWpt, (w) => resolve(w));
                    });
                };
                referenceWaypoint = yield getWpt(matchPlaceBearingDistance[1]);
            }
            if (referenceWaypoint !== undefined) {
                const referenceCoordinates = referenceWaypoint.infos.coordinates;
                const bearing = parseInt(matchPlaceBearingDistance[2]);
                const distance = parseFloat(matchPlaceBearingDistance[3]);
                const ident = CJ4_FMC_PilotWaypointParser.procMatch(matchPlaceBearingDistance[4], CJ4_FMC_PilotWaypointParser.getIndexedName(referenceWaypoint.ident, fmc));
                return WaypointBuilder_1.WaypointBuilder.fromPlaceBearingDistance(ident, referenceCoordinates, bearing, distance, fmc);
            }
            else {
                return undefined;
            }
        });
    }
    static procMatch(item, defaultVal) {
        return (item === undefined) ? defaultVal : item;
    }
    static getIndexedName(ident, fmc) {
        const waypoints = fmc.flightPlanManager.getAllWaypoints();
        const identPrefix = ident.substr(0, 3);
        let namingIndex;
        let currentIndex = 1;
        while (namingIndex === undefined) {
            const currentName = `${identPrefix}${String(currentIndex).padStart(2, '0')}`;
            const waypointIndex = waypoints.findIndex(x => x.ident === currentName);
            if (waypointIndex === -1) {
                return currentName;
            }
            else {
                currentIndex++;
            }
        }
    }
}
exports.CJ4_FMC_PilotWaypointParser = CJ4_FMC_PilotWaypointParser;
CJ4_FMC_PilotWaypointParser.fullLatLong = /([NS])([0-8][0-9])((?:[0-5][0-9])?(?:\.\d{1,2})?)([EW])((?:[0][0-9][0-9])|(?:[1][0-7][0-9]))((?:[0-5][0-9])?(?:\.\d{1,2})?)(?:\/(\w{0,5}))?/;
CJ4_FMC_PilotWaypointParser.shorhandLatLongEnd = /([0-8][0-9])([0-9][0-9]|[1][0-8][0-9])([NSEW])/;
CJ4_FMC_PilotWaypointParser.shorthandLatLongMid = /([0-8][0-9])([NSEW])([1][0-8][0-9]|[0-9][0-9])/;
CJ4_FMC_PilotWaypointParser.placeBearingDistance = /(\w{3,5})([0-3][0-9][0-9])\/(\d{1,3}(?:\.\d{1})?)(?:\/(\w{0,5}))?/;
CJ4_FMC_PilotWaypointParser.alongTrackOffset = /(\w{3,5})\/(?:(-*\d{0,3}\.*\d{0,1}))?(?:\/(\w{0,5}))?/;
//# sourceMappingURL=CJ4_FMC_PilotWaypointParser.js.map