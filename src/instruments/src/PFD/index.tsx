/**
 * Salty 74S
 * Copyright (C) 2021 Salty Simulations and its contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { FC } from "react";
import { render } from "../Common";
import { Horizon } from "./AttitudeIndicator/Horizon";
import { CommandSpeed, MachGS } from "./AirspeedIndicator/SpeedTape";
import { SpeedTape } from "./AirspeedIndicator/SpeedTape";
import { SpeedScroller } from "./AirspeedIndicator/AirspeedScroller";
import { VSI } from "./VerticalSpeedIndicator";
import { HeadingDisplay } from "./HeadingDisplay";
import { AltitudeScroller } from "./Altimeter/AltitudeScroller";
import { AltitudeTape } from "./Altimeter/AltitudeTape";

import "./index.scss";
import "../Common/pixels.scss";

type BlackOutlineWhiteLineProps = { d: string; blackStroke?: number; whiteStroke?: number; color?: string };
export const BlackOutlineWhiteLine: FC<BlackOutlineWhiteLineProps> = ({ d, blackStroke = 4, whiteStroke = 3, color = "white" }) => (
    <>
        <path stroke="black" strokeWidth={blackStroke} strokeLinecap="round" d={d}></path>
        <path stroke={color} strokeWidth={whiteStroke} strokeLinecap="round" d={d}></path>
    </>
);

const PFD: FC = () => {
    return (
        <>
            <div className="LcdOverlay" style={{ opacity: "0.2" }} />
            <svg className="pfd-svg" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
                <Horizon />
                <VSI />

                <path className="gray-bg" d="M13 100, h100 v560 h -100 Z" />
                <path className="gray-bg" d="M600 100, h100 v560 h-100 Z" />
                <path className="gray-bg" d="M130 0, h450, v60, h-450 Z" />
                <path className="gray-bg" d="M142 785, h412, c -103 -140, -306 -140, -412 0 Z" />
                <HeadingDisplay />

                {/* FMA lines */}
                <BlackOutlineWhiteLine d="M286 0, v60" />
                <BlackOutlineWhiteLine d="M428 0, v60" />

                <SpeedTape />
                <CommandSpeed />
                <SpeedScroller />
                <MachGS />

                <AltitudeTape />
                <AltitudeScroller />
            </svg>
        </>
    );
};

render(<PFD />);
