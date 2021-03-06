/**
 * Debug rendering of the map.
 */

import * as core from "./core.js";

export interface Settings {
    canvas: HTMLCanvasElement;
    scale: number;
    showPongTime: number;
}

export class Renderer {
    private readonly ctx: CanvasRenderingContext2D;
    private readonly background: ImageData;
    private pongs: core.Pong[];
    private pongTTL = -1;

    constructor(
        readonly map: core.GameMap,
        readonly ship: core.Ship,
        readonly settings: Settings,
    ) {
        settings.canvas.width = settings.scale * map.width;
        settings.canvas.height = settings.scale * map.height;
        this.ctx = settings.canvas.getContext("2d");
        // Pre-render the background image
        this.background = this.ctx.createImageData(settings.canvas.width, settings.canvas.height);
        const data = this.background.data;
        const cellTypeToColour = [0xffffff, 0x000000, 0xffbbbb, 0xffffbb];
        // Manually scale the image up - not pretty!
        for (let y = 0; y < map.width; ++y) {
            for (let x = 0; x < map.width; ++x) {
                const colour = cellTypeToColour[map.cells[y * map.width + x]];
                for (let yy = 0; yy < settings.scale; ++yy) {
                    for (let xx = 0; xx < settings.scale; ++xx) {
                        const idx = map.width * settings.scale * (settings.scale * y + yy)
                            + (settings.scale * x + xx);
                        data[4 * idx + 0] = (colour >> 16) & 0xff;
                        data[4 * idx + 1] = (colour >> 8) & 0xff;
                        data[4 * idx + 2] = (colour) & 0xff;
                        data[4 * idx + 3] = 255;
                    }
                }
            }
        }
    }

    addPongs(pongs: core.Pong[]) {
        this.pongs = pongs;
        this.pongTTL = this.settings.showPongTime;
    }

    draw(): void {
        // Background
        this.ctx.putImageData(this.background, 0, 0);

        // Transform
        this.ctx.resetTransform();
        this.ctx.scale(this.settings.scale, this.settings.scale);

        // Routes
        for (const [route, stroke] of [[0, "#0000ff"], [1, "#0088ff"]]) {
            if (this.map.routes.length <= route) {
                continue;
            }
            this.ctx.strokeStyle = stroke as string;
            this.ctx.lineWidth = .5 / this.settings.scale;
            this.ctx.beginPath();
            this.ctx.moveTo(this.map.start[0] + 0.5, this.map.start[1] + 0.5);
            for (const breadcrumb of this.map.routes[route]) {
                this.ctx.lineTo(breadcrumb[0] + 0.5, breadcrumb[1] + 0.5);
            }
            this.ctx.stroke();
        }

        // Pongs
        if (this.pongTTL > 0) {
            for (const pong of this.pongs) {
                this.ctx.fillStyle = "#00ff00";
                this.ctx.fillRect(pong.hit[0], pong.hit[1], 1, 1);
            }
            this.pongTTL -= core.TickTime;
        }

        // Ship
        this.ctx.beginPath();
        this.ctx.arc(this.ship.position[0], this.ship.position[1], core.ShipRadius, 0, 2 * Math.PI);
        this.ctx.fillStyle = "#ff0000";
        this.ctx.fill();
        const shipFrontAngle = 0.25 * Math.PI;
        this.ctx.beginPath();
        this.ctx.moveTo(this.ship.position[0], this.ship.position[1]);
        this.ctx.arc(this.ship.position[0], this.ship.position[1], core.ShipRadius + 0.25,
            Math.PI / 2 - shipFrontAngle + this.ship.bearing,
            Math.PI / 2 + shipFrontAngle + this.ship.bearing);
        this.ctx.fillStyle = "#00aa00";
        this.ctx.fill();
    }
}

