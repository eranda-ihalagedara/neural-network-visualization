// Color Map
function interpolate(start, end, fraction) {
    return [
        Math.floor(start[0] + fraction * (end[0] - start[0])),
        Math.floor(start[1] + fraction * (end[1] - start[1])),
        Math.floor(start[2] + fraction * (end[2] - start[2])),
    ];
}

function rgbToHex(rgb) {
    return "#" + rgb.map(component => {
        const hex = component.toString(16);
        return hex.length === 1? "0" + hex : hex;
    }).join("");
}

export function getViridisColor(value) {
    const viridisColors = [
        [68, 1, 84],
        [33, 144, 141],
        [253, 231, 37],
    ];

    if (value < 0.5) {
        return rgbToHex(interpolate(viridisColors[0], viridisColors[1], value / 0.5));
    } else {
        return rgbToHex(interpolate(viridisColors[1], viridisColors[2], (value - 0.5) / 0.5));
    }
}

export function getViridisColor_r(value) {
    return getViridisColor(1-value);
}

export function getYlGnBuColor(value) {
    const YlGnBuColors_r = [
        [255, 255, 217],
        [67, 183, 195],
        [8, 28, 88],
    ];

    if (value < 0.5) {
        return rgbToHex(interpolate(YlGnBuColors_r[0], YlGnBuColors_r[1], value / 0.5));
    } else {
        return rgbToHex(interpolate(YlGnBuColors_r[1], YlGnBuColors_r[2], (value - 0.5) / 0.5));
    }
}
export function getYlGnBuColor_r(value) {
    return getYlGnBuColor(1-value);
}
